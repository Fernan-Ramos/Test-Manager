'use strict';
angular.module('testManagerApp')

    .controller('MenuController', ['$scope', 'menuFactory', function ($scope, menuFactory) {

        $scope.cuestionarios = menuFactory.getCuestionarios();

    }])

    .controller('TestController', ['$scope', '$routeParams', '$mdDialog', 'menuFactory', 'testFactory', function ($scope, $routeParams, $mdDialog, menuFactory, testFactory) {


        $scope.cuestionario = menuFactory.getCuestionario(parseInt($routeParams.id, 10));
        $scope.tests = testFactory.getAnswers();
        console.log($scope.cuestionario);
        $scope.answer = {};
        //Copio el array de cuestionarios en un nuevo array que contendrá las respuestas seleccionadas por el usuario
        angular.copy($scope.cuestionario, $scope.answer);

        //console.log($scope.cuestionario);
        console.log($scope.cuestionario);
        //console.log($scope.answer);
        //Guardo la respuesta correcta por pregunta(indice) y compruebo que la respuesta sea correcta o no
        $scope.submitAnswer = function (ev) {

            $scope.tests.push($scope.answer);
            console.log("ANSWER", $scope.answer);
            console.log("CONJUNTO DE RESPUESTAS OTALES", $scope.tests);
            //Resetea el formulario a  pristine
            $scope.testForm.$setPristine();
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'tabDialog.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false
            })
                .then(function (answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function () {
                    $scope.status = 'You cancelled the dialog.';
                });
            function DialogController($scope, $mdDialog) {
                $scope.correctas = 0;
                $scope.tests = testFactory.getAnswers();
                //Obtener el numero total de preguntas correctas
                for(var i=0;i<$scope.tests[$scope.tests.length-1].questions.length;i++){
                    if($scope.tests[$scope.tests.length-1].questions[i].r ==  $scope.tests[$scope.tests.length-1].questions[i].rcorrect){
                        $scope.correctas++;
                    }
                }
                
                $scope.hide = function () {
                    $mdDialog.hide();
                };

                $scope.cancel = function () {
                    $mdDialog.cancel();
                };

                $scope.answer = function (answer) {
                    $mdDialog.hide(answer);
                };
            }

            $scope.answer = {};

        };

    


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
                title: "",
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
            //Si no hay cuestionarios creados el cuestionario creado se establece con identificador 0
            if ($scope.cuestionarios.length == 0) {
                $scope.cuest['_id'] = 0;
            }
            //Si hay cuestionarios creados se obtiene el identificador del cuestionario más antiguo y se le suma una unidad 
            else {
                $scope.cuest['_id'] = parseInt($scope.cuestionarios[$scope.cuestionarios.length - 1]._id, 10) + 1;
            }

            for (var i = 0; i < $scope.cuest.questions.length; i++) {
                //Se establece un identificador por cada pregunta
                $scope.cuest.questions[i]['_id'] = i;
                //Se establece cada pregunta como no contestada
                $scope.cuest.questions[i]['contestada'] = false;
                //Cada pregunta tiene como titulo el mismo titulo del cuestionario
                $scope.cuest.questions[i].title = $scope.cuest.title;
            }

            //Poner el cuestionaro creado en array de cuestionarios
            $scope.cuestionarios.push($scope.cuest);

            //Resetea el formulario a  pristine
            $scope.makerForm.$setPristine();

            //Resetea el objeto JavaScript una vez que el cuestionario ha sido creado
            $scope.cuest = {
                title: "",
                image: "img/libro.jpg",
                text: "",
                _id: "",
                questions: [{
                    title: "",
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