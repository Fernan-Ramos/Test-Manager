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
 * @description Fichero que almacena la configuración de la aplicación
 */
'use strict';
angular.module('testManagerApp', ['ngMaterial', 'ui.router', 'chart.js', 'ngResource', 'ngDialog', 'pascalprecht.translate'])

    .run(function ($window, $translate) {
        //Se detecta el lenguaje del navegador
        var language = $window.navigator.language || $window.navigator.userLanguage;
        language = language.split("-")[0];

        //Se traduce al lenguaje predefinido en el navegador
        if (language == 'es' || language == 'en')
            $translate.use(language);
    })


    .config(function ($stateProvider, $urlRouterProvider, $translateProvider) {
        $stateProvider

            /**
             * Estado principal de la aplicacion
             */
            .state('app', {
                url: '/',
                views: {
                    'header': {
                        templateUrl: 'views/header.html',
                        controller: 'HeaderController'
                    },
                    'content': {
                        templateUrl: 'views/menu.html',
                        controller: 'MenuController'
                    }
                }

            })


            /**
             * Estado login, 
             */
            .state('login', {
                url: '/login',
                views: {
                    'content@': {
                        templateUrl: 'views/home.html',
                        controller: 'LoginController'
                    }
                }
            })



            /**
             * Estado cloud, 
             */
            .state('app.cloud', {
                url: 'cloud',
                views: {
                    'content@': {
                        templateUrl: 'views/cloud.html',
                        controller: 'CloudController'
                    }
                }
            })

            /**
             * Estado testDetails, 
             */
            .state('app.testDetails', {
                url: 'menu/:id',
                views: {
                    'content@': {
                        templateUrl: 'views/testDetails.html',
                        controller: 'TestController'
                    }
                }
            })

            /**
             * Estado maker, 
             */
            .state('app.maker', {
                url: 'maker',
                views: {
                    'content@': {
                        templateUrl: 'views/maker.html',
                        controller: 'MakerController'
                    }
                }
            })

            /**
             * Estado statDetails, 
             */
            .state('app.statDetails', {
                url: 'stats/:id',
                views: {
                    'content@': {
                        templateUrl: 'views/statDetails.html',
                        controller: 'StatsControllerDetails'
                    }
                }
            })


            /**
             * Estado stats, 
             */
            .state('app.stats', {
                url: 'stats',
                views: {
                    'content@': {
                        templateUrl: 'views/stats.html',
                        controller: 'StatsController'
                    }
                }
            })

        //Si no se puede acceder a ninguna ruta, por defecto se accede a la ruta /login
        $urlRouterProvider.otherwise('/login');

        /**
         * Se obtienen las traducciones de los ficheros locales .json
         */
        $translateProvider
            .useStaticFilesLoader({
                prefix: 'traductions/locale-',
                suffix: '.json'
            })
        /**
         * Se establece español como idioma predifinido
         */
        $translateProvider.preferredLanguage('es');
        $translateProvider.fallbackLanguage('es');
        $translateProvider.useSanitizeValueStrategy('escapeParameters');
        $translateProvider.forceAsyncReload(true);

    });