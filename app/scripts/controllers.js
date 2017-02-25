'use strict';
angular.module('testManagerApp')

    .controller('MenuController', ['$scope', '$mdDialog', 'menuFactory', function ($scope, $mdDialog, menuFactory) {

        $scope.cuestionarios = menuFactory.getCuestionarios();


        //Función que exporta un cuestionario a fichero en formato json
        $scope.exportCuest = function (cuest, filename) {

            filename = filename + '.json';

            if (typeof cuest === 'object') {
                cuest = JSON.stringify(cuest, undefined, 2);
            }
            var blob = new Blob([cuest], { type: 'text/json' });

            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blob, filename);
            }
            else {
                var e = document.createEvent('MouseEvents'),
                    a = document.createElement('a');

                a.download = filename;
                a.href = window.URL.createObjectURL(blob);
                a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
                e.initEvent('click', true, false, window,
                    0, 0, 0, 0, 0, false, false, false, false, 0, null);
                a.dispatchEvent(e);
            }
        };

        //Función que permite borrar un cuestionario
        $scope.removeCuest = function (cuest) {
            $mdDialog.show({
                clickOutsideToClose: true,
                scope: $scope,
                preserveScope: true,
                template: '<md-dialog aria-label="List dialog">' +
                '  <md-dialog-content>' +
                '<md-content class="md-padding">' +
                ' <h5 class="md-title">Estas seguro de eliminar este cuestionario</h5>' +
                '</md-content>      ' +
                '  </md-dialog-content>' +
                '  <md-dialog-actions>' +
                '    <md-button ng-href="#!/menu" ng-click="remove()" class="md-primary">' +
                '      Eliminar' +
                '    </md-button>' +
                '    <md-button  ng-click="closeDialog()" class="md-primary">' +
                '      Cancelar' +
                '    </md-button>' +
                '  </md-dialog-actions>' +
                '</md-dialog>',

                controller: function DialogController($scope, $mdDialog) {
                    $scope.remove = function () {
                        $mdDialog.hide();
                        var index = $scope.cuestionarios.indexOf(cuest);
                        if (index > -1) {
                            $scope.cuestionarios.splice(index, 1);
                        }
                        //Actualizar los id de los cuestionarios
                        for (var i = index; i < $scope.cuestionarios.length; i++) {
                            $scope.cuestionarios[i]._id -= 1;
                        }
                    }
                    $scope.closeDialog = function () {
                        $mdDialog.hide();
                    }
                }
            });

        };

    }])

    .controller('TestController', ['$scope', '$filter', '$routeParams', '$mdDialog', 'menuFactory', 'testFactory', function ($scope, $filter, $routeParams, $mdDialog, menuFactory, testFactory) {
        //Se obtiene el cuestionario 
        $scope.cuestionario = menuFactory.getCuestionario(parseInt($routeParams.id, 10));
        //Se obtiene las respuestas guardadas
        $scope.tests = testFactory.getAnswers();
        console.log($scope.cuestionario);
        //Se crea un objeto que contendra la respuestas
        $scope.answer = {};
        //Copio el array de cuestionarios en un nuevo array que contendrá las respuestas seleccionadas por el usuario
        angular.copy($scope.cuestionario, $scope.answer);

        console.log($scope.cuestionario);

        //Guardo la respuesta correcta por pregunta(indice) y compruebo que la respuesta sea correcta o no
        $scope.submitAnswer = function (ev) {
            //Se guarda la fecha en la que se realiza el cuestionario
            $scope.answer.date = $filter('date')(new Date(), 'medium');
            //Se guarda la respuesta en el array de respuestas
            $scope.tests.push($scope.answer);
            //Resetea el formulario a  pristine
            $scope.testForm.$setPristine();
            //Muestra el dialogo con los resultados
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'dialogCuestionario.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false
            })

            function DialogController($scope, $mdDialog) {
                $scope.correctas = 0;
                $scope.incorrectas = 0;
                $scope.tests = testFactory.getAnswers();
                //Se obtiene el numero total de preguntas correctas e incorrectas
                for (var i = 0; i < $scope.tests[$scope.tests.length - 1].questions.length; i++) {
                    if ($scope.tests[$scope.tests.length - 1].questions[i].r == $scope.tests[$scope.tests.length - 1].questions[i].rcorrect) {
                        $scope.correctas++;
                    } else {
                        $scope.incorrectas++;
                    }
                }
                //Se guarda las respuestas correctas 
                $scope.tests[$scope.tests.length - 1].correctas = $scope.correctas;
                //Se guarda las respuestas incorrectas 
                $scope.tests[$scope.tests.length - 1].incorrectas = $scope.incorrectas;
                //Se guarda la calificación obtenida
                $scope.tests[$scope.tests.length - 1].cal = ($scope.tests[$scope.tests.length - 1].correctas / $scope.tests[$scope.tests.length - 1].questions.length) * 100;
                //Atributos para el char
                $scope.labels = ["Correctas", "Incorrectas"];
                $scope.data = [$scope.correctas, $scope.incorrectas];
                $scope.colors = ['#D1E5B3', '#F08080'];
                //Función que cierra el dialogo
                $scope.answer = function (answer) {
                    $mdDialog.hide(answer);
                };
                $scope.labels1 = testFactory.getLabels();
                $scope.series1 = testFactory.getSeries();
                $scope.data1 = testFactory.getData();
                var array = [null];
                //Si el conjunto de respuestas tiene alguna respuesta a algún cuestionario , se obtiene el titulo  del cuestionario , el nº de respuestas correctas y la fecha en la que se hizo.
                if ($scope.tests.length != 0) {
                    $scope.title = $scope.tests[$scope.tests.length - 1].title;
                    $scope.respuestas = $scope.tests[$scope.tests.length - 1].cal;
                    $scope.fecha = $scope.tests[$scope.tests.length - 1].date;

                    //Si el cuestionario ya está reflejado en las estadisticas se añade el nuevo valor de respuestas al array de respuestas de dicho cuestionario
                    if ($scope.series1.includes($scope.title)) {
                        //obtener el indice del del titulo para poder poner el nuevo valor
                        var index = $scope.series1.indexOf($scope.title);
                        $scope.labels1.push($scope.fecha);
                        //obtener el indice de la fecha para poner el resultado en el indice de la fecha correspondiente
                        var indexFecha = $scope.labels1.indexOf($scope.fecha);
                        //Rellenar el array de respuestas con valores nulos como fechas anteriores haya
                        for (var i = 0; i < $scope.labels1.length; i++) {
                            $scope.data1[index].push(null);
                        }
                        $scope.data1[index].push(null);
                        $scope.data1[index].splice(indexFecha, 1, $scope.respuestas);
                        $scope.data1[index].push(null);

                    }
                    //Si no está reflejado en las estadisticas
                    else {
                        $scope.labels1.push($scope.fecha);
                        $scope.series1.push($scope.title);
                        var index = $scope.labels1.indexOf($scope.fecha);
                        //Rellenar el array de respuestas con valores nulos como fechas anteriores haya
                        for (var i = 0; i < $scope.labels1.length; i++) {
                            array.push(null);
                        }
                        array.splice(index, 1, $scope.respuestas);
                        $scope.data1.push(array);
                        array.push(null);

                    }
                }

            }

            //Se resetea el objeto respuesta
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
        $scope.quests =[];
        for(var i=1;i<=100;i++){
            $scope.quests.push(i);
        }
         
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

    }])

    .controller('StatsController', ['$scope', '$mdDialog', 'testFactory', function ($scope, $mdDialog, testFactory) {
        $scope.tests = testFactory.getAnswers();
        $scope.labels = testFactory.getLabels();
        $scope.series = testFactory.getSeries();
        $scope.data = testFactory.getData();
        console.log($scope.labels);
        console.log($scope.series);
        console.log($scope.data);
        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };
        $scope.datasetOverride1 = [{
            yAxisID: 'y-axis-1'
        }, {
            yAxisID: 'y-axis-2'
        }];
        $scope.options1 = {
            scales: {
                yAxes: [{
                    ticks: {
                        max: 100,
                        min: 0,
                        stepSize: 10
                    },
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                },
                {
                    ticks: {
                        max: 100,
                        min: 0,
                        stepSize: 10
                    },
                    id: 'y-axis-2',
                    type: 'linear',
                    display: true,
                    position: 'right'
                }
                ]
            },
            legend: { display: true }
        };

        $scope.datasetOverride2 = [{
            yAxisID: 'y-axis-1'
        }
        ];
        $scope.options2 = {
            scales: {
                yAxes: [{
                    ticks: {
                        max: 100,
                        min: 0,
                        stepSize: 10
                    },
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                }]
            }, legend: { display: true }
        };

        //Dialogo que aparece cuando no hay cuestionarios completados
        if ($scope.tests.length == 0) {
            $mdDialog.show({
                clickOutsideToClose: false,

                scope: $scope,        // use parent scope in template
                preserveScope: true,  // do not forget this if use parent scope

                // Since GreetingController is instantiated with ControllerAs syntax
                // AND we are passing the parent '$scope' to the dialog, we MUST
                // use 'vm.<xxx>' in the template markup

                template: '<md-dialog aria-label="List dialog">' +
                '  <md-dialog-content>' +
                '<md-content class="md-padding">' +
                ' <h5 class="md-title">No hay estadisticas que mostrar</h5>' +
                ' <p class="md-textContent">Todavía no has realizado ningún cuestionario</p>' +
                '</md-content>      ' +
                '  </md-dialog-content>' +
                '  <md-dialog-actions>' +
                '    <md-button ng-href="#!/menu" ng-click="closeDialog()" class="md-primary">' +
                '      Menu' +
                '    </md-button>' +
                '  </md-dialog-actions>' +
                '</md-dialog>',

                controller: function DialogController($scope, $mdDialog) {
                    $scope.closeDialog = function () {
                        $mdDialog.hide();
                    }
                }
            });
        }
        //Función que ordena los cuestionarios por titulo , por calificación o por fecha .
        $scope.filter = function (value) {
            switch (value) {
                case 1:
                    $scope.filtText = "title";
                    break;
                case 2:
                    $scope.filtText = "-cal";
                    break;
                case 3:
                    $scope.filtText = "date";
                    break;
            }
        };


    }]);