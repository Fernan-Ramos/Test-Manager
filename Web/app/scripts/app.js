'use strict';
angular.module('testManagerApp', ['ngMaterial', 'ui.router', 'chart.js', 'ngResource', 'ngDialog', 'pascalprecht.translate'])
    .config(function ($stateProvider, $urlRouterProvider, $translateProvider) {
        $stateProvider

            //ruta para menu
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
                    },
                    'footer': {
                        templateUrl: 'views/footer.html',
                    }
                }

            })


            //ruta para login
            .state('login', {
                url: '/login',
                views: {
                    'content@': {
                        templateUrl: 'views/home.html',
                        controller: 'LoginController'
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

            //ruta para favorites
            .state('app.favorites', {
                url: 'favorites',
                views: {
                    'content@': {
                        templateUrl: 'views/favorites.html',
                        controller: 'FavoritesController'
                    }
                }
            });


        $urlRouterProvider.otherwise('/login');
        $translateProvider
            .useStaticFilesLoader({
                prefix: 'locale-',
                suffix: '.json'
            })
        $translateProvider.preferredLanguage('es');
        $translateProvider.fallbackLanguage('es');
        $translateProvider.useSanitizeValueStrategy('escapeParameters');
        $translateProvider.forceAsyncReload(true);


    });