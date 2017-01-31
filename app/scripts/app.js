'use strict';
angular.module('testManagerApp', ['ngMaterial'])
    .controller('MenuController', function ($scope) {

        $scope.cuest = [

            {
                title: 'Cuanto sabes de paises?',
                image: 'img/libro.jpg',
                text: 'blabalbla'
            },
            {
                title: 'Cuanto sabes sobre Java?',
                image: 'img/libro.jpg',
                text: 'blabalba'
            },
            {
                title: 'Cuanto sabes de Python? ',
                image: 'img/libro.jpg',
                text: 'blalalal'
            }


        ];

    })

    .controller('TestController', function ($scope) {

        $scope.showTest=false;
        $scope.test = [
            {
                title: 'Java Test',
                pregunta: 'blaa',
                image: 'img/mundo.jpg',
                r1: 'asi',
                r2: 'asao',
                r3: 'ja',
                r4: 'je'
            },
            {
                title: 'Java Test',
                pregunta: 'blaa',
                image: 'img/programar.jpg',
                r1: 'asi',
                r2: 'asao',
                r3: 'ja',
                r4: 'je'
            },
            {
                title: 'Java Test',
                pregunta: 'blaa',
                image: 'img/libro.jpg',
                r1: 'asi',
                r2: 'asao',
                r3: 'ja',
                r4: 'je'

            }

        ];

        $scope.nextTest = function(){
            $scope.showTest=!$scope.showTest;
        }

    })

    .controller('SelectedQuestController', function ($scope, $timeout) {
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

                $scope.respuestas = $scope.respuestas || [
                    { id: 1, name: 'Respuesta 1' },
                    { id: 2, name: 'Respuesta 2' },
                    { id: 3, name: 'Respuesta 3' },
                    { id: 4, name: 'Respuesta 4' },
                ];

            }, 650);
        };

    });



