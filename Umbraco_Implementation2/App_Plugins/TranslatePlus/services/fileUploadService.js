/**
  * @ngdoc service
  * @name fileUploadService
  * @function
  *
  * @description
  *  Service for handling uploaded files
  */
  (function () {
    'use strict';

    function fileUploadService($http) {

        var service = {
            upload : uploadFileToServer
        };

        return service; 

        ///////////////

        function uploadFileToServer(file, jobId) {
            var request = {
                file: file,
                jobId: jobId
            };

            return $http({
                method: 'POST',
                url: 'backoffice/translateplus/SimpleProviderFileApi/uploadFile',
                headers: { 'Content-Type': undefined },
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("file", data.file);
                    formData.append("jobId", data.jobId);
                    return formData;
                },
                data: request
            }).then(function (response) {
                if (response) {
                    var fileName = response.data;
                    return fileName;
                }
                else {
                    return false;
                }
            });
        }
    }

    angular.module('umbraco.resources')
        .factory('translateFileUploadService', fileUploadService);
})();