(function () {

    'use strict';

    function dashboardController($scope, translatorService) {

        var vm = this;
        vm.loaded = false;


        vm.counts = [];

        function getCounts() {
            translatorService.getCounts()
                .then(function (result) {
                    vm.counts = result.data;
                    vm.loaded = true;
                });
        }


        getCounts();

    }

    angular.module('umbraco')
        .controller('translatorDashboard.controller', dashboardController);

})();