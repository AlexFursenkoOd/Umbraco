(function () {

    function accessController($scope,
        translatorLangUserService,
        localizationService,
        notificationsService,
        navigationService) {

        var vm = this;

        vm.langId = $scope.currentNode.id;
        vm.loaded = false;
        vm.authusers = [];
        vm.users = [];

        vm.getLangUsers = getLangUsers;
        vm.getUmbracoUsers = getUmbracoUsers;

        vm.addUser = addUser;
        vm.showUsername = showUsername;

        vm.remove = remove;
        vm.save = save;

        ///////////////

        function addUser() {
            var langUser = {
                UserId: vm.selectedUser.Id,
                LangId: vm.langId
            };

            vm.authusers.push(langUser);
        }

        function showUsername(authUser)
        {
            if (authUser.name != undefined)
                return authUser.name;

            for (var i=0; i < vm.users.length; i++) {
                if (vm.users[i].Id == authUser.UserId) {
                    authUser.name = vm.users[i].Name;
                    return authUser.name
                }
            }
        }

        function remove(index) {
            vm.authusers.splice(index, 1);
        }

        function save() {
            translatorLangUserService.saveUsers(vm.langId, vm.authusers)
                .then(function (result) {
                    notificationsService.success("Saved",
                        localizationService.localize("translator_permissionsSaved"));
                    navigationService.hideDialog();
                }, function (error) {
                    notificationsService.error("Error", error.data.ExceptionMessage);
                });;
        }

        function getLangUsers(lang) {
            translatorLangUserService.getByLang(lang)
                .then(function (result) {
                    vm.authusers = result.data;
                }, function (error) {
                    notificationsService.error("Error", error.data.ExceptionMessage);
                });
        }

        function getUmbracoUsers() {
            translatorLangUserService.getUsers()
                .then(function (result) {
                    vm.users = result.data;
                });
        }


        getUmbracoUsers();
        getLangUsers(vm.langId);
    }

    angular.module('umbraco')
        .controller('translatorAccess.Controller', accessController);

})();