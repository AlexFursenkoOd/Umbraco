(function () {

    'use strict';

    function dictionaryService($http) {

        var serviceRoot = Umbraco.Sys.ServerVariables.translatePlus.DictionaryService;

        var service = {
            createDictionaryNodes: createDictionaryNodes,
            getRootItems : getRootItems
        };

        return service;

        ///////////////////////

        function createDictionaryNodes(setId, sites, items) {

            var options = {
                sites: sites,
                items: items
            };

            return $http.post(serviceRoot + "CreateDictionaryNodes?setId=" + setId, options);
        }

        function getRootItems() {
            return $http.get(serviceRoot + "GetRootItems");
        }

    }

    angular.module('umbraco.services')
        .factory('translateDictionaryService', dictionaryService);



})();