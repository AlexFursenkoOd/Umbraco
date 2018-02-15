(function() {

    'use strict';

    function providerViewController($scope, $routeParams) {

        var vm = this;
        vm.jobLink = "#/translator/translator/job/" + $routeParams.id;
    }

    angular.module('umbraco')
        .controller('translatorProviderViewController', providerViewController);

})();