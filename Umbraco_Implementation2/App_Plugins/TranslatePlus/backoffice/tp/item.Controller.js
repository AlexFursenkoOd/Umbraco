(function() {

    'use strict';

    function itemViewController($scope, $routeParams, 
        notificationsService,
        localizationService,
        translateNodeService)
    {

        var vm = this;

        vm.page = {
            title: 'item view',
            description: 'some item to be viewed'
        };

        vm.hasOpenNode = hasOpenNode;

        vm.removeProperty = removeProperty;
        vm.saveProperty = saveProperty;

        vm.refresh = refresh;

        vm.flipEdit = flipEdit;
        vm.hasChildren = hasChildren;

        loadItem($routeParams.id);

        ///////////////////

        function hasOpenNode() {
            if (vm.item != undefined) {
                return (vm.item.HasOpenSiblings && vm.item.Status != 'Approved');
            }

            return false; 
        }

        function flipEdit(target) {
            target.edit = !target.edit;

            if (target.edit) {
                target.tempValue = target.Value;
            }
            else {
                target.Value = target.tempValue;
            }
        }

        function saveProperty (item, property, target) {

            target.edit = false;

            translateNodeService.saveProperty(item.Id, property)
                .then(function (result) {
                    if (result.data) {
                        notificationsService.success('Updated',
                            localizationService.localize("translateUpdates_properties")
                        );
                    }
                });
        }

        function removeProperty(property) {
            translateNodeService.removeProperty(property.Id)
                .then(function (result) {
                    notificationsService.success("remove",
                        localizationService.localize("translateUpdates_propertyRemoved")
                    );
                    vm.refresh();
                });
        }

        function refresh() {
            loadItem($routeParams.id);
        }

        function hasChildren(value) {
            return !angular.equals(value.InnerValues, {});
        }

        ///////////////////

        function loadItem(id) {
            translateNodeService.getNode(id)
                .then(function (result) {
                    vm.item = result.data;
                    vm.page.title = vm.item.MasterNodeName + " to " + vm.item.TargetNodeName;
                    vm.page.description = vm.item.Status;

                    for (var i = 0; i < vm.item.Groups.length; i++) {
                        vm.item.Groups[i].displayName = vm.item.Groups[i].Name;
                    }

                }, function (error) {
                    notificationsService.error('Failed', error.data.ExceptionMessage);
                });
        }


    }

    angular.module('umbraco')
        .controller('translate.itemViewController', itemViewController);
    
})();