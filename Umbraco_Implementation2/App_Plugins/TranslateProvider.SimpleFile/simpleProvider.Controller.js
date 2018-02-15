/**
 * @ngdoc Controller
 * @name translate.SimpleProviderController
 * @function
 * 
 * @description 
 *  Controller for the simple provider
 *
 *  Is included via a directive, and should have
 *  access to the jobs object
 *  
 *  mostly you should only care about job.options 
 *  the options object has options.settings
 *  which will be passed as a string, if it's stored in JSON
 *  then that is the providers issue to deal with? 
 */

 (function() {
     'use strict';

     function XliffPendingController($scope, translateProviderService)
     {
         var vm = this;
         vm.name = 'Xliff Provider';
         vm.formatDefined = false; 
         vm.formatName = "";
         vm.loaded = false;

         vm.formats = [
             { name: 'xliff 2.0', value: 'xliff2' },
             { name: 'xliff 1.2', value: 'xliff1' }
         ];

         translateProviderService.getSettings("F13DB88B-5CA2-4691-9125-7B89B243E438")
             .then(function (result) {
                 vm.settings = result.data;
                 setup();
             });

         function setup() {
             if (vm.settings.format != undefined && vm.settings.format != '') {
                 vm.format = vm.settings.format;
                 vm.formatDefined = true;
                 vm.formatName = vm.format;
                 $scope.job.ProviderProperties = {
                     format: vm.format
                 };
             }
             else {
                 $scope.$watch("pvm.format", function (newValue, oldValue) {
                     if (newValue != undefined && newValue.length != 0 && $scope.job != undefined) {
                         $scope.job.ProviderProperties = {
                             format: newValue.value
                         };

                         vm.formatName = newValue.name;
                     }
                 });
             }

             vm.loaded = true;

         }
     }

     angular.module("umbraco")
         .controller("translate.XliffPendingController", XliffPendingController);


     function simpleController($scope, $rootScope, translateProviderService, notificationsService, translateFileUploadService) {

        var vm = this;

        vm.fileSelected = fileSelected;
        vm.uploadFile = uploadFile;
        vm.uploading = false; 
        vm.file = undefined; 

        vm.uploadButtonState = 'init';

        vm.rootScope = $rootScope;

        vm.name = 'File provider options';
        vm.format = [];

        vm.formats = [
            { name: 'xliff 2.0', value: 'xliff2' },
            { name: 'xliff 1.2', value: 'xliff1' },
            { name: 'Editor Defined', value: '' }
        ];


        //////////////////////

        translateProviderService.getSettings("F13DB88B-5CA2-4691-9125-7B89B243E438")
            .then(function (result) {
                vm.settings = result.data;
            });

        ////////////////////////

        function fileSelected(files) {
            vm.file = files;
        }

        function uploadFile() {
            if (vm.uploading)
                return;

            if (vm.file === undefined)
                return;

            var job = $scope.job;

            vm.uploading = true;

            vm.uploadButtonState = 'busy';

            translateFileUploadService.upload(vm.file, job.Id)
                .then(function (result) {
                    if (result) {
                        notificationsService.success("Success",
                            "File saved to server");
                    }
                    $scope.uploading = false;
                    vm.uploadButtonState = 'success';
                    vm.rootScope.$broadcast('translate-job-reloaded');
                }, function (error) {
                    notificationsService.error("Error", "Upload Failed " + error.data.Message);
                    $scope.uploading = false;
                    vm.uploadButtonState = 'error';
                });
        }


        if ($scope.view == 'Submitted') {
            // jsonify the properties 
            $scope.$watch("job", function (newValue, oldValue) {
                if (newValue != undefined) {
                    vm.properties = angular.fromJson(newValue.ProviderProperties);
                }
            }, true);
        }
    }

    angular.module("umbraco")
        .controller("translate.simpleProviderController",
            simpleController
        );
 })();