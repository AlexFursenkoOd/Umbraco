/**
 * @ngdoc service
 * @name translateSettingsService
 * @function
 * 
 * @description
 *  Settings service, to get and save stuff...
 */
(function () {
    'use strict';

    function settingsService($http) {

        var serviceRoot = Umbraco.Sys.ServerVariables.translatePlus.SettingsService;

        var service = {
            getSettings: getSettings,
            saveSettings: saveSettings,
            getInfo: getInfo
        };

        return service;

        ////////////////////////////

        function getSettings() {
            return $http.get(serviceRoot + "GetSettings");
        }

        function saveSettings(settings) {
            return $http.post(serviceRoot + "SaveSettings", settings);
        }

        function getInfo() {
            return $http.get(serviceRoot + "GetInfo");
        }

        function addSections(userId) {
            return $http.post(serviceRoot + "AddSections/" + userId);
        }
    }

    angular.module('umbraco.resources')
        .factory('translateSettingsService', settingsService);
})();