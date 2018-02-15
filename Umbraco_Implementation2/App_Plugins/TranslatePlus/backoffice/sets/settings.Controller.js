(function () {
    'use strict';

    function settingsController($scope, notificationsService,
        translateSettingsService) {

        var vm = this;

        vm.page = {
            title: 'Settings',
            description: 'Translate settings',
            tabs: [
                {
                    id: 1,
                    label: 'Setup',
                    alias: 'tab1',
                    active: false,
                    view: Umbraco.Sys.ServerVariables.translatePlus.BackOffice + 'settings/settings_tab.html'
                },
                {
                    id: 2,
                    label: 'Notifications',
                    alias: 'tab2',
                    active: true,
                    view: Umbraco.Sys.ServerVariables.translatePlus.BackOffice + 'settings/notify_tab.html'
                },
                {
                    id: 3,
                    label: 'Licence',
                    alias: 'tab3',
                    active: false,
                    view: Umbraco.Sys.ServerVariables.translatePlus.BackOffice + 'settings/licence_tab.html'
                },
                {
                    id: 4,
                    label: 'Diagnostics',
                    alias: 'tab4',
                    active: false,
                    view: Umbraco.Sys.ServerVariables.translatePlus.BackOffice + 'settings/diag_tab.html'
                }
            ]
        };

        vm.notifications = {
            submitted: "test@jumoo.co.uk", recevied: "", approved: ""
        };

        vm.getSettings = getSettings;
        vm.saveSettings = saveSettings;
        vm.licenced = false;
        vm.validLicence = false; 
        vm.info = {};

        getSettings();
        getInfo();

        //////////////////////////////////

        function getSettings() {
            translateSettingsService.getSettings()
                .then(function (result) {
                    vm.settings = result.data;
                }, function (error) {
                    notificationsService.error("Error", error.data.ExceptionMessage);
                });
        }

        function saveSettings(settings) {
            translateSettingsService.saveSettings(settings)
                .then(function (result) {
                    notificationsService.success("Saved", "Settings saved");
                    getSettings();
                }, function (error) {
                    notificationsService.error("Error", error.data.ExceptionMessage);
                });
        }

        function getInfo() {
            translateSettingsService.getInfo()
                .then(function (result) {
                    vm.info = result.data;
                })
        }

    }

    angular.module('umbraco')
        .controller('translateSettingsController', settingsController);
})();