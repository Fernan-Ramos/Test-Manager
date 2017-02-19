'use strict';
angular.module('testManagerApp', ['ngMaterial', 'ngRoute','chart.js'])
    .config(function ($routeProvider) {
        $routeProvider
            // route for the maker page
            .when('/maker', {
                templateUrl: 'maker.html',
                controller: 'MakerController'
            })
            // route for the menu page
            .when('/menu', {
                templateUrl: 'menu.html',
                controller: 'MenuController'
            })
            // route for the cuestionario page
            .when('/menu/:id', {
                templateUrl: 'cuestionario.html',
                controller: 'TestController'
            })
            .otherwise('/maker');

    });