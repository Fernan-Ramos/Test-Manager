'use strict';
angular.module('testManagerApp')

    .controller('MenuController', ['$scope', 'menuFactory', function ($scope, menuFactory) {

        $scope.cuestionarios = menuFactory.getCuestionarios();

    }])

    .controller('TestController', ['$scope','$routeParams', 'menuFactory', function ($scope,$routeParams ,menuFactory) {


        $scope.cuestionario = menuFactory.getCuestionario(parseInt($routeParams.id,10));

    }])

    .controller('MakerController', ['$scope', '$timeout', function ($scope, $timeout) {
        $scope.quests = [1, 2, 3, 4, 5, 6, 7];
        $scope.selectedQuest;
        $scope.getSelectedQuest = function () {
            if ($scope.selectedQuest !== undefined) {
                $scope.number = $scope.selectedQuest;
                return "Nº de preguntas: " + $scope.selectedQuest;

            } else {
                return "Por favor selecciona un número";
            }
        };

        $scope.getNumber = function (num) {
            return new Array(num);
        };


        $scope.respuesta = null;
        $scope.respuestas = null;

        $scope.loadRespuestas = function () {

            // Use timeout to simulate a 650ms request.
            return $timeout(function () {

                $scope.respuestas = $scope.respuestas || [{
                        id: 1,
                        name: 'Respuesta 1'
                    },
                    {
                        id: 2,
                        name: 'Respuesta 2'
                    },
                    {
                        id: 3,
                        name: 'Respuesta 3'
                    },
                    {
                        id: 4,
                        name: 'Respuesta 4'
                    },
                ];

            }, 650);
        };

    }]);