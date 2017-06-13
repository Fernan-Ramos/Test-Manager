/**
    Test-Manager
    Copyright (c) 2016 - 2017 Fernán Ramos Sáiz
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

 */

/**
 * @author Fernán Ramos Saiz <frs0012@alu.ubu.es>
 * @version 1.0
 * @description Fichero que almacena los controlladores utilizados en la aplicación
 */
'use strict';
angular.module('testManagerApp')
    /**
     * @ngdoc controller 
     * @name testManagerApp.controller:MenuController
     * @description
     * Controlador que gestiona la operaciones de la vista menu
     * Se realizan las operaciones:
     *  Obtener cuestionarios- GET
     *  Exportar cuestionarios
     *  Eliminar cuestionarios- DELETE
     */
    .controller('MenuController', ['$scope', '$mdDialog', '$state', 'menuFactory', function ($scope, $mdDialog, $state, menuFactory) {

        $scope.showMenu = false;
        $scope.message;
        /**
         * Se obtiene los cuestionarios de la base de datos
         */
        $scope.cuestionarios = menuFactory.query(
            function (response) {
                $scope.cuestionarios = response[0].cuestionarios;
                $scope.showMenu = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            });

        /**
         * @ngdoc method
         * @name exportCuest
         * @methodOf testManagerApp.controller:MenuController
         * @scope
         * @description
         * Función que exporta un cuestionario a fichero en formato json
         * @param {Object} cuest cuestionario a exportar
         */
        $scope.exportCuest = function (cuest) {
            //Se copia el cuestionario a exportar
            $scope.cuestExport = angular.copy(cuest);
            //Se determina el nombre del fichero
            var filename = $scope.cuestExport.title + '.json';
            //Se resetea el id, las respuestas y las estadisticas
            delete $scope.cuestExport._id;
            $scope.cuestExport.tests = [];
            $scope.cuestExport.stats = [];
            //Se establece el cuestionario como privado
            $scope.cuestExport.cuestCloud = false;
            if (typeof $scope.cuestExport === 'object') {
                $scope.cuestExport = JSON.stringify($scope.cuestExport, undefined, 2);
            }
            var blob = new Blob([$scope.cuestExport], {
                type: 'text/json'
            });

            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blob, filename);
            } else {
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

        /**
         * @name selectQuestions
         * @methodOf testManagerApp.controller:MenuController
         * @scope
         * @description
         * Función que permite elegir el número de preguntas de un cuestionario
         * @param {Object} cuest cuestionario 
         */
        $scope.selectQuestions = function (cuest) {
            //Se muestra un diálogo donde se permite la introducción del número de preguntas
            $mdDialog.show({
                clickOutsideToClose: true,
                scope: $scope,
                locals: {
                    cuest: cuest
                },
                preserveScope: true,
                template: '<md-dialog aria-label="List dialog">' +
                    '  <md-dialog-content>' +
                    '<md-content class="md-padding">' +
                    ' <h5 class="md-title" translate="SELECTQUESTIONS1"></h5>' +
                    '<hr>' +
                    ' <form name="projectForm" ng-submit="saveQuestions()">' +
                    '<md-input-container class="md-block">' +
                    '<label translate="SELECTQUESTIONS2">Nº de preguntas</label>' +
                    '<input required type="number" name="rate" ng-model="number" min="1"' +
                    'max={{cuest.questions.length}} />' +
                    '<div ng-messages="projectForm.rate.$error" multiple md-auto-hide="false">' +
                    '<div ng-message="required">' +
                    '<p translate="SELECTQUESTIONSERROR">El maximo de preguntas son </p><b>{{cuest.questions.length}}</b>' +
                    '</div>' +
                    '</div>' +
                    '</md-content>' +
                    '</md-input-container>' +
                    '  </md-dialog-content>' +
                    '  <md-dialog-actions>' +
                    '    <div>' +
                    '<md-button type="submit" class="md-raised md-primary"  ng-disabled="projectForm.$invalid" translate="DO"></md-button>' +
                    '</div>' +
                    '    </md-button>' +
                    '</md-dialog-actions>' +
                    '</md-dialog>',
                controller: function DialogController($mdDialog, cuest) {
                    $scope.cuest = cuest;
                    $scope.number = "";
                    $scope.saveQuestions = function () {
                        var questions = angular.copy($scope.number);
                        //Se redirige al estado testDetails con el id del cuestionario y el número de preguntas seleccionadas como parámetros
                        $state.go('app.testDetails', {
                            id: cuest._id,
                            numberQuestions: questions
                        });
                    }
                }
            });
        }

        /**
         * @ngdoc method
         * @name removeCuest
         * @methodOf testManagerApp.controller:MenuController
         * @scope
         * @description
         * Función que permite borrar un cuestionario
         * @param {Object} cuestionario a borrar
         */
        $scope.removeCuest = function (cuest) {
            $mdDialog.show({
                clickOutsideToClose: true,
                scope: $scope,
                preserveScope: true,
                template: '<md-dialog aria-label="List dialog">' +
                    '  <md-dialog-content>' +
                    '<md-content class="md-padding">' +
                    ' <h5 translate="REMOVEQUESTION" class="md-title">Estas seguro de eliminar este cuestionario</h5>' +
                    '</md-content>      ' +
                    '  </md-dialog-content>' +
                    '  <md-dialog-actions>' +
                    '    <md-button translate="REMOVEQUIZ" ui-sref="app" ng-click="remove()" class="md-primary">' +
                    '      Eliminar' +
                    '    </md-button>' +
                    '    <md-button translate="CANCELREMOVE" ng-click="closeDialog()" class="md-primary">' +
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
                        menuFactory.remove(cuest);
                    }

                    $scope.closeDialog = function () {
                        $mdDialog.hide();
                    }
                }
            });

        };

    }])

    /**
     * @ngdoc controller
     * @name testManagerApp.controller:TestController
     * @description 
     * Controlador que gestiona las operaciones de la vista testDetails
     * Se realizan las operaciones:
     *  Obtener cuestionario por id- GET
     *  Guardar estadísticas del cuestioanrio- PUT
     */
    .controller('TestController', ['$scope', '$filter', '$stateParams', '$mdDialog', 'menuFactory', function ($scope, $filter, $stateParams, $mdDialog, menuFactory) {
        $scope.form = {};
        $scope.showCuestionario = false;
        $scope.message;

        /**
         * Se obtiene el cuestionario por su id de la base de datos
         */
        $scope.cuestionario =
            menuFactory.get({
                id: $stateParams.id
            })
            .$promise.then(
                function (response) {
                    $scope.showCuestionario = true;
                    $scope.cuestionario = response.cuestionarios[0];
                    //Se guarda el número de preguntas seleccionadas para el cuestionario
                    var numQuestions = $stateParams.numberQuestions;
                    //Array temporal de preguntas
                    var questionsTmp = $scope.cuestionario.questions.slice($scope.cuestionario.questions);
                    $scope.questionsSelected = [];
                    var quest = 0;
                    while (quest < numQuestions) {
                        //Se obtiene una pregunta de forma aleatoria
                        var question = questionsTmp[Math.floor(Math.random() * questionsTmp.length)];
                        var index = questionsTmp.indexOf(question);
                        //Para que no haya duplicados se borra la pregunta obtenida del array temporal
                        questionsTmp.splice(index, 1);
                        //Se guarda la pregunta aleatoria
                        $scope.questionsSelected.push(question);
                        quest++;
                    }

                    //Se crea un objeto que contendra la respuestas
                    $scope.answer = {};
                    //Se crea un array dentro del objeto respuesta que contendrá la respuesta a cada pregunta
                    $scope.answer.questions = [];
                    //Se añade un objeto al array $scope.answer.questions donde se guarda las respuestas correctas y el texto de la pregunta por cada pregunta del cuestionario 
                    for (var i = 0; i < $scope.questionsSelected.length; i++) {
                        var obj = {};
                        obj.rcorrect = $scope.questionsSelected[i].rcorrect;
                        obj.pregunta = $scope.questionsSelected[i].pregunta;
                        $scope.answer.questions.push(obj)
                    }
                    $scope.selected = [];
                    //Por cada pregunta del cuestionaro se guarda un array de respuestas
                    for (var j = 0; j < $scope.questionsSelected.length; j++) {
                        $scope.selected.push([]);
                    }
                    /**
                     * @ngdoc method
                     * @name toggle
                     * @methodOf testManagerApp.controller:TestController
                     * @description
                     * Función que añade o elimina una respuesta al array de respuestas
                     * @param {Object} item Respuesta 
                     * @param {Array} list array de respuestas de la pregunta
                     */
                    $scope.toggle = function (item, list) {
                        var idx = list.indexOf(item);
                        if (idx > -1) {
                            list.splice(idx, 1);
                        } else {
                            list.push(item);
                        }
                    };
                    /**
                     * @ngdoc method
                     * @name exists
                     * @methodOf testManagerApp.controller:TestController
                     * @description
                     * Función que comprueba si el elemento existe en el array de respuestas
                     * @param {Object} item Elemento 
                     * @param {Array} list array de respuestas de la pregunta
                     * @returns {Boolean} true si existe, false si no exite
                     */
                    $scope.exists = function (item, list) {
                        return list.indexOf(item) > -1;
                    };
                },
                function (response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );

        /**
         * @ngdoc method
         * @name calmultiple
         * @methodOf testManagerApp.controller:TestController
         * @description
         * Función que calcula la calificación para preguntas de tipo multiple
         * @param {Integer} j índice 
         * @param {Array} respuestas array de respuestas de la pregunta
         * @param {String} type tipo de calificación múltiple
         */
        function calmultiple(j, respuestas, type) {
            var correct = 0;
            var incorrect = 0;
            for (var z = 0; z < respuestas.length; z++) {
                if (($scope.answer.questions[j].rcorrect.includes(respuestas[z]) && $scope.answer.questions[j].r.includes(respuestas[z])) || (!$scope.answer.questions[j].rcorrect.includes(respuestas[z]) && !$scope.answer.questions[j].r.includes(respuestas[z])))
                    correct++;
                else
                    incorrect++;
            }
            if (type === "pos")
                $scope.answer.questions[j].estado = correct / respuestas.length;

            if (type === "neg")
                $scope.answer.questions[j].estado = (correct - incorrect) / respuestas.length;

            calEstado($scope.answer.questions[j].estado);
        }

        /**
         * @ngdoc method
         * @name calEstado
         * @methodOf testManagerApp.controller:TestController
         * @description
         * Función que determina el tipo de respuesta: correcta, incorrecta o parcial
         * @param {Integer} estado calificación de la pregunta
         */
        function calEstado(estado) {
            if (estado < 0) {
                $scope.negativas = $scope.negativas + estado;
                $scope.incorrectas++;
            } else if (estado === 0) {
                $scope.incorrectas++;
            } else if (estado < 1 && estado > 0) {
                $scope.parciales = $scope.parciales + estado;
                $scope.parcial++;
            } else if (estado === 1) {
                $scope.correctas++;
            }

        }

        /**
         * @ngdoc method
         * @name submitAnswer
         * @methodOf testManagerApp.controller:TestController
         * @scope
         * @description
         * Función que permite guardar los resultados obtenidos del cuestionario
         */
        $scope.submitAnswer = function () {
            //Se guarda la fecha en la que se realiza el cuestionario
            $scope.answer.date = $filter('date')(new Date(), 'y/M/d');
            //Si la pregunta es de tipo múltiple se guarda el array de respuestas contestadas en cada pregunta.
            for (var i = 0; i < $scope.selected.length; i++) {
                if ($scope.questionsSelected[i].tipo === "multiple")
                    $scope.answer.questions[i].r = $scope.selected[i];
            }

            $scope.correctas = 0;
            $scope.incorrectas = 0;
            $scope.parcial = 0;
            var respuestas = [];
            $scope.parciales = 0;
            $scope.negativas = 0;
            //Se recorre el array de preguntas 
            for (var j = 0; j < $scope.answer.questions.length; j++) {
                //Si la pregunta es de tipo unica y la respuesta dada corresponde con la respuesta correcta
                if ($scope.questionsSelected[j].tipo === "unica" && $scope.answer.questions[j].rcorrect === $scope.answer.questions[j].r) {
                    $scope.correctas++;
                    //Determina que la respuesta es correcta
                    $scope.answer.questions[j].estado = 1;
                }
                //Si la pregunta es de tipo múltiple
                else if ($scope.questionsSelected[j].tipo === "multiple") {
                    respuestas.push($scope.questionsSelected[j].r1, $scope.questionsSelected[j].r2, $scope.questionsSelected[j].r3, $scope.questionsSelected[j].r4);
                    calmultiple(j, respuestas, $scope.cuestionario.type);
                } else {
                    $scope.incorrectas++;
                    //Determina que la respuesta es incorrecta
                    $scope.answer.questions[j].estado = 0;
                }
                respuestas = [];
            }

            //Se guarda las respuestas correctas 
            $scope.answer.correctas = $scope.correctas;
            //Se guarda las respuestas incorrectas 
            $scope.answer.incorrectas = $scope.incorrectas;
            //Se guarda las respuestas parcialmente correctas
            $scope.answer.parcial = $scope.parcial;
            //Se guarda la calificación obtenida
            $scope.answer.cal = parseFloat($filter('number')((($scope.answer.correctas + $scope.parciales + $scope.negativas) / $scope.answer.questions.length) * 100, 2), 10);

            $scope.cuestionario.tests.push($scope.answer);
            //Se guarda la respuesta al cuestionario en el array de respuestas a cuestionarios
            menuFactory.update({
                id: $stateParams.id
            }, $scope.cuestionario);
            //Diálogo que muestra los resultados del cuestionario realizado
            $mdDialog.show({
                clickOutsideToClose: false,
                scope: $scope,
                preserveScope: true,
                template:

                    '<md-dialog aria-label="Respuestas">' +
                    '<md-toolbar class="nav-teal">' +
                    '<div class="md-toolbar-tools" >' +
                    '<h2 style="color:floralwhite">{{cuestionario.title}}</h2>' +
                    '<span flex></span>' +
                    '</div>' +
                    ' </md-toolbar>' +
                    '  <md-dialog-content>' +
                    '<md-tabs md-dynamic-height md-border-bottom>' +
                    '<md-tab label="{{\'RESULTTAB\' | translate}}">' +
                    '<md-content class="md-padding">' +
                    '<h5 class="md-display-1" style="text-align:center"><em>{{cuestionario.tests[cuestionario.tests.length-1].cal | number:2}}%</em></h5>' +
                    '</md-content>' +
                    '<md-content class="md-padding">' +
                    '<canvas id="doughnut" class="chart chart-doughnut" chart-data="data" chart-labels="labels" chart-colors="colors">' +
                    '</canvas>' +
                    '</md-content>' +
                    '</md-tab>' +
                    '<md-tab label="{{\'SUMMARYTAB\' | translate}}">' +
                    ' <md-content class="md-padding" ng-repeat="preg in cuestionario.tests[cuestionario.tests.length-1].questions  track by $index">' +
                    '<div ng-if="preg.estado==1" class="bs-callout bs-callout-success">' +
                    '<h4><em>{{\'QUESTION\'| translate}} {{ $index+1 }} : {{preg.pregunta}}</em></h4>' +
                    '<p translate>{{\'CORRECT\'}} </p> <strong class="text-success">{{preg.rcorrect}}</strong> ' +
                    '</div>' +
                    '<div ng-if="preg.estado==0" class="bs-callout bs-callout-danger">' +
                    '<h4><em>{{\'QUESTION\'| translate}} {{ $index+1 }} : {{preg.pregunta}}</em></h4>' +
                    '<p translate>{{\'INCORRECT\'}} </p> <strong class="text-danger">{{preg.r}} </strong> ' +
                    ' </div>' +
                    '<div ng-if="preg.estado>0 && preg.estado<1 " class="bs-callout bs-callout-warning">' +
                    '<h4><em>{{\'QUESTION\'| translate}} {{ $index+1 }} : {{preg.pregunta}}</em></h4>' +
                    '<p translate>{{\'PARCIAL1\'}}</p> <strong class="text-warning">{{preg.r}} </strong> <p translate>{{\'PARCIAL2\'}}</p>' +
                    ' </div>' +
                    '</md-content>' +
                    '</md-tab>' +
                    '</md-tabs>' +
                    '  </md-dialog-content>' +
                    '  <md-dialog-actions>' +
                    '    <md-button ui-sref="app" ng-click="closeDialog()" class="md-primary">' +
                    '      Menu' +
                    '    </md-button>' +
                    '    <md-button translate="STAT" ui-sref="app.statDetails({id: cuestionario._id})" ng-click="closeDialog()" class="md-primary">' +
                    '      Estadisticas' +
                    '    </md-button>' +
                    '  </md-dialog-actions>' +
                    '</md-dialog>',

                controller: function DialogController($scope, $mdDialog) {
                    //Atributos para el char
                    $scope.labels = ["Correctas", "Incorrectas", "Parcial"];
                    $scope.data = [$scope.cuestionario.tests[$scope.cuestionario.tests.length - 1].correctas, $scope.cuestionario.tests[$scope.cuestionario.tests.length - 1].incorrectas, $scope.cuestionario.tests[$scope.cuestionario.tests.length - 1].parcial];
                    $scope.colors = ['#D1E5B3', '#F08080', '#f7d3a0'];
                    //Función que cierra el dialogo
                    $scope.closeDialog = function () {
                        $mdDialog.hide();
                    }
                }
            });

            //Se obtiene el titulo, la calificación y la fecha de cuestionario
            $scope.title = $scope.cuestionario.title;
            $scope.respuestas = $scope.cuestionario.tests[$scope.cuestionario.tests.length - 1].cal;
            $scope.fecha = $scope.cuestionario.tests[$scope.cuestionario.tests.length - 1].date;
            //colores para chart
            var colors = ['#D1E5B3', '#F08080', '#f7d3a0', '#efe6a0', '#a0efc7', '#a9c6f2', '#b7a8f1', '#dba7f0', '#efa6b9'];
            //Objeto que contiene las estadisticas de cada cuestionario
            $scope.stat = {
                title: "",
                stats: {
                    labels: [],
                    series: [],
                    data: []
                }
            };
            //Filtra cada objeto estadisticas por titulo 
            var result = $scope.cuestionario.stats.filter(function (obj) {
                return obj.title === $scope.title;
            });

            //Si no está el cuestionario reflejado se guarda la fecha, el titulo y el resultado || Si sí que esta reflejado solamente se guarda la fecha y el resultado
            if (result.length === 0) {
                $scope.stat.title = $scope.title;
                $scope.stat.stats.labels = [$scope.fecha];
                $scope.stat.stats.series = [$scope.title];
                $scope.stat.stats.data = [
                    [$scope.respuestas]
                ];
                $scope.stat.stats.colors = [colors[Math.floor(Math.random() * colors.length)]];
                $scope.cuestionario.stats.push($scope.stat);
                menuFactory.update({
                    id: $stateParams.id
                }, $scope.cuestionario);
            } else {
                result[0].stats.labels.push($scope.fecha);
                result[0].stats.data[0].push($scope.respuestas);
            }

            //Resetea el formulario a  pristine
            $scope.form.testForm.$setPristine();

            //Se resetea el objeto respuesta
            $scope.answer = {};
        };

    }])

    /**
     * @ngdoc directive
     * @name testManagerApp.directive:fileread
     * @scope
     * @description
     * Directiva que permite cargar un fichero en formato base64
     */
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

    /**
     * @ngdoc controller
     * @name testManagerApp.controller:CloudController
     * @description
     * Controlador que gestiona las operaciones de la vista cloud
     * Se realizan las operaciones:
     *  Obtener todos los cuestionarios privados- GET
     *  Obtener todos los cuestionarios públicos- GET
     *  Guardar cuestionario público como privado- POST
     */
    .controller('CloudController', ['$scope', '$mdDialog', 'cloudFactory', 'menuFactory', function ($scope, $mdDialog, cloudFactory, menuFactory) {
        /**
         * Se obtiene los cuestionarios privados
         */
        $scope.menu = menuFactory.query(
            function (response) {
                $scope.menu = response[0].cuestionarios;
                $scope.showMenu = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            });

        $scope.showCloud = false;
        /**
         * Se obtiene los cuestionarios públicos
         */
        $scope.cuestionarios = cloudFactory.query(
            function (response) {
                $scope.cuestionarios = response;
                $scope.showCloud = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );

        /**
         * @ngdoc method
         * @name addtoMenu
         * @methodOf testManagerApp.controller:CloudController
         * @scope
         * @description
         * Función que añade un cuestionario de la nube al menu
         * Se borra su identifador para evitar conflictos en la base de datos
         * @param {Object} test Cuestionario a añadir
         */
        $scope.addtoMenu = function (test) {
            //Se comprueba si el cuestionario a añadir ya existe como cuestionario privado
            var isFav = $scope.menu.some(function (element) {
                return element._id === test._id;
            });
            if (!isFav) {
                //Se borran las estadisticas
                test.stats = [];
                test.tests = [];
                //cuestCloud se declara como false de forma que no haya cuestionarios públicos repetidos
                test.cuestCloud = false;
                menuFactory.save(test);
            } else {
                //Diálogo que indica que el cuestionario ya existe en el menu
                $mdDialog.show({
                    clickOutsideToClose: true,
                    scope: $scope,
                    locals: {
                        test: test
                    },
                    preserveScope: true,
                    template: '<md-dialog aria-label="List dialog">' +
                        '  <md-dialog-content>' +
                        '<md-content class="md-padding">' +
                        ' <h5  translate="EXISTFAVORITE" class="md-title">Ya existe el favorito</h5> <em>{{test.title}}</em>' +
                        '</md-content>      ' +
                        '  </md-dialog-content>' +
                        '  <md-dialog-actions>' +
                        '    <md-button  ui-sref="app" ng-click="closeDialog()" class="md-primary">' +
                        '      Menu' +
                        '    </md-button>' +
                        '  </md-dialog-actions>' +
                        '</md-dialog>',
                    controller: function DialogController($scope, $mdDialog, test) {
                        $scope.test = test;
                        $scope.closeDialog = function () {
                            $mdDialog.hide();
                        }
                    }
                });
            }


        }

    }])
    /**
     * @ngdoc controller
     * @name testManagerApp.controller:MakerController
     * @description
     * Controlador que gestiona las operaciones de la vista maker
     * Se realizan las operaciones:
     *  Obtener todos los cuestionarios- GET
     *  Guardar el cuestionario creado- POST
     */
    .controller('MakerController', ['$scope', '$mdDialog', 'menuFactory', 'AuthFactory', function ($scope, $mdDialog, menuFactory, AuthFactory) {
        $scope.form = {};
        $scope.showMaker = false;
        $scope.message;
        /**
         * Se obtiene los cuestionarios privados
         */
        $scope.cuestionarios = menuFactory.query(
            function (response) {
                $scope.cuestionarios = response[0].cuestionarios;
                $scope.showMaker = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            });


        $scope.quests = [];
        //Se determina un número máximo de 100 preguntas
        for (var i = 1; i <= 100; i++) {
            $scope.quests.push(i);
        }

        $scope.selectedQuest;

        /**
         * @ngdoc method
         * @name getSelectedQuest
         * @methodOf testManagerApp.controller:MakerController
         * @scope
         * @description
         * Función que asocia una seleccion a una variable $scope
         * @returns {Integer} Número seleccionado
         */
        $scope.getSelectedQuest = function () {
            if ($scope.selectedQuest !== undefined) {
                $scope.number = $scope.selectedQuest;
                return $scope.selectedQuest;
            }
        };
        /**
         * @ngdoc method
         * @name getNumber
         * @methodOf testManagerApp.controller:MakerController
         * @scope
         * @description
         * Función que genera un array de longuitud num
         * @param {Integer} num longuitud del array  
         */
        $scope.getNumber = function (num) {
            return Array.apply(null, Array(num)).map(function (x, i) {
                return i;
            });
        };


        $scope.cuest = {
            title: "",
            text: "",
            type: "",
            cuestCloud: "",
            author: "",
            questions: [{
                pregunta: "",
                tipo: "",
                r1: "",
                r2: "",
                r3: "",
                r4: "",
                rcorrect: ""
            }],
            tests: [],
            stats: []
        };

        /**
         * @ngdoc method
         * @name submitTest
         * @methodOf testManagerApp.controller:MakerController
         * @scope
         * @description
         * Función que guarda un cuestionario creado en el menu
         */
        $scope.submitTest = function () {
            //El autor del cuestionario se obtiene del nombre de usuario
            $scope.cuest.author = AuthFactory.getUsername();
            //Se guarda el objeto cuestionario en el menu
            menuFactory.save($scope.cuest);
            //Resetea el formulario a pristine
            $scope.form.makerForm.$setPristine();
            $mdDialog.show({
                clickOutsideToClose: true,
                scope: $scope,
                preserveScope: true,
                template: '<md-dialog aria-label="File add">' +
                    '  <md-dialog-content>' +
                    '<md-content class="md-padding">' +
                    ' <h5 translate="IMPORTSUCCESS1" class="md-title"></h5>' +
                    ' <p translate="IMPORTSUCCESS2" class="md-textContent"></p>' +
                    '</md-content>' +
                    '  </md-dialog-content>' +
                    '  <md-dialog-actions>' +
                    '    <md-button translate="MENU" ui-sref="app" ng-click="closeDialog()" class="md-primary">' +
                    '      Menu' +
                    '    </md-button>' +
                    '    <md-button translate="CLOSE" ng-click="closeDialog()" class="md-primary">' +
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
            //Resetea el objeto JavaScript una vez que el cuestionario ha sido creado
            $scope.cuest = {
                title: "",
                text: "",
                type: "",
                cuestCloud: "",
                author: "",
                questions: [{
                    pregunta: "",
                    tipo: "",
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
        /**
         * @ngdoc method
         * @name import
         * @methodOf testManagerApp.controller:MakerController
         * @scope
         * @description
         * Función que importa un cuestionario desde un fichero en formato .json
         */
        $scope.import = function () {

            $.getJSON($scope.fichero.fic, function (data) {
                    //Se resetea las respuestas y las estadisticas 
                    data.tests = []
                    data.stats = []
                    $scope.cuestionarios.push(data);
                    //Se guarda el nuevo cuestionario en el array de cuestionarios
                    menuFactory.save(data).$promise.then(
                        //success
                        function () {
                            $mdDialog.show({
                                clickOutsideToClose: true,
                                scope: $scope,
                                preserveScope: true,
                                template: '<md-dialog aria-label="File add">' +
                                    '  <md-dialog-content>' +
                                    '<md-content class="md-padding">' +
                                    ' <h5 translate="IMPORTSUCCESS1" class="md-title"></h5>' +
                                    ' <p translate="IMPORTSUCCESS2" class="md-textContent"></p>' +
                                    '</md-content>' +
                                    '  </md-dialog-content>' +
                                    '  <md-dialog-actions>' +
                                    '    <md-button translate="MENU" ui-sref="app" ng-click="closeDialog()" class="md-primary">' +
                                    '      Menu' +
                                    '    </md-button>' +
                                    '    <md-button translate="CLOSE" ng-click="closeDialog()" class="md-primary">' +
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
                        },
                        //error
                        function () {
                            $mdDialog.show({
                                clickOutsideToClose: true,
                                scope: $scope,
                                preserveScope: true,
                                template: '<md-dialog aria-label="File invalid">' +
                                    '  <md-dialog-content>' +
                                    '<md-content class="md-padding">' +
                                    ' <h5 translate="IMPORTERROR1" class="md-title text-danger"></h5>' +
                                    ' <p translate="IMPORTERROR2" class="md-textContent"></p>' +
                                    '</md-content>' +
                                    '  </md-dialog-content>' +
                                    '  <md-dialog-actions>' +
                                    '    <md-button translate="CLOSE" ng-click="closeDialog()" class="md-primary">' +
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
                        }
                    )

                })
                //Si el archivo no es un archivo de tipo json se muestra un diálogo indicándolo
                .fail(function () {
                    $mdDialog.show({
                        clickOutsideToClose: true,
                        scope: $scope,
                        preserveScope: true,
                        template: '<md-dialog aria-label="File invalid">' +
                            '  <md-dialog-content>' +
                            '<md-content class="md-padding">' +
                            ' <h5 translate="FILENOTVALID" class="md-title">Archivo no válido</h5>' +
                            ' <p translate="FILEREC" class="md-textContent">Debes seleccionar un archivo en formato json</p>' +
                            '</md-content>      ' +
                            '  </md-dialog-content>' +
                            '  <md-dialog-actions>' +
                            '    <md-button translate="CLOSE" ng-click="closeDialog()" class="md-primary">' +
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

    /**
     * @ngdoc controller
     * @name testManagerApp.controller:StatsControllerDetails
     * @description
     * Controlador que gestiona las operaciones de la vista statDetails
     * Se realizan las operaciones:
     *  Obtener el cuestionario del que se desean mostrar las estadísticas- GET
     *  
     */
    .controller('StatsControllerDetails', ['$scope', '$filter', '$stateParams', '$mdDialog', 'menuFactory', function ($scope, $filter, $stateParams, $mdDialog, menuFactory) {
        $scope.showStatInd = false;
        $scope.message;
        /**
         * Se obtiene el cuestionario por id 
         */
        $scope.cuestionario =
            menuFactory.get({
                id: $stateParams.id
            })
            .$promise.then(
                function (response) {
                    $scope.cuestionario = response.cuestionarios[0];
                    $scope.showStatInd = true;
                    //Dialogo que aparece cuando no hay cuestionarios completados
                    if ($scope.cuestionario.stats.length === 0) {
                        $mdDialog.show({
                            clickOutsideToClose: true,
                            scope: $scope,
                            preserveScope: true,
                            template: '<md-dialog aria-label="List dialog">' +
                                '  <md-dialog-content>' +
                                '<md-content class="md-padding">' +
                                ' <h5 class="md-title" translate>{{\'STATDIALOGTEXT\'}}</h5>' +
                                ' <p class="md-textContent" translate>{{\'STATDIALOGTEXT\'}}</p>' +
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

        /**
         * @ngdoc method
         * @name filter
         * @methodOf testManagerApp.controller:StatsControllerDetails
         * @scope
         * @description
         * Función que ordena los cuestionarios por titulo , por calificación o por fecha.
         * @param {Integer} value valor númerico
         */
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

        /**
         * @ngdoc method
         * @name convertCanvasToImage
         * @methodOf testManagerApp.controller:StatsControllerDetails
         * @description
         * Función que convierte un elemento canvas a formato base64
         * @param {any} canvas elemento canvas a convertir
         * @returns {String} imagen con formato base64
         */
        function convertCanvasToImage(canvas) {
            var image = new Image();
            image.src = canvas.toDataURL("image/png");
            return image.src;
        }

        /**
         * @ngdoc method
         * @name exportPDF
         * @methodOf testManagerApp.controller:StatsControllerDetails
         * @scope
         * @description
         * Función que exporta las estadísticas de un cuestionario en formato PDF
         * @param {Objetc} cuest objeto cuestionario
         */
        $scope.exportPDF = function (cuest) {
            //Determina la orientación del documento PDF
            var doc = new jsPDF({
                orientation: 'landscape'
            });
            var specialElementHandlers = {
                '#editor': function () {
                    return true;
                }
            };
            doc.setFontSize(40);
            doc.setTextColor(0, 128, 128);
            doc.text(150, 40, cuest.title, null, null, 'center');
            doc.setFontSize(20);
            doc.setTextColor(0, 0, 0);
            doc.setFontType("italic");

            doc.setTextColor(0, 128, 128);
            doc.text(20, 60, $filter('translate')('PDFTITLE1'));
            doc.addImage(convertCanvasToImage(document.getElementById("line")), 'PNG', 50, 80, 200, 100);
            doc.addPage();
            doc.text(20, 20, $filter('translate')('PDFTITLE2'));
            doc.fromHTML($("#tests").get(0), 30, 40, {
                'width': 170,
                'elementHandlers': specialElementHandlers
            });
            doc.save(cuest.title + '.pdf');
        }

        //Atributos para chart
        $scope.options1 = {
            responsive: true,
            scaleBeginAtZero: false,
            barBeginAtOrigin: true
        };

    }])

    /**
     * @ngdoc controller
     * @name testManagerApp.controller:StatsController
     * @description
     * Controlador que gestiona las operaciones de la vista stats
     * Se realiza las operaciones:
     * Se obtiene todos los cuestionarios para mostrar las estadisticas de todos ellos- GET
     * 
     */
    .controller('StatsController', ['$scope', '$stateParams', '$translate', '$mdDialog', '$filter', 'menuFactory', function ($scope, $stateParams, $translate, $mdDialog, $filter, menuFactory) {
        $scope.showStat = false;
        $scope.message;
        /**
         * Se obtiene todos los cuestionarios 
         */
        $scope.cuestionario =
            menuFactory.query()
            .$promise.then(
                function (response) {
                    $scope.cuestionario = response[0].cuestionarios;
                    $scope.showStat = true;
                },
                function (response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );

        /**
         * @ngdoc method
         * @name dialogo
         * @methodOf testManagerApp.controller:StatsController
         * @scope
         * @description
         * Funcion que muestra un dialogo cuando no se ha realizado un cuestionario pasado por parámetro
         * @param {Object} cuest cuestionario
         */
        $scope.dialogo = function (cuest) {
            if (cuest.length == 0) {
                $mdDialog.show({
                    clickOutsideToClose: true,
                    scope: $scope,
                    preserveScope: true,
                    template: '<md-dialog aria-label="List dialog">' +
                        '  <md-dialog-content>' +
                        '<md-content class="md-padding">' +
                        ' <h5 class="md-title" translate>{{\'STATSDIALOGTITLE\'}}</h5>' +
                        ' <p class="md-textContent" translate>{{\'STATSDIALOGTEXT\'}}</p>' +
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
        }
        //Atributos para chart
        $scope.options2 = {
            responsive: true,
            scaleBeginAtZero: false,
            barBeginAtOrigin: true

        };

        /**
         * @ngdoc method
         * @name filter
         * @methodOf testManagerApp.controller:StatsController
         * @scope
         * @description
         * Función que ordena los cuestionarios por titulo , por calificación o por fecha.
         * @param {Integer} value valor númerico
         */
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
    }])

    /**
     * @ngdoc controller
     * @name testManagerApp.controller:HeaderController
     * @description
     * Controlador que gestiona las operaciones de la vista header
     */
    .controller('HeaderController', ['$scope', '$translate', '$state', '$rootScope', 'ngDialog', 'AuthFactory', function ($scope, $translate, $state, $rootScope, ngDialog, AuthFactory) {

        $scope.loggedIn = false;
        $scope.username = '';
        /**
         * @ngdoc method
         * @name changeLanguage
         * @methodOf testManagerApp.controller:HeaderController
         * @scope
         * @description
         * Función que permite cambiar de idioma
         * @param {String} key string que determina el idioma
         */
        $scope.changeLanguage = function (key) {
            $translate.use(key);
        };

        if (AuthFactory.isAuthenticated()) {
            $scope.loggedIn = true;
            $scope.username = AuthFactory.getUsername();
        }
        /**
         * @ngdoc method
         * @name logOut
         * @methodOf testManagerApp.controller:HeaderController
         * @description
         * Función que finaliza sesión en la aplicación
         */
        $scope.logOut = function () {
            AuthFactory.logout();
            $scope.loggedIn = false;
            $scope.username = '';
            $state.go('login');
        };
        /**
         * 
         * Función que comprueba si el acceso es satisfactorio
         */
        $rootScope.$on('login:Successful', function () {
            $scope.loggedIn = AuthFactory.isAuthenticated();
            $scope.username = AuthFactory.getUsername();
        });
        /**
         * Función que comprueba si el registro es satisfactorio
         */
        $rootScope.$on('registration:Successful', function () {
            $scope.loggedIn = AuthFactory.isAuthenticated();
            $scope.username = AuthFactory.getUsername();
        });

        $scope.stateis = function (curstate) {
            return $state.is(curstate);
        };

    }])

    /**
     * @ngdoc controller
     * @name testManagerApp.controller:LoginController
     * @description
     * Controlador que gestiona las operaciones de la vista home, vista principal que aparece antes de acceder a la aplicación
     * Permite realizar el acceso a un usuario en la aplicación
     */
    .controller('LoginController', ['$state', '$scope', '$translate', 'ngDialog', '$rootScope', '$localStorage', 'AuthFactory', function ($state, $scope, $translate, ngDialog, $rootScope, $localStorage, AuthFactory) {

        //Permite el scroll a la seccion de caracteristicas
        $(document).ready(function () {
            $("#click").click(function () {
                $('html, body').animate({
                    scrollTop: $("#features").offset().top
                }, 2000);
            });
        });

        $scope.loggedIn = false;
        $scope.username = '';
        /**
         * @ngdoc method
         * @name changeLanguage
         * @methodOf testManagerApp.controller:LoginController
         * @scope
         * @description
         * Función que permite cambiar de idioma
         * @param {String} key string que determina el idioma
         */
        $scope.changeLanguage = function (key) {
            $translate.use(key);
        };

        if (AuthFactory.isAuthenticated()) {
            $scope.loggedIn = true;
            $scope.username = AuthFactory.getUsername();
        }
        $scope.loginData = $localStorage.getObject('userinfo', '{}');

        /**
         * @ngdoc method
         * @name doLogin
         * @methodOf testManagerApp.controller:LoginController
         * @scope
         * @description
         * Función que realiza el logueo de un usuario en la aplicación
         */
        $scope.doLogin = function () {
            if ($scope.rememberMe)
                $localStorage.storeObject('userinfo', $scope.loginData);
            AuthFactory.login($scope.loginData);
        };
        /**
         * Función que comprueba si el acceso es satisfactorio
         */
        $rootScope.$on('login:Successful', function () {
            $scope.loggedIn = AuthFactory.isAuthenticated();
            $scope.username = AuthFactory.getUsername();
            $state.go('app');
        });
        /**
         * Función que comprueba si el acceso es satisfactorio
         */
        $rootScope.$on('registration:Successful', function () {
            $scope.loggedIn = AuthFactory.isAuthenticated();
            $scope.username = AuthFactory.getUsername();
        });

        $scope.stateis = function (curstate) {
            return $state.is(curstate);
        };
        /**
         * @ngdoc method
         * @name openRegister
         * @methodOf testManagerApp.controller:LoginController
         * @scope
         * @description
         * Función que crea un dialógo para realizar el registro
         */
        $scope.openRegister = function () {
            ngDialog.open({
                template: 'views/register.html',
                scope: $scope,
                className: 'ngdialog-theme-default',
                controller: "RegisterController"
            });
        };

    }])

    /**
     * @ngdoc controller
     * @name testManagerApp.controller:RegisterController
     * @description
     * Controlador que gestiona las operaciones de la vista register
     * Permite registrar un usuario en la aplicación
     */
    .controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {

        $scope.register = {};
        $scope.loginData = {};
        /**
         * @ngdoc method
         * @name doRegister
         * @methodOf testManagerApp.controller:RegisterController
         * @scope
         * @description
         * Función que realiza el registro de un usuario
         */
        $scope.doRegister = function () {
            AuthFactory.register($scope.registration);
            ngDialog.close();

        };
    }]);