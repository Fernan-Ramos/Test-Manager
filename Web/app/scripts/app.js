/**
 * @author Fernán Ramos Saiz
 * @version 1.0
 * @description Fichero que almacena la configuración de la aplicación
 */
'use strict';
angular.module('testManagerApp', ['ngMaterial', 'ui.router', 'chart.js', 'ngResource', 'ngDialog', 'pascalprecht.translate'])
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



            //ruta para nube
            .state('app.cloud', {
                url: 'cloud',
                views: {
                    'content@': {
                        templateUrl: 'views/cloud.html',
                        controller: 'CloudController'
                    }
                }
            })

            //ruta para testDetails
            .state('app.testDetails', {
                url: 'menu/:id',
                views: {
                    'content@': {
                        templateUrl: 'views/testDetails.html',
                        controller: 'TestController'
                    }
                }
            })

            //ruta para maker
            .state('app.maker', {
                url: 'maker',
                views: {
                    'content@': {
                        templateUrl: 'views/maker.html',
                        controller: 'MakerController'
                    }
                }
            })

            //ruta para statDetails
            .state('app.statDetails', {
                url: 'stats/:id',
                views: {
                    'content@': {
                        templateUrl: 'views/statDetails.html',
                        controller: 'StatsControllerDetails'
                    }
                }
            })


            //ruta para stats
            .state('app.stats', {
                url: 'stats',
                views: {
                    'content@': {
                        templateUrl: 'views/stats.html',
                        controller: 'StatsController'
                    }
                }
            })

        //Si no se puede acceder a ninguna ruta por defecto se accede a la ruta /login
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