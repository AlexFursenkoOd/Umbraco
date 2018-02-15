(function () {
    'use strict';

    function providerViewDirective() {

        var directive = {
            restrict: 'E',
            replace: true,
            templateUrl: Umbraco.Sys.ServerVariables.translatePlus.Plugin + "Directives/providerView.html",
            scope: {
                job: '=',
                view: '='
            },
            link: link,
            controller: controller
        };

        return directive;

        function link(scope, el, attr, ctrl) {
        }

        function controller($scope) {

            if ($scope.job != undefined && $scope.job.provider != undefined) {
                SetView($scope.job.provider, $scope.view);
            }
            else {
                $scope.$watch("job.provider", function (newValue, oldValue) {
                    if (newValue != undefined && newValue != null) {
                        if ($scope.view != undefined) {
                            $scope.providerViewPath = SetView(newValue, $scope.view);
                        }
                    }
                });
            }

            function SetView(provider, viewName) {
                if (viewName == 'Submitted') {
                    return provider.Views.Submitted;
                }
                else if (viewName == 'Pending') {
                    return provider.Views.Pending;
                }
                else if(viewName == 'Config') {
                    return provider.Views.Config;
                }

                return undefined;
            }
        }
    }

    angular.module('umbraco.directives')
        .directive('translateProviderView', providerViewDirective);

})();