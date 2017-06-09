/**
    Test-Manager
    Copyright (c) 2016 - 2017 Fernán Ramos Sáiz
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

 */

/**
 * @author Fernán Ramos Saiz
 * @version 1.0
 * @description Fichero que almacena los servicios que permiten la comunicación con el servidor Back-End
 */
'use strict';
angular.module('testManagerApp')
    /**
     * Constante que almacena la dirección donde se encuentra el servidor Node.js
     */
    .constant("baseURL", "http://localhost:3000/")

    /**
     * @ngdoc service
     * @name testManagerApp.factory:menuFactory
     * @description Factory que obtiene del servidor la ruta cuestionarios
     */
    .factory('menuFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

        return $resource(baseURL + "cuestionarios/:id", null, {
            'update': {
                method: 'PUT'
            }
        });

    }])
    /**
     * @ngdoc service
     * @name testManagerApp.factory:cloudFactory
     * @description Factory que obtiene del servidor la ruta cuestionarios/cloud -->
     *              Cuestionario públicos
     */
    .factory('cloudFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

        return $resource(baseURL + "cuestionarios/cloud", null, {
            'update': {
                method: 'PUT'
            }
        });

    }])


    /**
     * @ngdoc service
     * @name testManagerApp.factory:$localStorage
     * @description Factory que definde una serie de funciones para guardar información de forma local
     */
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

    /**
     * @ngdoc service
     * @name testManagerApp.factory:AuthFactory
     * @description Factory que realiza las operaciones de control de usuarios
     */
    .factory('AuthFactory', ['$resource', '$filter', '$http', '$localStorage', '$rootScope', '$window', 'baseURL', 'ngDialog', function ($resource, $filter, $http, $localStorage, $rootScope, $window, baseURL, ngDialog) {

        var authFac = {};
        var TOKEN_KEY = 'Token';
        var isAuthenticated = false;
        var username = '';
        var authToken = undefined;

        /**
         * @ngdoc method
         * @name loadUserCredentials
         * @methodOf testManagerApp.factory:AuthFactory
         * @description
         * Función que carga el objeto de credenciales para un usuario
         */
        function loadUserCredentials() {
            var credentials = $localStorage.getObject(TOKEN_KEY, '{}');
            if (credentials.username != undefined) {
                useCredentials(credentials);
            }
        }
        /**
         * @ngdoc method
         * @name storeUserCredentials
         * @methodOf testManagerApp.factory:AuthFactory
         * @description Función que guarda las credenciales de un usuario
         * @param {Object} credentials Objeto de credenciales a guardar
         */
        function storeUserCredentials(credentials) {
            $localStorage.storeObject(TOKEN_KEY, credentials);
            useCredentials(credentials);
        }
        /**
         * @ngdoc method
         * @name useCredentials
         * @methodOf testManagerApp.factory:AuthFactory
         * @description Función que 
         * @param {any} credentials Credenciales a usar
         */
        function useCredentials(credentials) {
            isAuthenticated = true;
            username = credentials.username;
            authToken = credentials.token;
            $http.defaults.headers.common['x-access-token'] = authToken;
        }
        /**
         * @ngdoc method
         * @name destroyUserCredentials
         * @methodOf testManagerApp.factory:AuthFactory
         * @description Función que borra las credenciales almacenadas localmente al salir de la aplicación 
         */
        function destroyUserCredentials() {
            authToken = undefined;
            username = '';
            isAuthenticated = false;
            $http.defaults.headers.common['x-access-token'] = authToken;
            $localStorage.remove(TOKEN_KEY);
        }
        /**
         * @ngdoc method
         * @name login
         * @methodOf testManagerApp.factory:AuthFactory
         * @description Función que realiza el login de la aplicación
         * @param {Objet} loginData Objeto con las credenciales del usuario
         * @param {Boolean} register Variable que determina si es la primera vez que accede 
         */
        authFac.login = function (loginData, register) {
            /**
             * Se crea un cuestionario de bienvenida
             */
            var welcomeRe = $filter('translate')('QUESTREGWEL');
            var descr = $filter('translate')('QUESTREGDES');
            var pregUnica = $filter('translate')('QUESTREGUNI');
            var pregMul = $filter('translate')('QUESTREGMUL');
            var cuest = {
                title: welcomeRe,
                image: "",
                text: descr,
                type: "pos",
                cuestCloud: false,
                author: "",
                questions: [{
                        pregunta: pregUnica,
                        image: "",
                        tipo: "unica",
                        r1: "1",
                        r2: "2",
                        r3: "3",
                        r4: "4",
                        rcorrect: "4"
                    },
                    {
                        pregunta: pregMul,
                        image: "",
                        tipo: "multiple",
                        r1: "A",
                        r2: "B",
                        r3: "C",
                        r4: "D",
                        rcorrect: "A"
                    }
                ],
                tests: [],
                stats: []
            };
            $resource(baseURL + "users/login")
                .save(loginData,
                    function (response) {
                        storeUserCredentials({
                            username: loginData.username,
                            token: response.token
                        });
                        $rootScope.$broadcast('login:Successful');
                        if (register)
                            $resource(baseURL + "cuestionarios/:id").save(cuest);
                    },
                    function (response) {
                        isAuthenticated = false;

                        var message = '<div class="ngdialog-message">' +
                            '<div><h3 translate>{{\'NOLOGIN\'}}</h3></div>' +
                            '<div><p>' + response.data.err.message + '</p><p>' +
                            response.data.err.name + '</p></div>' +
                            '<div class="ngdialog-buttons">' +
                            '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>' +
                            '</div>';


                        ngDialog.openConfirm({
                            template: message,
                            plain: 'true'
                        });
                    }

                );

        };
        /**
         * @ngdoc method
         * @name logout
         * @methodOf testManagerApp.factory:AuthFactory
         * @description Función que realiza el logout de la aplicación
         */
        authFac.logout = function () {
            $resource(baseURL + "users/logout").get(function () { /** */ });
            destroyUserCredentials();
        };

        /**
         * @ngdoc method
         * @name register
         * @methodOf testManagerApp.factory:AuthFactory
         * @description Función que realiza el logout de la aplicación
         * @param {Object} registerData Objeto de credenciales obtenidos del registro del usuario
         */
        authFac.register = function (registerData) {

            $resource(baseURL + "users/register")
                .save(registerData,
                    function () {
                        authFac.login({
                            username: registerData.username,
                            password: registerData.password
                        }, true);
                        if (registerData.rememberMe) {
                            $localStorage.storeObject('userinfo', {
                                username: registerData.username,
                                password: registerData.password
                            });
                        }

                        $rootScope.$broadcast('registration:Successful');
                    },
                    function (response) {

                        var message = '<div class="ngdialog-message">' +
                            '<div><h3 translate>{{\'NOREGISTER\'}}</h3></div>' +
                            '<div><p>' + response.data.err.message +
                            '</p><p>' + response.data.err.name + '</p></div>';


                        ngDialog.openConfirm({
                            template: message,
                            plain: 'true'
                        });

                    }

                );
        };
        /**
         * @ngdoc method
         * @name isAuthenticated
         * @methodOf testManagerApp.factory:AuthFactory
         * @description Función que realiza el logout de la aplicación
         * @returns {Boolean} Booleano que indica si el usuarioestá identificado
         */
        authFac.isAuthenticated = function () {
            return isAuthenticated;
        };
        /**
         * @ngdoc method
         * @name getUsername
         * @methodOf testManagerApp.factory:AuthFactory
         * @description Función que devuelve el nombre de usuario
         * @returns {String} nombre del usuario
         */
        authFac.getUsername = function () {
            return username;
        };

        loadUserCredentials();

        return authFac;

    }]);