/**
 *
 *
 */

(function () {

    'use strict';

    function providerPickerDirective() {

        var directive = {
            restrict: 'E',
            replace: true,
            templateUrl: Umbraco.Sys.ServerVariables.translatePlus.Plugin + "Directives/providerView.html",
            scope: {
                settings: '=',
                items: '=',
            },
            link: link,
            controller: controller
        };

        return directive;

        ///////////////////

        function link(scope, el, attr, ctrl) {

        }

        function controller($scope, translateJobService) {

            var vm = this;

            $scope.singleProvider = false;
            $scope.providers = [];
            // $scope.settings.options = {};

            $scope.getProviders = function () {
                translateJobService.getProviders()
                    .then(function (result) {
                        $scope.providers = result.data;
                    });
            };

            $scope.getProvider = function (key) {
                translateJobService.getProvider(key)
                    .then(function (result) {
                        $scope.selectedProvider = result.data;
                    });
            }

            if ($scope.providerKey != undefined) {
                $scope.getProvider(providerKey);
                $scope.singleProvider = true;
            }
            else {
                $scope.getProviders();
            }

            $scope.$watch('selectedProvider', function (newVal, oldVal) {
                if (newVal != undefined) {
                    $scope.settings.key = newVal.Key;
                }
            });

        }

    }

    angular.module('umbraco.directives')
        .directive('translateProviderPicker', providerPickerDirective);

})();