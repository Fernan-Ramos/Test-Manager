'use strict';
angular.module('testManagerApp', ['ngMaterial', 'ui.router', 'chart.js', 'ngResource'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            //ruta para la pagina menu
            .state('app', {
                url: '/',
                views: {
                    'header': {
                        templateUrl: 'views/header.html',
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

            //ruta para la pagina cuestionario
            .state('app.cuestionario', {
                url: 'menu/:id',
                views: {
                    'content@': {
                        templateUrl: 'views/cuestionario.html',
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

             //ruta para la pagina estadisticas individuales
            .state('app.estadisticasInd', {
                url: 'stats/:id',
                views: {
                    'content@': {
                        templateUrl: 'views/estadisticasInd.html',
                        controller: 'StatsControllerDetails'
                    }
                }
            })


            //ruta para la pagina estadisticas
            .state('app.estadisticas', {
                url: 'estadisticas',
                views: {
                    'content@': {
                        templateUrl: 'views/estadisticas.html',
                        controller: 'StatsController'
                    }
                }
            });


        $urlRouterProvider.otherwise('/');

    });