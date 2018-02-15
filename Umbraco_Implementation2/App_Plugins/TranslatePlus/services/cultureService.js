/**
  * @ngdoc service
  * @name translateCultureService
  * @function
  *
  * @description
  * service for getting culture information.
  */

(function () {
    'use strict';

    function cultureService($http) {

        var service = {
            getCultureInfo: getCultureInfo
        }

        return service;

        ////////////

        function getCultureInfo(id) {

            var sr = Umbraco.Sys.ServerVariables.translatePlus.CultureService;

            return $http.get(sr + "GetCultureInfo/" + id)
                .then(getCultureInfoComplete, getCultureInfoFailed);
        }

        function getCultureInfoComplete(response) {
            return response;
        }

        function getCultureInfoFailed(error) {
            console.error('Failed to get culture' + error.data);
            return error.data;
        }

    }

    angular.module('umbraco.services')
        .factory('translateCultureService', cultureService);
})();
