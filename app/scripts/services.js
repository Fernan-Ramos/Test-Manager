'use strict';
angular.module('testManagerApp')
    .constant("baseURL", "http://localhost:3000/")
    .service('menuFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

        var menufac = {};

        menufac.getCuestionarios = function () {
            return $resource(baseURL + "cuestionarios/:id", null, { 'update': { method: 'PUT' } });
        };

        return menufac;
    }])

    .factory('testFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

        var testfac = {};

        testfac.getAnswers = function () {
            return $resource(baseURL + "tests", null, { 'update': { method: 'PUT' } });
        };

        testfac.getStats = function () {
            return $resource(baseURL + "stats/:id", null, { 'update': { method: 'PUT' } });
        };

        return testfac;

    }]);
