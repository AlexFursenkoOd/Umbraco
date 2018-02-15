/**
 * @ngdoc controller
 * @name translate.archiveRootController
 * @function
 * 
 * @description
 * Controller for the root view.
 */
(function () {
    'use strict';

    function rootController($scope, $routeParams
        , translateJobService) {
        var vm = this;
        vm.pageTitle = "Archive";
        vm.open = {};

    }

    angular.module('umbraco')
        .controller('translate.archiveRootController', rootController);
})(); 