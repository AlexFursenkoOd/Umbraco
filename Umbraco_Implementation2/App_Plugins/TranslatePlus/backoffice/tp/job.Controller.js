/**
 * @ngdoc Controller
 * @name translate.jobViewController
 * @function
 * 
 * @description
 * Controller for the view of a job
 */
(function() {

    'use strict';

    function jobViewController($scope, $rootScope, $routeParams, 
        notificationsService, localizationService,
        translateJobService) {

            var vm = this;
            vm.pageTitle = "Job Detail..." + $routeParams.id;
            vm.description = "";
            vm.provider = "";
            vm.loaded = false;
            vm.picked = false;
            vm.items = [];

            vm.working = false;
            vm.checkButtonState = 'init';
            vm.cancelButtonState = 'init';
            vm.removeButtonState = 'init';

            vm.rootScope = $rootScope;

            vm.itemDetailView = false;
            vm.selectable = false; 
            vm.job = {};
            vm.jobId = $routeParams.id;

            vm.cancelJob = cancelJob ;
            vm.removeJob = removeJob ;
            vm.clearItemDetailView = clearItemDetailView;
            vm.checkJob = checkJob;
            vm.refresh = refresh;

            vm.buttonGroup = {
                state: 'init',
                defaultButton: {
                    labelKey: "translate_approvePublish",
                    handler: approvePublish
                },
                subButtons: [
                    {
                        labelKey: "translate_approveJobOnly",
                        handler: archiveJob
                    },
                    {
                        labelKey: "translate_approve",
                        handler: approve
                    }
                ]
            }

            vm.refresh()

            ////////////// Init 

            function loadJob(id) {
                translateJobService.getById(id)
                    .then(function(result) {
                        vm.job = result.data;

                        if (vm.job != "null") {

                            vm.pageTitle = vm.job.Name + " [ " +
                                vm.job.SourceCulture.DisplayName + " to " +
                                vm.job.TargetCulture.DisplayName + " ] ";

                            vm.description = vm.job.Status + " via " + vm.job.ProviderName;
                            getLocalizedStatus(vm.job);
                            getProvider(vm.job.ProviderKey);

                            if (vm.job.Status == 'Received' || vm.job.Status == 'Partial') {
                                vm.selectable = true;
                            }
                            else {
                                vm.selectable = false;
                            }

                            vm.rootScope.$broadcast('translate-parentloaded');
                        }
                        vm.loaded = true;


                    }, function(error) {
                        notificationsService.error("Not Found", error.data.ExceptionMessage);
                    });
            }

            function getLocalizedStatus(item) {
                if (item.localStatus === undefined) {
                    item.localStatus = "working...";
                    localizationService.localize("translateJobStatus_" + item.Status)
                        .then(function(value) {
                            if (value != null) {
                                item.localStatus = value;
                            }
                        });;
                }

                return item.localStatus;
            }

            function getProvider(key) {
                translateJobService.getProvider(key)
                    .then(function(result) {
                        vm.job.provider = result.data;
                    });
            }

            function refresh() {
                vm.rootScope.$broadcast('translate-reloaded');
                loadJob($routeParams.id);
            }

            ///////////////////////////
            $scope.$on('translate-job-reloaded', function (event, args) {
                loadJob($routeParams.id);
            });


            //////////////

            function cancelJob(job) {
                vm.cancelButtonState = 'busy';
                vm.working = true;
                translateJobService.cancel(job.Id)
                    .then(function(result){
                        notificationsService
                            .success("cancelled", "the job has been canceled - all nodes have been reset.");
                        refresh();
                        vm.working = false;
                        vm.cancelButtonState = 'success';
                    }, function(error) {
                        notificationsService
                            .error("Error", "Unable to cancel the job");
                        vm.working = false;
                        vm.cancelButtonState = 'error';
                    });

            }

            function removeJob(job) {
                vm.working = true;
                vm.removeButtonState = 'busy';
                translateJobService.remove(job.Id)
                    .then(function(result){
                        notificationsService
                            .success("remove", "the job has been removed");
                        refresh();
                        vm.working = false;
                        vm.removeButtonState = 'success';
                    }, function(error) {
                        notificationsService
                            .error("Error", "Unable to remove the job");
                        vm.working = false;
                        vm.removeButtonState = 'error';
                    });
            }

            function checkJob(job) {
                vm.checkButtonState = 'busy';
                vm.working = true;
                translateJobService.checkById(job.Id)
                    .then(function (result) {

                        var msg = "The job has been checked";
                        if (result.data == 0) {
                            var msg = "Job has been checked but is not ready for collection";
                        }

                        notificationsService
                            .success("Job Checked", msg);
                        refresh();
                        vm.working = false;
                        vm.checkButtonState = 'success';
                    }, function (error) {
                        notificationsService
                            .error("Error", "Unable to check the job: " + error.data.Message);
                        vm.working = false;
                        vm.checkButtonState = 'error';
                    });

            }

            ////// approval 
            function approvePublish() {
                performApproval(vm.job, true);
            }

            function approve() {
                performApproval(vm.job, false);
            }

            function archiveJob() {
                // just approve the job, not the nodes in the job...
                translateJobService.archiveJob(vm.job.Id)
                    .then(function (result) {
                        notificationsService
                            .success("approved", "Translation job approved");
                        vm.buttonGroup.state = 'success';
                        vm.refresh();
                    }, function (error) {
                        vm.buttonGroup.state = 'error';
                        notificationsService
                            .error("failed", error.data.ExceptionMessage);
                    });

            }

            function performApproval(job, publish)
            {
                vm.buttonGroup.state = 'busy';
                
                var nodeIds = [];
                for (var i = 0; i < vm.items.length; i++) {
                    nodeIds.push(vm.items[i].Id)
                }

                if (nodeIds.length == 0) {
                    vm.buttonGroup.state = 'error';
                    notificationsService.error("Failed", "You have to select some nodes to approve");
                    return;
                }

                translateJobService.approve(job.Id, nodeIds, publish)
                    .then(function(result) {
                        notificationsService
                            .success("approved", "translation job approved");
                        vm.buttonGroup.state = 'success';

                        vm.rootScope.$broadcast('translate-reloaded');

                        vm.refresh();                            
                    }, function(error) {
                        vm.buttonGroup.state = 'error';
                        notificationsService
                            .error("failed", error.data.ExceptionMessage);
                    });
            }

            /////// view controll            

            function clearItemDetailView() {
                vm.itemDetailView = false; 
            }
        }

    angular.module('umbraco')
        .controller('translate.jobViewController', jobViewController);

})();
