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

    .controller('MakerController', ['$scope', 'menuFactory', function ($scope, menuFactory) {
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

        //obtiene el indice del ultimo cuestionario creado
        $scope.getId = function () {

            //Si no hay ningún cuestionario creado , el _id es 0
            if ($scope.cuestionarios.length == 0) {
                return 0;
            }
            else {
                return parseInt($scope.cuestionarios[$scope.cuestionarios.length - 1]._id, 10) + 1;
            }

            console.log($scope.cuestionarios[$scope.cuestionarios.length - 1]._id);
        };

        $scope.cuest = {
            title: "",
            image: "img/libro.jpg",
            text: "",
            _id: "",
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

        $scope.submitTest = function () {

            console.log($scope.cuest);
            // Step 3: Poner el cuestionaro creado en array de cuestionarios
            $scope.cuestionarios.push($scope.cuest);

            //Step 4: resetear el formulario a  pristine
            $scope.makerForm.$setPristine();


            //Step 5: reseat el objeto JavaScript una vez que el cuestionario ha sido creado
            $scope.cuest = {
                title: "",
                image: "img/libro.jpg",
                text: "",
                _id: "",
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