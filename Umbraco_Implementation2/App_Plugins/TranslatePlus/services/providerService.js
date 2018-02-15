/**
  * @ngdoc service
  * @name translateProviderService
  * @function
  *
  * @description
  *  handling provider settings
  */
  (function () {
    'use strict';

    function providerService($http) {

        var serviceRoot = Umbraco.Sys.ServerVariables.translatePlus.ProviderService;

        var service = {

            getSettings: getSettings,
            saveSettings: saveSettings

        }

        return service; 

        //////////////////////

        function getSettings(key) {
            return $http.get(serviceRoot + "GetSettings/" + key);
        }

        function saveSettings(key, settings) {
            return $http.post(serviceRoot + "SaveSettings/" + key, settings);
        }

    }

    angular.module('umbraco.resources')
        .factory('translateProviderService', providerService);

})();