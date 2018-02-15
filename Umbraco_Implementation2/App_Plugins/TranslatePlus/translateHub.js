(function () {
    'use strict';

    function translateHub($rootScope, $q, assetsService) {

        var scripts = [
            "/App_Plugins/TranslatePlus/libs/jquery.signalR.min.js",
            "/umbraco/backoffice/signalr/hubs"];


        var resource = {
            initHub: initHub
        };

        return resource;

        ///////////////////

        function initHub(callback) {
            if ($.connection == undefined) {
                var promises = [];
                scripts.forEach(function (script) {
                    promises.push(assetsService.loadJs(script));
                });

                $q.all(promises)
                    .then(function () {
                        hubSetup(callback);
                    });
            }
            else {
                hubSetup(callback);
            }
        }


        function hubSetup(callback) {

            var proxy = $.connection.translatePlusHub;

            var hub = {
                start: function () {
                    $.connection.hub.start();
                },
                on: function (eventName, callback) {
                    proxy.on(eventName, function (result) {
                        $rootScope.$apply(function () {
                            if (callback) {
                                callback(result);
                            }
                        });
                    });
                },
                invoke: function (methodName, callback) {
                    proxy.invoke(methodName)
                        .done(function (result) {
                            $rootScope.$apply(function () {
                                if (callback)
                                    callback(result);
                            });
                        });
                }
            }

            return callback(hub);
        };
    }

    angular.module('umbraco.resources')
        .factory('translateHub', translateHub);

})();

