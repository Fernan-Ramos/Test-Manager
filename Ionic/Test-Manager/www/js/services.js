'use strict';
angular.module('testManager.services', ['ngResource', 'ngMaterial', 'chart.js'])
    .constant("baseURL", "http://localhost:3000/")
    .factory('menuFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

        var menufac = {};

        menufac.getCuestionarios = function () {
            return $resource(baseURL + "cuestionarios/:id", null, { 'update': { method: 'PUT' } });
        };

        return menufac;
    }])

    .factory('favoriteFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
        var favFac = {};

        favFac.getFavoritos = function () {
            return $resource(baseURL + "favoritos/:id", null, { 'update': { method: 'PUT' } });
        }

        return favFac;
    }]);
