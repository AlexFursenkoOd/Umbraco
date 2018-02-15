/**
 * @ngdoc directive
 * @name translateItemView
 * @function
 * 
 * @description
 *  drives the item (node) view across the back office
 */

(function () {
    'use strict';

    function itemViewDirective(entityResource,
        translateNodeService, notificationsService) {

        var directive = {
            restrict: 'E',
            replace: true,
            templateUrl: Umbraco.Sys.ServerVariables.translatePlus.Plugin + 'Directives/ItemView.html',
            scope: {
                allowRemove: "=",
                selectable: "=",
                selectedByDefault: "=",
                culture: "=",
                status: "=",
                job: "=",
                selectedItems: "="
            },
            link: link,
            controller: controller
        };

        return directive;

        //////////////////////////////////////

        function link(scope, el, attr, ctrl) {

            scope.refreshParent = scope.$parent.vm.refresh;

            scope.viewItem = function (item) {
                window.location.href = "#/translatePlus/tp/item/" + item.Id;
            }

            scope.removeItem = function (item) {
                translateNodeService.remove(item.Id)
                    .then(function (response) {
                        notificationsService.success("delete", "item removed");
                        scope.refreshView();
                    })
            }

            scope.hasOpenNode = function (item) {
                if (item != undefined) {
                    return (item.HasOpenSiblings && item.Status != 'Approved');
                }
                return false; 
            }

            scope.allSelected = scope.selectedByDefault;
            scope.refreshView();
        }

        function controller($scope,
            translateNodeService,
            translateJobService,
            notificationsService) {

            $scope.page = 1;
            $scope.loaded = false;

            $scope.selectAllButtonState = 'init';

            $scope.selectItem = function (item) {
                if (item.Status != 'Approved') {
                    // item.selected = !item.selected;
                    generateSelectedIds();
                }
            }

            $scope.selectAll = function () {
                $scope.allSelected = !$scope.allSelected;

                for (var i = 0; i < $scope.results.Items.length; i++) {
                    if ($scope.results.Items[i].selectable) {
                        $scope.results.Items[i].selected = $scope.allSelected;
                    }
                }

                generateSelectedIds();
            }

            $scope.removeAll = removeAll;
            $scope.selectAllItems = selectAllItems;
            $scope.deselectAllItems = deselectAllItems;
            $scope.selectedItems = [];

            $scope.isSelectable = isSelectable;
            $scope.selectItemsState = selectItemsState;

            $scope.refreshView = refreshView;

            ///////////////////////////
            $scope.$on('translate-reloaded', function (event, args) {
                $scope.refreshView();
            });

            $scope.$on('translate-parentloaded', function (event, args) {
                $scope.selectItemsState();
            });

            ///////////////////////////

            function generateSelectedIds() {
                angular.forEach($scope.results.Items, function (value, key) {
                    if (value.selected) {
                        if (!isItemSelected(value)) {
                            $scope.selectedItems.push(value);
                        }
                    }
                    else {
                        removeItem(value);
                    }
                });
            }

            function isItemSelected(item) {
                for (var i = 0; i < $scope.selectedItems.length; i++) {
                    if ($scope.selectedItems[i].Id == item.Id) {
                        return true;
                    }
                }
                return false;
            }

            function removeItem(item) {
                for (var i = 0; i < $scope.selectedItems.length; i++) {
                    if ($scope.selectedItems[i].Id == item.Id) {
                        $scope.selectedItems.splice(i, 1);
                        return;
                    }
                }
            }

            function removeAll() {

                if (confirm("are you sure you want to remove all the pending items?")) {
                    translateNodeService.removeAll($scope.culture)
                        .then(function (result) {
                            notificationsService.success("removed", "all items removed");
                            $scope.refreshView();
                        }, function (error) {
                            notificationsService.error("failed", "failed to remove " + error.data.ExceptionMessage);
                        });
                }
            }

            function selectAllItems() {


                if ($scope.culture != undefined) {
                    $scope.selectAllButtonState = 'busy';
                    translateNodeService.getAllNodesByStatus($scope.culture, $scope.status)
                        .then(function (result) {
                            $scope.selectedItems = result.data;
                            $scope.allSelected = true;
                            selectItemsState();
                            $scope.selectAllButtonState = 'success';
                        });
                }
                else if ($scope.job != undefined) {
                    // get by job.
                    $scope.selectAllButtonState = 'busy';

                    translateJobService.getAllNodesInJob($scope.job)
                        .then(function (result) {
                            $scope.allSelected = true;

                            $scope.selectedItems = [];
                            result.data.forEach(function (value) {
                                value.selectable = isSelectable(value);
                                if (value.selectable) {
                                    $scope.selectedItems.push(value);
                                }
                            });

                            $scope.allSelected = true;
                            selectItemsState();
                            $scope.selectAllButtonState = 'success';
                        });
                }
            }

            function deselectAllItems()
            {
                $scope.allSelected = false; 
                $scope.selectedItems = [];
                selectItemsState();
            }

            function selectItemsState() {
                if ($scope.results != undefined) {
                    var _wholePagePicked = true;
                    angular.forEach($scope.results.Items, function (value, key) {

                        value.selectable = $scope.selectable && isSelectable(value);
                        value.active = isActive(value);

                        if (value.selectable) {
                            value.selected = isItemSelected(value);
                            if (!value.selected) {
                                _wholePagePicked = false;
                            }
                        }
                    });

                    $scope.allSelected = _wholePagePicked;
                }
            }

            function loadItemsByStatus(culture, status, page) {
                translateNodeService.getNodesByStatus(culture, status, page)
                    .then(function (result) {
                        $scope.results = result.data;
                        if ($scope.selectedByDefault) {
                            selectAllItems();
                        }
                        else {
                            selectItemsState();
                        }
                        $scope.loaded = true;
                    }, function (error) {
                        notificationsService
                            .error("Load Failed", error.data.ExceptionMessage);
                    });
            }

            function loadItemsByJob(jobId, page) {

                if ($scope.selectedByDefault) {
                    selectAllItems();
                }

                translateJobService.getNodesByJob(jobId, page)
                    .then(function (result) {
                        $scope.results = result.data;
                        selectItemsState();
                        $scope.loaded = true;
                    }, function (error) {
                        notificationsService
                            .error("Load Failed", error.data.ExceptionMessage);
                    });
            }

            function refreshView() {
                $scope.allSelected = false; 
                if ($scope.job != undefined) {
                    loadItemsByJob($scope.job, $scope.page);
                }
                else {
                    loadItemsByStatus($scope.culture, $scope.status, $scope.page);
                }
            }

            function isSelectable(item)
            {
                return item.Status == "Reviewing" || item.Status == 'Open';
            }

            function isActive(item) {
                return item.Status != 'Approved' && item.Status != 'Closed';
            }

            /*
            if ($scope.selectedByDefault === true) {
                $scope.selectAllItems();
            }
            */

            ////////////////////////////
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
        }

    }

    angular.module('umbraco.directives').directive('translateItemView', itemViewDirective);

})();




