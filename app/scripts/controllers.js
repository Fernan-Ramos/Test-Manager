'use strict';
angular.module('testManagerApp')

    .controller('MenuController', ['$scope', 'menuFactory', function ($scope, menuFactory) {

        $scope.cuestionarios = menuFactory.getCuestionarios();

    }])

    .controller('TestController', ['$scope', '$routeParams', 'menuFactory', function ($scope, $routeParams, menuFactory) {


        $scope.cuestionario = menuFactory.getCuestionario(parseInt($routeParams.id, 10));

    }])

    //Directiva para poder cargar una imagen
    .directive("fileread", [function () {
        return {
            scope: {
                fileread: "="
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    var reader = new FileReader();
                    reader.onload = function (loadEvent) {
                        scope.$apply(function () {
                            scope.fileread = loadEvent.target.result;
                        });
                    }
                    reader.readAsDataURL(changeEvent.target.files[0]);
                });
            }
        }
    }])

    .controller('MakerController', ['$scope', '$timeout', 'menuFactory', function ($scope, $timeout, menuFactory) {
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

        $scope.cuest = {
            title: "",
            image: "img/libro.jpg",
            text: "",
            _id: 3,
            questions: [{
                title: 'Python Test',
                pregunta: "",
                image: "img/libro.jpg",
                r1: "",
                r2: "",
                r3: "",
                r4: "",
                rcorrect: ""
            }]
        };

        $scope.submitComment = function () {

            console.log($scope.cuest);
            // Step 3: Push your comment into the dish's comment array
            $scope.cuestionarios.push($scope.cuest);

            //Step 4: reset your form to pristine
            $scope.makerForm.$setPristine();

            //Step 5: reset your JavaScript object that holds your comment
            $scope.cuest = {
                title: "",
                image: "img/libro.jpg",
                text: "",
                _id: 3,
                questions: [{
                    title: 'Python Test',
                    pregunta: "",
                    image: "img/libro.jpg",
                    r1: "",
                    r2: "",
                    r3: "",
                    r4: "",
                    rcorrect: ""
                }]
            };

        };

    }]);