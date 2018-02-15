/**
 * @ngdoc controller
 * @name tanslate.jobsReceivedController
 * @function
 * 
 * @description
 * Controller for managing the received jobs view
 */

 (function() {
     'use strict';

     function receivedController(
         $scope,
         $routeParams, 
         translateJobService,
         notificationsService,
         translateCultureService
        ) {

            var vm = this;

            vm.loaded = false;

            vm.cultureId = $routeParams.id;
            vm.statusRange = [10,19]; // recevied
            vm.culture = {};
            vm.pageTitle = "";

            getCultureInfo($routeParams.id);
         
            //////////////
            function getCultureInfo(cultureId) {
                translateCultureService.getCultureInfo(cultureId)
                    .then(function(result) {
                        vm.culture = result.data;
                        vm.pageTitle = "Received translations : " + vm.culture.DisplayName;
                        vm.pageDescription = "Jobs that have been recevied back from the translators";

                    });
            }

         }

        angular.module("umbraco")
            .controller("translate.jobsReceivedController", receivedController);

 })();
