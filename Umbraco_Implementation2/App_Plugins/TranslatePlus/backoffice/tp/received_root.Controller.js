/**
 * @ngdoc controller
 * @name translate.receviedRootController
 * @function
 * 
 * @description
 * Controller for the root view.
 */
(function() {
    'use strict';

    function rootController($scope, $routeParams
        ,translateJobService) 
    {
        var vm = this;
        vm.pageTitle = "Recevied";
        vm.open = {};

        loadJobInfo(); 

        ////////////////

        function loadJobInfo() {
            translateJobService.getSummaryRange(10,19)
                .then(function(result) {
                    vm.info = result.data;
                });
        }

    }

    angular.module('umbraco')
        .controller('translate.receivedRootController', rootController);
})(); 