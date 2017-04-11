'use strict';
angular.module('testManagerApp', ['ngMaterial', 'ui.router', 'chart.js', 'ngResource', 'ngDialog'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            //ruta para la pagina menu
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

            //ruta para la pagina testDetails
            .state('app.testDetails', {
                url: 'menu/:id',
                views: {
                    'content@': {
                        templateUrl: 'views/testDetails.html',
                        controller: 'TestController'
                    }
                }
            })

            //ruta para la pagina maker
            .state('app.maker', {
                url: 'maker',
                views: {
                    'content@': {
                        templateUrl: 'views/maker.html',
                        controller: 'MakerController'
                    }
                }
            })

            //ruta para la pagina statDetails
            .state('app.statDetails', {
                url: 'stats/:id',
                views: {
                    'content@': {
                        templateUrl: 'views/statDetails.html',
                        controller: 'StatsControllerDetails'
                    }
                }
            })


            //ruta para la pagina stats
            .state('app.stats', {
                url: 'stats',
                views: {
                    'content@': {
                        templateUrl: 'views/stats.html',
                        controller: 'StatsController'
                    }
                }
            });


        $urlRouterProvider.otherwise('/');

    });