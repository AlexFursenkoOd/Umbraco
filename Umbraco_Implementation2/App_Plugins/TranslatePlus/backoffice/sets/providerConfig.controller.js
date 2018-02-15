(function() {

    function providerController($scope, $routeParams, notificationsService,
        translateJobService, translateProviderService) 
    {
        var vm = this;

        vm.page = {
            title: "provider name",
            description: "some provider"
        };

        vm.key = $routeParams.id;
        vm.hasView = false;
        vm.loaded = false;

        vm.save = saveSettings;

        getProvider(vm.key);

        //////////////////////////////

        function getProvider(key) {
            translateJobService.getProvider(key)
                .then(function (result) {
                    vm.provider = result.data;
                    vm.page.title = vm.provider.Name;
                    vm.page.description = vm.provider.Key;

                    vm.hasView = (vm.provider.Views.Config !== undefined &&
                        vm.provider.Views.Config.length > 0);

                    vm.loaded = true;

                    getSettings(vm.provider.Key);
                });
        }

        function getSettings(key) {
            translateProviderService.getSettings(key)
                .then(function (result) {
                    vm.settings = result.data;

                    // we fire this, so dependent provider controllers can wait for the settings
                    $scope.$broadcast('tp_providerSettings');

                }, function (error) {
                    notificationsService.error("Error", "Failed to load settings");
                });
        }

        function saveSettings() {
            translateProviderService.saveSettings(vm.provider.Key, vm.settings)
                .then(function (result) {
                    notificationsService
                        .success("saved", "Settings updated ");
                }, function (error) {
                    notificationsService.error("Error", "Failed to save settings");
                });
            
        }
    }

    angular.module('umbraco')
        .controller('translate.ProviderConfigController', providerController);
})();