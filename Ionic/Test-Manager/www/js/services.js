'use strict';
angular.module('testManager.services', ['ngResource', 'ngMaterial'])
    .constant("baseURL", "http://localhost:3000/")
    .factory('menuFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

        var menufac = {};

        menufac.getCuestionarios = function () {
            return $resource(baseURL + "cuestionarios/:id", null, { 'update': { method: 'PUT' } });
        };

        return menufac;
    }]);
