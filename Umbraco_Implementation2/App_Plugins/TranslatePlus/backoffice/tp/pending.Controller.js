/**
 * @ngdoc controller
 * @name translate.jobsPendingController
 * @function
 * 
 * @description
 * Controller for managing the pending jobs.
 */

(function() {
    'use strict';

    function pendingController( $scope, $rootScope, $routeParams, notificationsService,
        translateNodeService, translateJobService, translateSetService, translateCultureService)
    {
        var vm = this;
        vm.loaded = false; 
        vm.pickerOpen = true;

        vm.cultureId = $routeParams.id;
        vm.status = 0;
        vm.rootScope = $rootScope;

        vm.set = undefined;
        vm.pageTitle = "";
         
        vm.sets = [];

        vm.items = [];
        vm.submitState = "init";

        vm.job = {
            Name : new Date().toLocaleDateString(),
            TargetCulture : {},
            ProviderProperties : {},
            provider: null,
            Status: 'Pending'
        };

        vm.createOptions = {
            singleProvider: false,
            key: "" 
        };

        vm.createAndSubmitJob = createAndSubmitJob;
        
        vm.refresh = refresh;

        vm.refresh();
        getCultureInfo(vm.cultureId);

        //////////////
        function getCultureInfo(cultureId) {
            translateCultureService.getCultureInfo(cultureId)
                .then(function(result) {
                    vm.job.TargetCulture = result.data;
                    vm.job.Name = vm.job.TargetCulture.DisplayName + " translation " + new Date().toLocaleString();
                    vm.pageTitle = "Pending translations : " + vm.job.TargetCulture.DisplayName;
                    vm.pageDescription = "Items that need to be assigned a translation job";
                });
        }

        $scope.$watch("vm.items", function (newVal, oldVal) {
            if (vm.items !== undefined) {
                if (vm.items.length > 0) {
                    CheckSets();
                }
            }
        }, true); 


        function CheckSets() {
            for (var i = 0; i < vm.items.length; i++) {
                if (vm.items[i].selected == true) {
                    if (vm.sets.indexOf(vm.items[i].SetKey) < 0) {
                        vm.sets.push(vm.items[i].SetKey);
                    }
                }
                else if (vm.sets.indexOf(vm.items[i].SetKey) > -1) {
                    vm.sets.splice(vm.sets.indexOf(vm.items[i].SetKey), 1);
                }
            }

            if (vm.sets.length == 1) {
                if (vm.set == undefined || vm.set.Key != vm.set[0]) {
                    LoadSet(vm.sets[0]);
                }
            }
            else {
                vm.set = undefined;
            }
        }
         
        function LoadSet(setKey) {
            translateSetService.getByKey(setKey) 
                .then(function(result) {
                    vm.set = result.data;
                    if (vm.set.ProviderKey != "00000000-0000-0000-0000-000000000000") {
                        vm.createOptions.key = vm.set.ProviderKey;
                        vm.createOptions.singleProvider = true;
                    }
                });
        }


        function createAndSubmitJob() {
            vm.submitState = "busy";

            translateJobService.create(vm.job.Name, vm.items, vm.job.provider.Key, vm.job.ProviderProperties) 
                .then(function(result) {
                    notificationsService
                        .success("created", "your job has been created");
                    vm.refresh();
                    vm.submitState = "success";

                    window.location.href = "#/translatePlus/tp/job/" + result.data.Id;
                }, function (error) {
                    vm.submitState = "error";
                    notificationsService
                        .error("failed", error.data.ExceptionMessage);
                });
        }

        function removeAll() {
            // removes all the pending items... needs to have confirmation?
            translateJobService.removeAll()
        }

        function refresh() {
            vm.loaded = false; 
            vm.rootScope.$broadcast('translate-reloaded'); 
        }
    }

    angular.module('umbraco')
        .controller('translate.jobsPendingController', pendingController);

})();