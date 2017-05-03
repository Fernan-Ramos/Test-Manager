'use strict';
angular.module('testManagerApp', ['ngMaterial', 'ui.router', 'chart.js', 'ngResource', 'ngDialog'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            //ruta para login
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


            //ruta para menu
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

    });