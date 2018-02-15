(function() {
    'use strict';

    function langController($scope, $routeParams,
        translateCultureService,
        translatorService,
        translateJobService,
        localizationService,
        notificationsService)
    {


        var vm = this;
        vm.pageNo = 1; 
        vm.loaded = false;
        vm.cultureId = $routeParams.id;

        vm.page = {
            title: "Translations",
            description: ""
        };

        vm.viewJob = viewJob;

        // init
        getCultureInfo(vm.cultureId);

        ///////////////////
        function viewJob(job) {
            window.location.href = "#/translator/translator/job/" + job.Id;
        }

        ///////////////////
        function getCultureInfo(cultureId) {
            translateCultureService.getCultureInfo(cultureId)
                .then(function (result) {
                    vm.culture = result.data;

                    localizationService.localize("translate_translations")
                        .then(function (value) {
                            vm.page.title = value + " " + vm.culture.DisplayName;
                        });

                    vm.page.description =
                        localizationService.localize("translate_awaiting");
                });
        }

        function getJobs(cultureId, page) {
            translatorService.getJobs(cultureId, page)
                .then(function (result) {
                    vm.results = result.data;
                    vm.loaded = true;
                    calculateProgress(vm.results.Items);
                }, function (error) {
                    notificationsService.error("Error", error.data.ExceptionMessage);
                });
        }

        function calculateProgress(jobs) {
            jobs.forEach(function (job) {
                job.progress = 0;
                job.totalDone = '.';
                job.totalCount = '.';

                translateJobService.getAllNodesInJob(job.Id)
                    .then(function (result) {
                        calculateJobProgress(job, result.data);
                        job.NodeCount = result.data.length;
                    });
            });
        }

        function calculateJobProgress(job, nodes) {

            var complete = 0;
            var count = 0;

            nodes.forEach(function (node) {
                node.Groups.forEach(function (group) {
                    group.Properties.forEach(function (property) {
                        var counters = recurseProgress(property.Target);
                        complete += counters.done;
                        count += counters.count;
                    });
                });
            });

            job.progress = complete / count * 100;
            job.totalDone = complete;
            job.totalCount = count;
        }          

        function recurseProgress(value) {

            var counters = {
                count: 0,
                done: 0
            };

            if (!IsEmpty(value.InnerValues)) {
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

        function refreshView() {
            vm.loaded = false;
            getJobs(vm.cultureId, vm.pageNo);
        }

        vm.nextPage = function () {
            vm.pageNo++;
            refreshView();
        }

        vm.prevPage = function () {
            vm.pageNo--;
            refreshView();
        }

        vm.goToPage = function (pageNo) {
            vm.pageNo = pageNo;
            refreshView();
        }

        refreshView();

    }

    angular.module('umbraco')
        .controller('translator.langController', langController);
})(); 