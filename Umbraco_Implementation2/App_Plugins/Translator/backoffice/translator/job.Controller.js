(function() {
    'use strict';

    function jobController($scope, $routeParams, $q,
        localizationService,
        translateJobService,
        translateNodeService, 
        translatorService,
        notificationsService) {
        var vm = this;
        vm.loaded = false;
        vm.page = {
            title: "",
            description: ""
        };

        vm.submitbuttonState = 'init';

        vm.jobId = $routeParams.id;

        vm.job = {};

        vm.submitJob = submitJob;
        vm.viewNode = viewNode;
        vm.viewLang = viewLang;
        vm.pageNo = 1;

        refresh($routeParams.id, vm.pageNo);

        ////////////////////

        function refresh(jobId, pageId) {
            vm.job.ready = false; 

            var promises = [];

            loadJob(promises, jobId);
            loadNodes(promises, jobId, pageId);

            $q.all(promises)
                .then(function () {
                    calculateProgress(vm.nodes.Items);
                });
        }

        function submitJob() {

            vm.submitbuttonState = 'busy';

            translatorService.submitJob(vm.job.Id, vm.Nodes)
                .then(function (result) {
                    notificationsService.success('Saved',
                        localizationService.localize("translator_returned")
                    );

                    refresh(vm.job.Id, vm.pageNo);
                    vm.submitbuttonState = 'success';

                }, function (error) {
                    notificationsService.error('Failed', error.data.ExceptionMessage);
                    vm.submitbuttonState = 'error';
                });
        }

        function viewNode(node) {
            window.location.href = "#/translator/translator/detail/" + node.Id;
        }

        function viewLang(job) {
            window.location.href = '#/translator/translator/lang/' + job.TargetCulture.LCID;
        }

        ////////////////////

        function loadJob(promiseArray, id) {

            promiseArray.push(
                translateJobService.getById(id)
                .then(function (result) {
                    vm.job = result.data;
                    vm.page.title = vm.job.Name + " [ " + 
                        vm.job.SourceCulture.DisplayName + " to " +
                        vm.job.TargetCulture.DisplayName + " ] "
                    vm.page.description = vm.job.Status;
                }, function (error) {
                    notificationsService.error("Not Found", error.data.ExceptionMessage);
                })
            );
        }

        function calculateProgress(nodes) {


            for (var n = 0; n < nodes.length;n++) {

                var done = 0;
                var count = 0;

                if (nodes[n].Status == 'Updated') {
                    vm.job.ready = true;
                }

                for (var g = 0; g < nodes[n].Groups.length; g++) {
                    for (var p = 0; p < nodes[n].Groups[g].Properties.length; p++) {
                        var counters = recurseProgress(nodes[n].Groups[g].Properties[p].Target);
                        done += counters.done;
                        count += counters.count;
                    }
                }

                nodes[n].progress = done / count * 100;
                nodes[n].valueCount = count;
                nodes[n].doneCount = done;
            };
        }

        function recurseProgress(value) {

            var counters = {
                count: 0,
                done: 0
            };

            if (!IsEmpty(value.InnerValues))
            {
                for (var key in value.InnerValues) {
                    var progress = recurseProgress(value.InnerValues[key]);
                    counters.count += progress.count;
                    counters.done += progress.done;
                }
            }
            else {
                if (value.Translated == true) {
                    counters.done++
                }
                counters.count++;
            }

            return counters;
        }

        function IsEmpty(o) {
            if (!o || angular.equals(o, {})) {
                return true;
            }
            return false; 
        }

        function loadNodes(promiseArray, id, page) {
            promiseArray.push(
                translateJobService.getNodesByJob(id, page)
                    .then(function (result) {
                        vm.nodes = result.data;
                        vm.loaded = true;
                    }, function (error) {
                        notificationsService
                            .error("Cannot load nodes", error.data.ExceptionMessage);
                    })
            );
        }

        vm.nextPage = function () {
            vm.pageNo++;
            loadNodes([], vm.jobId, vm.pageNo);
        }

        vm.prevPage = function () {
            vm.pageNo--;
            loadNodes([], vm.jobId, vm.pageNo);
        }

        vm.goToPage = function (pageNo) {
            vm.pageNo = pageNo;
            loadNodes([], vm.jobId, vm.pageNo);
        }



    }

    angular.module('umbraco')
        .controller('translate.jobController', jobController);
})();