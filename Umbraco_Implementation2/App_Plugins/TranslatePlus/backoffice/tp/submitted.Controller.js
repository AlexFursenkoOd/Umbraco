/**
 * @ngdoc controller
 * @name translate.jobsSubmittedController
 * @function
 * 
 * @description
 * Controller for managing jobs that have been submitted to translation
 */
(function() {
    'use strict';

    function submittedController($scope, $rootScope, $routeParams, notificationsService,
        translateJobService, translateCultureService)
        {
            var vm = this;
            vm.loaded = false; 

            vm.rootScope = $rootScope;

            vm.cultureId = $routeParams.id;
            vm.statusRange = [1, 9]; // submitted jobs...

            vm.culutre = {};
            vm.pageTitle = "";

            vm.jobs = [];

            vm.checkJobs = checkJobs;
            vm.checkButtonState = 'init';

            // vm.refresh();
            getCultureInfo(vm.cultureId);

            ///////////////
            function getCultureInfo(cultureId) {
                translateCultureService.getCultureInfo(cultureId)
                    .then(function(result) {
                        vm.culture = result.data;
                        vm.pageTitle = "Submitted translations : " + vm.culture.DisplayName;
                        vm.pageDescription = "Translations that have been sent to translation";

                    });
            }

            function checkJobs() {
                vm.checkButtonState = 'busy';
                translateJobService.check()
                    .then(function(result) {
                        notificationsService
                            .success("checked", result.data + " jobs have been updated");

                        // tell the directive to reload the items...
                        vm.rootScope.$broadcast('translate-reloaded'); 
                        vm.checkButtonState = 'success';

                    }, function(error) {
                        notificationsService.error("Error", error.data.ExceptionMessage);
                        vm.checkButtonState = 'error';
                    })
            }
        }

    angular.module("umbraco")
        .controller("translate.jobsSubmittedController", submittedController);
        
})();