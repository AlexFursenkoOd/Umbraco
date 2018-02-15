(function () {

    'use strict';


    function dictionaryController($scope, notificationsService,
        translateDictionaryService,
        translateSetService)
    {
        var vm = this;
        vm.selectedSet = null;

        vm.send = send;

        vm.sitesPicked = sitesPicked;

        vm.page = {
            title: 'Translate Dictionary Items',
            description: 'Send dictionary items to be translated'
        }


        translateSetService.list()
            .then(function (result) {
                vm.sets = result.data;
            });


        translateDictionaryService.getRootItems()
            .then(function (result) {
                vm.items = result.data;
                vm.items.forEach(function (item) {
                    item.checked = true;
                });
            })

        ///////////////////////

        function send() {

            var setId = vm.selectedSet.Id;
            var sites = [];
            var items = [];
            
            vm.selectedSet.Sites.forEach(function (site) {
                if (site.checked == true) {
                    sites.push(site.Id)
                }
            });

            vm.items.forEach(function (item) {
                if (item.checked == true) {
                    items.push(item.Id);
                }
            });

            translateDictionaryService.createDictionaryNodes(setId, sites, items)
                .then(function (result) {
                    notificationsService.success("Created", "Pending translations created");
                }, function (error) {
                    notificationsService
                        .error("Error", "Error creating dictionary translations");
                });

        }

        function sitesPicked() {
            if (vm.selectedSet == null)
                return false;

            var sitePicked = false; 
            vm.selectedSet.Sites.forEach(function (site) {
                if (site.checked == true) {
                    sitePicked = true;
                }
            });

            var itemsPicked = false;
            vm.items.forEach(function (item) {
                if (item.checked == true) {
                    itemsPicked = true;
                }
            });

            return sitePicked && itemsPicked; 

        }
    }

    angular.module('umbraco')
        .controller('translateDictionaryController', dictionaryController);

})();