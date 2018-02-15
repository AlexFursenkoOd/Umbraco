(function() {
    'use strict';

    function translatorService($http) {

        var serviceRoot = 'backoffice/translator/translatorApi/';

        var service = {
            getCounts: getCounts,
            getJobs: getJobs,
            updateProperties: updateProperties,
            submitJob: submitJob
        };

        return service;

        ////////////////////
        function getJobs(cultureId, page) {
            return $http.get( serviceRoot + "GetTranslations/" + cultureId + "?page=" + page);
        }

        function updateProperties(nodeId, properties) {
            return $http.post(serviceRoot + "UpdateProperties/" + nodeId, properties);
        }

        function submitJob(jobId, nodes) {
            return $http.post(serviceRoot + "SubmitJob/" + jobId, nodes);
        }

        function getCounts() {
            return $http.get(serviceRoot + "GetLanguageCounts");
        }

    }

    angular.module('umbraco')
        .factory('translatorService', translatorService);

    

})();