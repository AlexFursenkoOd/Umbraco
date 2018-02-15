(function () {
    'use strict'; 

    function createDialogController($scope,
        navigationService,
        dialogService,
        translateSetService) {

        var vm = this;
        vm.loaded = false;

        vm.save = save;  
        vm.cancel = cancel;

        //////////////////////
        function save() {
            // save the name....
            translateSetService.create(vm.name)
                .then(function (result) {
                    window.location.href = '#/settings/sets/setedit/' + result.data;
                });
        }

        function cancel() {
            navigationService.hideDialog();
        }

    }

    angular.module('umbraco')
        .controller('translateSetCreate.controller', createDialogController);

})();