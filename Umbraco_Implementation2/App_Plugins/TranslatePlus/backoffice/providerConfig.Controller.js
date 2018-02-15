/*
    a default controller, for provider configs, because a lot of the
    time you don't need to do anything much but pass the values about
*/
(function () {

    'use strict';

    function providerConfigController($scope) {

        var pvm = this;

    };


    angular.module('umbraco')
        .controller('translateDefaultProviderConfigController', providerConfigController);

})();