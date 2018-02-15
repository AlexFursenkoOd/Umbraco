(function () {
    'use strict';

    function pickerDialog($scope, translateSetService) 
    {
        var vm = this;

        vm.section = "content";
        vm.treealias = "content"
        vm.treeParams = ""
        vm.selected = false;

        vm.site = {};

        $scope.treeEventHandler = $({});
        
        $scope.treeEventHandler.bind("treeLoaded", treeLoadedHandler);
        $scope.treeEventHandler.bind("treeNodeExpanded", nodeExpandedHandler);
        $scope.treeEventHandler.bind("treeNodeSelect", nodeSelectHandler);

        $scope.$on("$destroy", function () {
            $scope.treeEventHandler.unbind("treeLoaded", treeLoadedHandler);
            $scope.treeEventHandler.unbind("treeNodeExpanded", nodeExpandedHandler);
            $scope.treeEventHandler.unbind("treeNodeSelect", nodeSelectHandler);
        });
        

        //////////////////
        function treeLoadedHandler(ev, args) {
        }

        function nodeExpandedHandler(ev, args) {
        }

        function nodeSelectHandler(ev, args)
        {
            args.event.preventDefault();
            args.event.stopPropagation();

            // you need this bit for the tick.
            if ($scope.currentNode) {
                //un-select if there's a current one selected
                $scope.currentNode.selected = false;
            }

            $scope.currentNode = args.node;
            $scope.currentNode.selected = true;
            ///

            vm.site.id = args.node.id;

            translateSetService.getContentNodeInfo(vm.site.id)
                .then(function (result) {
                    vm.cultures = result.data;
                    if (vm.cultures.length > 0) {
                        vm.site.culture = vm.cultures[0].LCID;
                    }
                    vm.selected = true;
                }, function (error) {

                });
        }



    }

    angular.module('umbraco')
        .controller('translateSitepickerDialog.Controller', pickerDialog);

})();