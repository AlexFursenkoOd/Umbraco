/**
 * @ngdoc controller
 * @name translate.pendingRootController
 * @function
 * 
 * @description
 * Controller for the root view.
 */
(function() {
    'use strict';

    function rootController($scope, $routeParams
        ,translateNodeService) 
    {
        var vm = this;
        vm.pageTitle = "Incoming Items";
        vm.open = {};
        vm.loaded = false; 

        loadLanguages(); 

        ////////////////

        function loadLanguages() {
            translateNodeService.getSummaryInfo(0)
                .then(function(result) {
                    vm.open = result.data;
                    vm.loaded = true;
                });
        }

    }

    angular.module('umbraco')
        .controller('translate.pendingRootController', rootController);
})(); 