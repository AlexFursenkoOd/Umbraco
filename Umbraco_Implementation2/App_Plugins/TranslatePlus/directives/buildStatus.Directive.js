/**
 * @ngdoc directive
 * @name: translateAppStatus
 * @function: 
 * 
 * @description:
 *  simple directive to show app status (beta badge etc...)
 * 
 */

(function () {

    'use strict';

    function appStatusDirective() {

        var directive = {
            restrict: 'E',
            replace: true,
            templateUrl: Umbraco.Sys.ServerVariables.translatePlus.Plugin + 'directives/status.html'
        };

        return directive;
    }

    angular.module('umbraco.directives')
        .directive('translateAppStatus', appStatusDirective);

})();