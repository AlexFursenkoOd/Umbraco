/**
 * @ngdoc directive
 * @name translateFileUpload
 * @function
 * 
 * @description
 *    Handles the upload of files (for the simple provider)
 */
(function () {

    'use strict';

    function fileUploadDirective() {

        var directive = {
            restrict: 'E',
            scope: {
                file: '='
            },
            link: function (scope, el, attr, ctrl) {
                element.bind("change", function (event) {
                    $scope.$apply(function () {
                        $scope.file = event.target.files[0];
                    });
                });
            }
        }

    }

    angular.module('umbraco.directives')
        .directive('translateFileUpload', fileUploadDirective);


})();
