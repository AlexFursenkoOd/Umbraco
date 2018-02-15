(function () {
    'use strict';

    function langUserService($http) 
    {

        var serviceRoot = 'backoffice/translator/TranslatorLangUserApi/';

        var service = {

            getByLang: getByLang, 
            getByUser: getByUser,
            deleteEntry: deleteLangUser,
            addEntry: AddLangUser,

            getUsers: getUsers,

            saveUsers: saveUsers

        };

        return service; 

        ////////////////////////

        function getByLang(langId) {
            return $http.get(serviceRoot + "GetByLanguage/" + langId);
        }

        function getByUser(userId) {
            return $http.get(serviceRoot + "GetByUser/" + userId)
        }

        function deleteLangUser(id) {
            return $http.get(serviceRoot + "Delete/" + id);
        }

        function AddLangUser(user, lang) {
            return $http.post(serviceRoot + "Add/" + id + "?lang=" + lang);
        }

        function saveUsers(lang, users) {
            return $http.post(serviceRoot + "SaveUsers/" + lang, users);
        }

        function getUsers() {
            return $http.get(serviceRoot + "GetUsers");
        }
    }

    angular.module('umbraco')
        .factory('translatorLangUserService', langUserService);

})();