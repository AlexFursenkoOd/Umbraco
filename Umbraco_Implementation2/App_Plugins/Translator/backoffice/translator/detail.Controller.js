(function () {
    'use strict';

    function detailController($scope, $routeParams, $window,
        localizationService,
        translateNodeService,
        translatorService,
        notificationsService)
    {
        var vm = this;
        vm.loaded = false;
        vm.page = {
            title: "detail",
            description: "detail description"
        };

        vm.node = {};

        vm.editValue = editValue;
        vm.saveValue = saveValue;
        vm.cancel = cancelEdit;

        vm.isValue = isValue;

        vm.saveAll = save;
        vm.cancelAll = cancel;

        loadNode($routeParams.id);

        //////////////////

        function loadNode(nodeId) 
        {
            translateNodeService.getNode(nodeId)
                .then(function (result) {
                    vm.loaded = true;
                    vm.node = result.data;

                    vm.page.title = vm.node.MasterNodeName
                        + " to "
                        + vm.node.TargetNodeName;

                    localizationService.localize("translate_translation")
                        .then(function (value) {
                            vm.page.description = vm.node.Culture.DisplayName + " " + value;
                        });

                    vm.node.editable = false; 
                    if (vm.node.Status == 'InProgress' || vm.node.Status == 'Updated') {
                        vm.node.editable = true;
                    }

                    makeValueProperties(vm.node.Groups);

                });
        }


        function saveValue(value) {
            if (value.HtmlControl) {
                value.Value = value.editor.value;
            }
            else {
                value.Value = value.editValue;
            }

            value.Translated = true;
            value.editing = false; 
        }

        function editValue(value) {
            value.editing = true;
            if (value.HtmlControl) {
                value.editor.value = value.Value;
            }
            else {
                value.editValue = value.Value;
            }
        }

        function cancelEdit(value) {

            if (value.HtmlControl) {
                value.editor.value = value.Value;
            }

            value.Translated = false;
            value.editing = false;
        }

        function save() {
            // do the full save back to the system here...
            translatorService.updateProperties(vm.node.Id, vm.node.Groups)
                .then(function (result) {
                    notificationsService
                        .success("Saved",
                            localizationService.localize("translateUpdates_properties")
                        );

                    // redirect back in history....
                    $window.history.back();

                });
        }

        function cancel() {
            $window.history.back();
        }

        function makeValueProperties(propertyGroups) {

            angular.forEach(propertyGroups, function (group, key) {
                angular.forEach(group.Properties, function (property, key) {
                    makeValue(property.Target)
                })
            });

        }

        function isValue(value) {

            if (value.InnerValues == undefined || angular.equals({}, value.InnerValues))
                return true; 

            console.log(value)

            return false;

        }

        function makeValue(value) {

            if (value.InnerValues && !angular.equals(value.InnerValues, {})) {
                angular.forEach(value.InnerValues, function (innerValue, key) {
                    makeValue(innerValue);
                });
            }
            else {
                if (value.HtmlControl) {
                    value.editValue = value.Value;
                    value.editor = {
                        label: 'bodyText',
                        description: 'Load some stuff here',
                        view: 'rte',
                        config: {
                            editor: {
                                toolbar: ["code", "undo", "redo", "cut", "bold", "italic"],
                                stylesheets: [],
                                dimensions: { height: 300, width: '100%' }
                            }
                        },
                        value: value.editValue
                    };
                }
            }
        };
    }

    angular.module('umbraco')
        .controller('translate.detailController', detailController);
})();