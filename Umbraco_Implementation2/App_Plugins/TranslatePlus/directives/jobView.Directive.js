/**
 * @ngdoc directive
 * @name translateJobView
 * @function
 * 
 * @description
 *  directive for showing jobs list
 */

 (function () {
    'use strict';

    function jobViewDirective(
        entityResource,
        translateJobService,
        localizationService
    ) {

        var directive = {
            restrict: 'E',
            replace: true,
            templateUrl: Umbraco.Sys.ServerVariables.translatePlus.Plugin + 'Directives/JobView.html',
            scope: {
                selectable: "=",
                actions: "=",
                statusRange: "=",
                culture: "=",
                archived: "="
            },
            link: link,
            controller: controller
        };

        return directive;

        ////////////

        function link(scope, el, attr, ctrl) {

            scope.selectAll = function() {
                for(var i=0;i<scope.result.Items.length;i++){
                    scope.resutl.jobs[i].seleted = scope.chkSelectAll;
                }
            }

            scope.showStatus = function(item) {
                if (item.localStatus === undefined) {
                    item.localStatus = "working...";
                    localizationService.localize("translateJobStatus_" + item.Status)
                        .then(function(value) {
                            if (value != null) {
                                item.localStatus = value;
                            }
                        });;
                }

                return item.localStatus;
            }

            scope.viewJob = function (jobId) {
                window.location.href = "#/translatePlus/tp/job/" + jobId;
            }
        }

        function controller($scope, notificationsService, translateJobService) {

            $scope.page = 1;
            $scope.loaded = false;
            $scope.refreshView = refreshView;

            ///////////////////////////
            $scope.$on('translate-reloaded', function (event, args) {
                $scope.refreshView();
            });

            //////////////////////////
            function loadResults(culture, status, page) {

                translateJobService.getByCultureAndStatus(culture, status[0], status[1], page)
                    .then(function (result) {
                        $scope.results = result.data;
                        $scope.loaded = true;
                    }, function (error) {
                        notificationsService
                            .error("Load Failed", error.data.ExceptionMessage);
                    });
            }

            function loadArchive(culture, page) {
                translateJobService.getArchivedByCulture(culture, page)
                    .then(function (result) {
                        $scope.results = result.data;
                        $scope.loaded = true;
                    }, function (error) {
                        notificationsService
                            .error("Load Failed", error.data.ErrorMessage);
                    });
            }



            function refreshView() {
                if ($scope.archived === true) {
                    loadArchive($scope.culture, $scope.page);
                }
                else {
                    loadResults($scope.culture, $scope.statusRange, $scope.page);
                }
            }

            $scope.nextPage = function () {
                $scope.page++;
                refreshView();
            }

            $scope.prevPage = function () {
                $scope.page--;
                refreshView();
            }

            $scope.goToPage = function (pageNo) {
                $scope.page = pageNo;
                refreshView();
            }

            refreshView();
            
        }
    }

    angular.module('umbraco.directives')
        .directive('translateJobView', jobViewDirective);
 })();