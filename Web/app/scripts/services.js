'use strict';
angular.module('testManagerApp')
    .constant("baseURL", "http://localhost:3000/")
    .service('menuFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

        return $resource(baseURL + "cuestionarios/:id", null, {
            'update': {
                method: 'PUT'
            }
        });

    }])

    .factory('favoriteFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

        return $resource(baseURL + "favorites/:id", null, {
            'update': {
                method: 'PUT'
            }
        });

    }])

    .factory('exportFactory', function () {
        var ex = {};
        ex.exportTest = function (cuest, filename) {

            filename = filename + '.json';
            //Se resetea el id, las respuestas y las estadisticas
            delete cuest._id;
            cuest.tests = [];
            cuest.stats = [];
            if (typeof cuest === 'object') {
                cuest = JSON.stringify(cuest, undefined, 2);
            }
            var blob = new Blob([cuest], {
                type: 'text/json'
            });

            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blob, filename);
            } else {
                var e = document.createEvent('MouseEvents'),
                    a = document.createElement('a');

                a.download = filename;
                a.href = window.URL.createObjectURL(blob);
                a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
                e.initEvent('click', true, false, window,
                    0, 0, 0, 0, 0, false, false, false, false, 0, null);
                a.dispatchEvent(e);
            }
        };
        return ex;
    })

    .factory('$localStorage', ['$window', function ($window) {
        return {
            store: function (key, value) {
                $window.localStorage[key] = value;
            },
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            remove: function (key) {
                $window.localStorage.removeItem(key);
            },
            storeObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key, defaultValue) {
                return JSON.parse($window.localStorage[key] || defaultValue);
            }
        }
    }])

    .factory('AuthFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', 'baseURL', 'ngDialog', function ($resource, $http, $localStorage, $rootScope, $window, baseURL, ngDialog) {

        var authFac = {};
        var TOKEN_KEY = 'Token';
        var isAuthenticated = false;
        var username = '';
        var authToken = undefined;


        function loadUserCredentials() {
            var credentials = $localStorage.getObject(TOKEN_KEY, '{}');
            if (credentials.username != undefined) {
                useCredentials(credentials);
            }
        }

        function storeUserCredentials(credentials) {
            $localStorage.storeObject(TOKEN_KEY, credentials);
            useCredentials(credentials);
        }

        function useCredentials(credentials) {
            isAuthenticated = true;
            username = credentials.username;
            authToken = credentials.token;
            // Set the token as header for your requests!
            $http.defaults.headers.common['x-access-token'] = authToken;
        }

        function destroyUserCredentials() {
            authToken = undefined;
            username = '';
            isAuthenticated = false;
            $http.defaults.headers.common['x-access-token'] = authToken;
            $localStorage.remove(TOKEN_KEY);
        }

        authFac.login = function (loginData) {

            $resource(baseURL + "users/login")
                .save(loginData,
                function (response) {
                    storeUserCredentials({
                        username: loginData.username,
                        token: response.token
                    });
                    $rootScope.$broadcast('login:Successful');
                },
                function (response) {
                    isAuthenticated = false;

                    var message = '\
                <div class="ngdialog-message">\
                <div><h3>Login Unsuccessful</h3></div>' +
                        '<div><p>' + response.data.err.message + '</p><p>' +
                        response.data.err.name + '</p></div>' +
                        '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>\
                </div>'

                    ngDialog.openConfirm({
                        template: message,
                        plain: 'true'
                    });
                }

                );

        };

        authFac.logout = function () {
            $resource(baseURL + "users/logout").get(function (response) { });
            destroyUserCredentials();
        };

        authFac.register = function (registerData) {

            $resource(baseURL + "users/register")
                .save(registerData,
                function (response) {
                    authFac.login({
                        username: registerData.username,
                        password: registerData.password
                    });
                    if (registerData.rememberMe) {
                        $localStorage.storeObject('userinfo', {
                            username: registerData.username,
                            password: registerData.password
                        });
                    }

                    $rootScope.$broadcast('registration:Successful');
                },
                function (response) {

                    var message = '\
                <div class="ngdialog-message">\
                <div><h3>Registration Unsuccessful</h3></div>' +
                        '<div><p>' + response.data.err.message +
                        '</p><p>' + response.data.err.name + '</p></div>';

                    ngDialog.openConfirm({
                        template: message,
                        plain: 'true'
                    });

                }

                );
        };

        authFac.isAuthenticated = function () {
            return isAuthenticated;
        };

        authFac.getUsername = function () {
            return username;
        };

        loadUserCredentials();

        return authFac;

    }]);