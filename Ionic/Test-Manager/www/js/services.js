'use strict';
angular.module('testManager.services', ['ngResource', 'ngMaterial', 'chart.js'])
    .constant("baseURL", "http://localhost:3000/")
    
    .factory('menuFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

        return $resource(baseURL + "cuestionarios/:id", null, { 'update': { method: 'PUT' } });

    }])

    .factory('favoriteFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

        return $resource(baseURL + "favoritos/:id", null, { 'update': { method: 'PUT' } });

    }]);
