'use strict';
angular.module('testManagerApp')
    .constant("baseURL", "http://localhost:3000/")
    .service('menuFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

        var menufac = {};

        menufac.getCuestionarios = function () {
            return $resource(baseURL + "cuestionarios/:id", null, { 'update': { method: 'PUT' } });
        };

        return menufac;
    }]);
