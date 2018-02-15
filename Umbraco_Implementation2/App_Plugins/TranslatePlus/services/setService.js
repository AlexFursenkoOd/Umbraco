/**
 * @ngdoc service
 * @name translateSetService
 * @function
 * 
 * @description
 * Service for managing the lifecycle of a translation set
 */
(function() {
    'use strict';

    function setService($http) {

        var serviceRoot = Umbraco.Sys.ServerVariables.translatePlus.SetService;

        var service = {
            list: list, 
            get: get,
            getByKey: getByKey,
            getByNode: getByNode,
            getTargets: getTargets,

            create: create,
            update: update,
            delete: deleteSet,

            lanaguage: languages,
            isLicenced: isLicenced,
            validLicence: validLicence,

            getContentNodeInfo: getContentNodeInfo,

            getSettings: getSettings,
            saveSettings: saveSettings
        }

        return service;

        ///////////////////
        function list() {
            return $http.get(serviceRoot + 'list');
        }

        function get(id) {
            return $http.get(serviceRoot + 'Get/' + id);
        }

        function getByKey(key) {
            return $http.get(serviceRoot + "GetByKey/" + key);
        }

        function getByNode(id) {
            return $http.get(serviceRoot + "GetByNode/" + id);
        }

        function getTargets(id, sites) {
            return $http.post(serviceRoot + "UpdateTargets/" + id, sites);
        }

        function create(name) {
            return $http.get(serviceRoot + "Create/?name=" + name);
        }

        function update(set) {
            return $http.post(serviceRoot + "Update", set);
        }

        function deleteSet(id) {
            return $http.delete(serviceRoot + "Delete/" + id);
        }

        function languages() {
            return $http.get(serviceRoot + "GetLanguages");
        }
        
        function isLicenced() {
            return $http.get(serviceRoot + "IsLicenced");
        }

        function validLicence() {
            return $http.get(serviceRoot + "ValidLicence");
        }

        function getSettings(id) {
            return $http.get(serviceRoot + "GetSettings/" + id);
        }

        function saveSettings(id, controls) {
            return $http.post(serviceRoot + "SaveSettings/" + id, controls);
        }


        /////////////////////////
        function getContentNodeInfo(id) {
            return $http.get(serviceRoot + "GetContentInfo/" + id);
        }
    }

    angular.module('umbraco.resources')
        .factory('translateSetService', setService);
})();