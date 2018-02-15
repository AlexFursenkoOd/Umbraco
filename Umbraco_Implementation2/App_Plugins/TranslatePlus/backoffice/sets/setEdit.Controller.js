angular.module("umbraco").controller("translate.setEditController",
    function ($scope, $routeParams, $location,
        localizationService,
        notificationsService,
        navigationService,
        translateSetService,
        translateJobService) {

        var vm = this;
        vm.loaded = false; 

        vm.set = {};
        vm.isLicenced = true;
        vm.buttonState = 'init';
        vm.pageTitle = "Translation set";

        vm.loadSettings = loadSettings; 
        vm.saveSettings = saveSettings;
        vm.isComplete = isComplete;

        vm.delete = deleteSet;

        vm.checkSetIntegrity = checkSetIntegrity;

        if ($routeParams.id != '-1') {
            navigationService.syncTree({
                tree: 'sets',
                path: ['-1', '-101', $routeParams.id],
                forceReload: true
            });
        }

        vm.tabs = [{ id: 1, label: "Set Info" }];

        if ($routeParams.id !== undefined) {
            vm.setId = $routeParams.id;
            vm.loadSettings(vm.setId);
        }

        $scope.$watch('vm.controls', function () {
            if (vm.controls !== undefined) {
                vm.checkSetIntegrity();
            }
        }, true);

        ////////////////

        function loadSettings(id) {
            translateSetService.getSettings(id)
                .then(function (result) {
                    vm.controls = result.data;
                    vm.loaded = true;
                }, function (error) {
                    notificationsService.error("Error", "Failed to load settings");
                    vm.loaded = true;
                });
        }

        function saveSettings() {
            vm.buttonState = "busy";
            translateSetService.saveSettings(vm.setId, vm.controls)
                .then(function (result) {
                    vm.buttonState = "success";
                    notificationsService.success("Set Saved",
                        localizationService.localize("translateUpdates_setSaved")
                    );
                    window.location.href = '#/settings/sets/setedit/' + result.data;
                }, function (error) {
                    vm.buttonState = "error";
                    notificationsService.error("Save Failed", error.data.ExceptionMessage);
                });
        }

        function isComplete() {
            if (vm.controls !== undefined) {
                if (vm.controls[0].value != ""
                    && vm.controls[0].value != undefined
                    && vm.controls[1].value.length > 0
                    && vm.controls[1].value != undefined
                    && vm.controls[2].value.length > 0) {
                    return true;
                }
            }
            return false;
        }

        function checkSetIntegrity() {
            vm.circular = false;

            if (vm.controls[1].value.length > 0
                && vm.controls[2].value.length > 0) {
                var masterId = vm.controls[1].value[0].id;

                vm.controls[2].value.forEach(function (set) {
                    if (masterId == set.id) {
                        vm.circular = true;
                    }
                });
            }
        }

        function deleteSet (set) {
            if (confirm("Are you sure you want to delete this set? That's quite drastic!"))
            {
                translateSetService.delete(set.Id)
                    .then(function (result) {
                        notificationsService.success("Deleted", "the set is gone.");
                    }, function(error){
                        notificationsService.error("Delete Failed", error.data.ExceptionMessage);
                    });
            }
        }

        translateSetService.isLicenced()
            .then(function(result) {
                vm.isLicenced = (result.data.isLicenced);
            });
    });