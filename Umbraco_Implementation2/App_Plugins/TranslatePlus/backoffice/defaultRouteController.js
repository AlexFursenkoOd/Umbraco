angular.module('umbraco')
    .controller('translate.defaultRouteController', function ($scope, $routeParams, $http) {
        var vm = this;
        vm.id = $routeParams.id;

    });