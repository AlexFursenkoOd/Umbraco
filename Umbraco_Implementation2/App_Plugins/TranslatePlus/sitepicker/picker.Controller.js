(function () {
    'use strict';

    function pickerController($scope, dialogService,
        contentResource, translateCultureService) {
        var vm = this;

        vm.loaded = false; 

        vm.value = $scope.model.value;
        vm.nodes = [];

        vm.select = selectDialog;
        vm.getTargetLanguage = getTargetLanguage;
        vm.remove = remove;

        vm.multi = $scope.model.config.multiPicker;

        getNodes();
       
        ///////////////////////////////

        function selectDialog() {
            dialogService.open({
                template: '/app_plugins/translateplus/sitepicker/sitepicker_dialog.html',
                show: true,
                callback: function (data) {

                    if (data.id != undefined) {
                        vm.loaded = false; 
                        vm.value.push(data);

                        contentResource.getById(data.id)
                            .then(function (content) {
                                vm.nodes.push(content);
                                vm.loaded = true;
                            });
                    }

                }
            })
        }

        function getNodes()
        {
            if (vm.value == undefined || vm.value.length == 0) {
                vm.loaded = true;
                return;
            }
            else {


                var nodeIds = vm.value.map(function (v) {
                    return v.id * 1;
                });

                contentResource.getByIds(nodeIds)
                    .then(function (contentArray) {
                        vm.nodes = contentArray;
                        vm.loaded = true;
                    });
            }
        }

        function remove(node) {
            for (var i = 0; i < vm.nodes.length; i++) {
                if (vm.nodes[i].id == node.id && vm.nodes[i].tptargetId == node.tptargetId) {
                    vm.nodes.splice(i, 1);
                    break;
                }
            }

            for (var i = 0; i < vm.value.length; i++) {
                if (vm.value[i].id == node.id && vm.value[i].culture == node.tptargetId) {
                    vm.value.splice(i, 1);
                    break;
                }
            }
        }

        function getTargetLanguage(node, index) {
            if (node.tptarget == undefined) {
                node.tptarget = "...";

                node.tptargetId = vm.value[index].culture;

                translateCultureService.getCultureInfo(vm.value[index].culture)
                    .then(function (result) {
                        node.tptarget = result.data.DisplayName;
                    });
            }

            return node.tptarget;
        }

    }

    angular.module('umbraco')
        .controller('translateSitePicker.Controller', pickerController);
})();