/**
 * @ngdoc controller
 * @name translate.jobArchiveController
 * @function 
 *
 * @description
 * Controller for managing the archived items
*/
(function () {
    'use strict';

    function archiveController($scope, $routeParams,
        localizationService,
        notificationsService,
        translateJobService,
        translateCultureService) {
        var vm = this;

        vm.cultureId = $routeParams.id;
        vm.culture = {};
        vm.pageTitle = "";

        //////////////////////
        function getCultureInfo(cultureId) {
            translateCultureService.getCultureInfo(cultureId)
                .then(function (result) {
                    vm.culture = result.data;

                    localizationService.localize("translate_archiveTitle")
                        .then(function (value) {
                            vm.pageTitle = value + " : " + vm.culture.DisplayName;
                        })

                    vm.pageDescription = 
                        localizationService.localize("translate_archiveDesc")

                });
        }
    }

    angular.module('umbraco')
        .controller('translate.jobsArchiveController', archiveController);
})();