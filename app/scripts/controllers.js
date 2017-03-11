'use strict';
angular.module('testManagerApp')

    .controller('MenuController', ['$scope', '$mdDialog', 'menuFactory', function ($scope, $mdDialog, menuFactory) {

        $scope.showMenu = false;
        $scope.message = "Loading ...";
        $scope.cuestionarios = menuFactory.getCuestionarios().query(
            function (response) {
                $scope.cuestionarios = response;
                $scope.showMenu = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            });


        //Función que exporta un cuestionario a fichero en formato json
        $scope.exportCuest = function (cuest, filename) {

            filename = filename + '.json';
            cuest.id = "";
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
                '    <md-button ui-sref="app" ng-click="remove()" class="md-primary">' +
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
                        menuFactory.getCuestionarios().remove(cuest);
                    }

                    $scope.closeDialog = function () {
                        $mdDialog.hide();
                    }
                }
            });

        };

    }])

    .controller('TestController', ['$scope', '$filter', '$stateParams', '$mdDialog', 'menuFactory', 'testFactory', function ($scope, $filter, $stateParams, $mdDialog, menuFactory, testFactory) {
        //Se obtiene el cuestionario 

        $scope.cuestionario =
            menuFactory.getCuestionarios().get({ id: parseInt($stateParams.id, 10) })
                .$promise.then(
                function (response) {
                    $scope.showDish = true;
                    $scope.cuestionario = response;
                    //Se crea un objeto que contendra la respuestas
                    $scope.answer = {};
                    //Se añade un atributo con las preguntas al objeto de respuestas
                    $scope.answer.questions = $scope.cuestionario.questions;
                    $scope.selected = [];
                    //Por cada pregunta del cuestionaro se guarda un array de respuestas
                    for (var i = 0; i < $scope.cuestionario.questions.length; i++) {
                        $scope.selected.push([]);
                    }
                    //Función que añade o elimina una respuesta al array de respuestas
                    $scope.toggle = function (item, list) {
                        var idx = list.indexOf(item);
                        if (idx > -1) {
                            list.splice(idx, 1);
                        }
                        else {
                            list.push(item);
                        }
                    };
                    //Función que comprueba si el elemento existe en el array de respuestas
                    $scope.exists = function (item, list) {
                        return list.indexOf(item) > -1;
                    };
                },
                function (response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
                );

        //Se obtiene las respuestas guardadas


        $scope.submitAnswer = function (ev) {
            //Se guarda la fecha en la que se realiza el cuestionario
            $scope.answer.date = $filter('date')(new Date(), 'medium');
            //Se guarda el array de respuestas contestadas en cada pregunta.
            for (var i = 0; i < $scope.selected.length; i++) {
                $scope.answer.questions[i].r = $scope.selected[i];
            }
            $scope.correctas = 0;
            $scope.incorrectas = 0;
            var incluida = 0;
            //Se recorre el array de preguntas 
            for (var i = 0; i < $scope.answer.questions.length; i++) {
                //Se recorre el array de respuestas dadas y se comprueba que cada elemento de dicho array esté en el array de respuestas correctas
                for (var j = 0; j < $scope.answer.questions[i].r.length; j++) {
                    if ($scope.answer.questions[i].rcorrect.includes($scope.answer.questions[i].r[j])) {
                        incluida++;
                    }
                }
                //Si la longuitud del array de respuestas correctas corresponde con el numero de respuestas incluidas y es igual la longuitud del array de respuestas dada, la respuesta es correcta
                if (incluida == $scope.answer.questions[i].rcorrect.length && $scope.answer.questions[i].r.length == $scope.answer.questions[i].rcorrect.length) {
                    $scope.correctas++;
                    //Determina que la respuesta es correcta
                    $scope.answer.questions[i].estado = 1;

                } else {
                    $scope.incorrectas++;
                    //Determina que la respuesta es incorrecta
                    $scope.answer.questions[i].estado = 0;
                }
                incluida = 0;
            }

            //Se guarda las respuestas correctas 
            $scope.answer.correctas = $scope.correctas;
            //Se guarda las respuestas incorrectas 
            $scope.answer.incorrectas = $scope.incorrectas;
            //Se guarda la calificación obtenida
            $scope.answer.cal = ($scope.answer.correctas / $scope.answer.questions.length) * 100;

            $scope.cuestionario.tests.push($scope.answer);
            //Se guarda la respuesta al cuestionario en el array de respuestas a cuestionarios
            menuFactory.getCuestionarios().update({ id: $scope.cuestionario.id }, $scope.cuestionario);

            $mdDialog.show({
                clickOutsideToClose: false,
                scope: $scope,
                preserveScope: true,
                template:
                '<div ng-cloak>' +
                '<md-dialog aria-label="Respuestas">' +
                '<md-toolbar>' +
                '<div class="md-toolbar-tools" >' +
                '<h2>{{cuestionario.title}}</h2>' +
                '<span flex></span>' +
                '</div>' +
                ' </md-toolbar>' +
                '  <md-dialog-content>' +
                '<md-tabs md-dynamic-height md-border-bottom>' +
                '<md-tab label="resultados">' +
                '<md-content class="md-padding">' +
                '<h5 class="md-display-1"><em>Respuestas correctas : {{(cuestionario.tests[cuestionario.tests.length-1].correctas/cuestionario.tests[cuestionario.tests.length-1].questions.length)*100 | number:2}}%</em></h5>' +
                '</md-content>' +
                '<md-content class="md-padding">' +
                '<canvas id="doughnut" class="chart chart-doughnut" chart-data="data" chart-labels="labels" chart-colors="colors">' +
                '</md-content>' +
                '</md-tab>' +
                '<md-tab label="sumario">' +
                ' <md-content class="md-padding" ng-repeat="preg in cuestionario.tests[cuestionario.tests.length-1].questions  track by $index">' +
                '<div ng-if="preg.estado==1" class="bs-callout bs-callout-success">' +
                '<h4><em>Pregunta {{$index+1}} : {{preg.pregunta}}</em></h4>' +
                '<p>Muy bien, <strong class="text-success">{{preg.rcorrect}}</strong> es la respuesta correcta</p>' +
                '</div>' +
                '<div ng-if="preg.estado==0" class="bs-callout bs-callout-danger">' +
                '<h4><em>Pregunta {{$index+1}} : {{preg.pregunta}}</em></h4>' +
                '<p>Vaya! <strong class="text-danger">{{preg.r}} </strong> no es la respuesta correcta.' +
                ' </div>' +
                '</md-content>' +
                '</md-tab>' +
                '</md-tabs>' +
                '  </md-dialog-content>' +
                '  <md-dialog-actions>' +
                '    <md-button ui-sref="app" ng-click="closeDialog()" class="md-primary">' +
                '      Menu' +
                '    </md-button>' +
                '    <md-button ui-sref="app.estadisticasInd({id: cuestionario.id})" ng-click="closeDialog()" class="md-primary">' +
                '      Estadisticas' +
                '    </md-button>' +
                '  </md-dialog-actions>' +
                '</md-dialog>' +
                '</div>',
                controller: function DialogController($scope, $mdDialog) {
                    //Atributos para el char
                    $scope.labels = ["Correctas", "Incorrectas"];
                    $scope.data = [$scope.cuestionario.tests[$scope.cuestionario.tests.length - 1].correctas, $scope.cuestionario.tests[$scope.cuestionario.tests.length - 1].incorrectas];
                    $scope.colors = ['#D1E5B3', '#F08080'];
                    //Función que cierra el dialogo
                    $scope.closeDialog = function () {
                        $mdDialog.hide();
                    }
                }
            });

            //Si el conjunto de respuestas tiene alguna respuesta a algún cuestionario , se obtiene el titulo  del cuestionario , el nº de respuestas correctas y la fecha en la que se hizo.
            //Se obtiene el titulo , la calificación y la fecha de cuestionario
            $scope.title = $scope.cuestionario.title;
            $scope.respuestas = $scope.cuestionario.tests[$scope.cuestionario.tests.length - 1].cal;
            $scope.fecha = $scope.cuestionario.tests[$scope.cuestionario.tests.length - 1].date;
            //Objeto que contiene las estadisticas de cada cuestionario
            $scope.stat = {
                title: "",
                stats: {
                    labels: [],
                    series: [],
                    data: [],
                }
            };
            //Filtra cada objeto estadisticas por titulo 
            var result = $scope.cuestionario.stats.filter(function (obj) {
                return obj.title == $scope.title;
            });

            //Si no está el cuestionario reflejado se guarda la fecha , el titulo y el resultado || Si si que esta reflejado solamente se guarda la fecha y el resultado
            if (result.length == 0) {
                //$scope.stat.id = $scope.id;
                $scope.stat.title = $scope.title;
                $scope.stat.stats.labels = [$scope.fecha];
                $scope.stat.stats.series = [$scope.title];
                $scope.stat.stats.data = [[$scope.respuestas]];
                $scope.cuestionario.stats.push($scope.stat);
                menuFactory.getCuestionarios().update({ id: $scope.cuestionario.id }, $scope.cuestionario);
            } else {
                result[0].stats.labels.push($scope.fecha);
                result[0].stats.data[0].push($scope.respuestas);
            }

            //Resetea el formulario a  pristine
            $scope.testForm.$setPristine();

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
            link: function (scope, element) {
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

    .controller('MakerController', ['$scope', '$mdDialog', 'menuFactory', function ($scope, $mdDialog, menuFactory) {

        $scope.cuestionarios = menuFactory.getCuestionarios().query(
            function (response) {
                $scope.cuestionarios = response;
                $scope.showMenu = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            });

        $scope.quests = [];
        for (var i = 1; i <= 100; i++) {
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
            questions: [{
                title: "",
                pregunta: "",
                image: "img/libro.jpg",
                r1: "",
                r2: "",
                r3: "",
                r4: "",
                rcorrect: ""
            }],
            tests: [],
            stats: []
        };


        $scope.submitTest = function () {

            for (var i = 0; i < $scope.cuest.questions.length; i++) {
                //Se establece un identificador por cada pregunta
                if (typeof $scope.cuest.questions[i].image === "undefined") {
                    $scope.cuest.questions[i].image = "img/libro.jpg";
                }
                //Cada pregunta tiene como titulo el mismo titulo del cuestionario
                $scope.cuest.questions[i].title = $scope.cuest.title;
            }

            //Poner el cuestionaro creado en array de cuestionarios
            menuFactory.getCuestionarios().save($scope.cuest);
            //$scope.cuestionarios.push($scope.cuest);

            //Resetea el formulario a  pristine
            $scope.makerForm.$setPristine();

            //Resetea el objeto JavaScript una vez que el cuestionario ha sido creado
            $scope.cuest = {
                title: "",
                image: "img/libro.jpg",
                text: "",
                questions: [{
                    title: "",
                    pregunta: "",
                    image: "img/libro.jpg",
                    r1: "",
                    r2: "",
                    r3: "",
                    r4: "",
                    rcorrect: ""
                }],
                tests: [],
                stats: []
            };

        };

        $scope.fichero = {};
        //Función que importa un cuestionario desde un fichero en formato .json
        $scope.import = function () {

            $.getJSON($scope.fichero.fic, function (data) {
                //Se resetea las respuestas y las estadisticas 
                data.tests = []
                data.stats = []
                $scope.cuestionarios.push(data);
                //Se guarda el nuevo cuestionario en el array de cuestionarios
                menuFactory.getCuestionarios().save(data);
            })
                //Si el archivo no es un archivo de tipo json
                .fail(function () {
                    $mdDialog.show({
                        clickOutsideToClose: true,
                        scope: $scope,
                        preserveScope: true,
                        template: '<md-dialog aria-label="File invalid">' +
                        '  <md-dialog-content>' +
                        '<md-content class="md-padding">' +
                        ' <h5 class="md-title">Archivo no válido</h5>' +
                        ' <p class="md-textContent">Debes seleccionar un archivo en formato json</p>' +
                        '</md-content>      ' +
                        '  </md-dialog-content>' +
                        '  <md-dialog-actions>' +
                        '    <md-button ng-click="closeDialog()" class="md-primary">' +
                        '      Cerrar' +
                        '    </md-button>' +
                        '  </md-dialog-actions>' +
                        '</md-dialog>',

                        controller: function DialogController($scope, $mdDialog) {
                            $scope.closeDialog = function () {
                                $mdDialog.hide();
                            }
                        }
                    });
                })
        };

    }])

    .controller('StatsControllerDetails', ['$scope', '$stateParams', '$mdDialog', 'menuFactory', function ($scope, $stateParams, $mdDialog, menuFactory) {

        $scope.cuestionario =
            menuFactory.getCuestionarios().get({ id: parseInt($stateParams.id, 10) })
                .$promise.then(
                function (response) {
                    $scope.cuestionario = response;
                    $scope.showDish = true;
                    //Dialogo que aparece cuando no hay cuestionarios completados
                    if ($scope.cuestionario.stats.length == 0) {
                        $mdDialog.show({
                            clickOutsideToClose: false,

                            scope: $scope,
                            preserveScope: true,
                            template: '<md-dialog aria-label="List dialog">' +
                            '  <md-dialog-content>' +
                            '<md-content class="md-padding">' +
                            ' <h5 class="md-title">No hay estadisticas que mostrar</h5>' +
                            ' <p class="md-textContent">Todavía no has realizado ningún cuestionario</p>' +
                            '</md-content>      ' +
                            '  </md-dialog-content>' +
                            '  <md-dialog-actions>' +
                            '    <md-button ui-sref="app" ng-click="closeDialog()" class="md-primary">' +
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
                },
                function (response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
                );

        //Función que ordena los cuestionarios por titulo , por calificación o por fecha .
        $scope.filter = function (value) {
            switch (value) {
                case 1:
                    $scope.filtText = "-cal";
                    break;
                case 2:
                    $scope.filtText = "date";
                    break;
                default:
                    break;
            }
        };
        //Atributos para chart
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

    }])
    .controller('StatsController', ['$scope', '$stateParams', '$mdDialog', 'menuFactory', function ($scope, $stateParams, $mdDialog, menuFactory) {

        $scope.cuestionario =
            menuFactory.getCuestionarios().query()
                .$promise.then(
                function (response) {
                    $scope.cuestionario = response;
                    $scope.showDish = true;
                    console.log($scope.cuestionario)
                    //Dialogo que aparece cuando no hay cuestionarios completados
                    if ($scope.cuestionario[0].tests.length == 0) {
                        $mdDialog.show({
                            clickOutsideToClose: false,
                            scope: $scope,
                            preserveScope: true,
                            template: '<md-dialog aria-label="List dialog">' +
                            '  <md-dialog-content>' +
                            '<md-content class="md-padding">' +
                            ' <h5 class="md-title">No hay estadisticas que mostrar</h5>' +
                            ' <p class="md-textContent">Todavía no has realizado ningún cuestionario</p>' +
                            '</md-content>      ' +
                            '  </md-dialog-content>' +
                            '  <md-dialog-actions>' +
                            '    <md-button ui-sref="app" ng-click="closeDialog()" class="md-primary">' +
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
                },
                function (response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
                );

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
                default:
                    break;
            }
        };
    }]);