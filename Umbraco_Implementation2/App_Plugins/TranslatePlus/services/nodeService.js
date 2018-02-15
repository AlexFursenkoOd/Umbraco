/**
 * @ngdoc service
 * @name translateNodeService
 * @function
 * 
 * @description
 * Service for creating the translation nodes
 */

(function() {
    'use strict';

    // var serviceRoot = "backoffice/translateplus/translationNodeApi/";
    

    function nodeService($http) {

        var serviceRoot = Umbraco.Sys.ServerVariables.translatePlus.NodeService;

        var service = {
            getNode : getNode,
            getNodes : getNodes,
            getAllNodesByStatus: getAllNodesByStatus,
            getNodesByStatus: getNodesByStatus,
            getCultures: getCultures,
            getSummaryInfo : getSummaryInfo,
            
            remove: remove,
            removeAll: removeAll,

            removeProperty: removeProperty,
            saveProperty: saveProperty,
            updateProperties: updateProperties,

            create : create
        };

        return service;

        /////////////////
        function getNode(id) {
            return $http.get(serviceRoot + "GetNode/" + id);
        }

        function getNodes(cultureId) {
            return $http.get(serviceRoot + "GetNodesByCultureId/" + cultureId);
        }

        function getAllNodesByStatus(cultureId, status) {
            return $http.get(serviceRoot + "GetAllNodesByCultureAndStatus/" + cultureId + "?status=" + status);
        }

        function getNodesByStatus(cultureId, status, page) {
            return $http.get(serviceRoot + "GetNodesByCultureAndStatus/" + cultureId + "?status=" + status + "&page=" + page);
        }

        function getCultures() {
            return $http.get(serviceRoot + "GetCultures");
        }

        function remove(id) {
            return $http.post(serviceRoot + "Remove/" + id);
        }

        function removeAll(cultureId) {
            return $http.post(serviceRoot + "RemoveAll/" + cultureId);
        }

        function removeProperty(id) {
            return $http.post(serviceRoot + "RemoveProperty/" + id);
        }

        function create(contentId, options) {
            return $http.post(serviceRoot + "Create/" + contentId, options);
        }

        function getSummaryInfo(status) {
            return $http.get(serviceRoot + "GetSummaryInfo?status=" + status);
        }

        function saveProperty(nodeId, property) {
            return $http.post(serviceRoot + "SaveProperty/" + nodeId, property);
        }

        function updateProperties(nodeId, properties) {
            return $http.post(serviceRoot + "UpdateProperties/" + nodeId, properties);
        }
    }

    angular.module('umbraco.resources')
        .factory('translateNodeService', nodeService);
})();