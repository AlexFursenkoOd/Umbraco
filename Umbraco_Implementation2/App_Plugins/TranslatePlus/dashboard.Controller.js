(function () {
    'use strict';

    function dashboardController(
        $scope,
        translateSetService,
        translateSettingsService) {
        var vm = this;
        vm.setup = true; 
        vm.info = '';

        getSets();
        getVersion();

        //////////////////

        function getSets() {
            translateSetService.list()
                .then(function (results) {
                    if (results.data.length == 0) {
                        vm.setup = false;
                    }
                }, function(error) {
                    // doh!
                });
        }

        function getVersion() {
            translateSettingsService.getInfo()
                .then(function (result) {
                    vm.info = result.data;
                });
        }
    }

    angular.module('umbraco')
        .controller('translatePlusDashboard.controller', dashboardController);

})();