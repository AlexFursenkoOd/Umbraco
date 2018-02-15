/**
 * @ngdoc service
 * @name translatejobService
 * @function
 * 
 * @description
 * Service for getting and setting job things...
 */

(function() {
    'use strict';

    // var serviceRoot = "backoffice/translateplus/translationJobApi/";
  

    function jobService($http, localizationService) {

        var serviceRoot = Umbraco.Sys.ServerVariables.translatePlus.JobService;

        var service = {
            getAll: getAll,
            getById: getById,
            getFullById: getFullById,
            getByCultureId: getByCultureId,
            getByCultureAndStatus: getByCultureAndStatus,
            getArchivedByCulture: getArchivedByCulture,

            getAllNodesInJob: getAllNodesInJob,
            getNodesByJob: getNodesByJob,

            getSummaryInfo: getSummaryInfo,
            getSummaryRange: getSummaryRange,

            create: create,
            submit: submit,
            check: check,
            checkById: checkById,
            approve: approve,
            archiveJob: archiveJob,
            cancel: cancel,
            remove: remove,

            getProviders: getProviders,
            getProvider: getProvider,
            
            getStatusName: getStatusName
        }

        return service;

        ////////////

        function getAll() {
            return $http.get(serviceRoot + "GetAll");
        }

        function getById(id) {
            return $http.get(serviceRoot + "Get/" + id);
        }

        function getFullById(id) {
            return $http.get(serviceRoot + "GetFull/" + id);
        }

        function getByCultureId(id) {
            return $http.get(serviceRoot + "GetByCultureId/" + id + "?page=1");
        }

        function getByCultureAndStatus(cultureId, statusMin, statusMax, page) {
            return $http.get(serviceRoot + "GetByCultureAndStatus/" + 
                        cultureId + "?min=" + statusMin + "&max=" + statusMax + "&page=" + page);
        }

        function getArchivedByCulture(cultureId, page) {
            return $http.get(serviceRoot + "GetArchivedByCulture/" + cultureId + "?page=" + page);
        }

        function getSummaryInfo(status) {
            return $http.get(serviceRoot + "GetSummaryInfo?status=" + status);
        }

        function getSummaryRange(minStatus, maxStatus) {
            return $http.get(serviceRoot + "GetSummaryRange?min=" + minStatus + "&max=" + maxStatus);
        }

        function getAllNodesInJob(jobId) {
            return $http.get(serviceRoot + "GetAllNodesInJob/" + jobId);
        }

        function getNodesByJob(jobId, page) {
            return $http.get(serviceRoot + "GetNodesByJob/" + jobId + "?page=" + page);
        }


        function create(name, nodes, providerKey, providerOptions) {

            var createOptions = {
                Name : name,
                ProviderKey : providerKey,
                Nodes: nodes,
                ProviderOptions : providerOptions
            };


            return $http.post(serviceRoot + "Create", createOptions);
        }

        function submit(id) {
            return $http.post(serviceRoot + "Submit/" + id);
        }

        function check() {
            return $http.get(serviceRoot + "GetPending");
        }

        function checkById(id) {
            return $http.get(serviceRoot + "GetPendingById/" + id);
        }

        function approve(id, nodes, publish) {

            var approveOptions = {
                NodeIds: nodes, 
                Publish: publish
            };

            return $http.post(serviceRoot + "Approve/" + id, approveOptions);
        }

        function archiveJob(id) {
            return $http.post(serviceRoot + "ArchiveJob/" + id);
        }

        function cancel(id) {
            return $http.post(serviceRoot + "Cancel/" + id);
        }

        function remove(id) {
            return $http.post(serviceRoot + "Remove/" + id);
        }

        function removeAll(id) {
            return $http.post(serviceRoot + "RemoveAll/" + id);
        }

        function getProviders () {
            return $http.get(serviceRoot + "GetProviders");
        }

        function getProvider(key) {
            return $http.get(serviceRoot + "GetProvider/" + key);
        }

        function getStatusName(jobStatus) {
            // TODO: Locallize the status name.
            // return jobStatus;
            // return localizationService.localize("translateJobStatus_" + jobStatus);
            return jobStatus;
        }

    }

    angular.module('umbraco.resources')
        .factory('translateJobService', jobService);
})();

