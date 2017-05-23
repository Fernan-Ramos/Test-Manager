'use strict';
angular.module('testManagerApp')

    .controller('MenuController', ['$scope', '$mdDialog', 'menuFactory', 'exportFactory', function ($scope, $mdDialog, menuFactory, exportFactory) {

        $scope.showMenu = false;
        $scope.message;
        $scope.cuestionarios = menuFactory.query(
            function (response) {
                $scope.cuestionarios = response[0].cuestionarios;
                $scope.showMenu = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            });

        //Función que exporta un cuestionario a fichero en formato json
        $scope.exportCuest = function (cuest, filename) {
            exportFactory.exportTest(cuest, filename);
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

    .controller('TestController', ['$scope', '$filter', '$stateParams', '$mdDialog', 'menuFactory', function ($scope, $filter, $stateParams, $mdDialog, menuFactory) {
        $scope.form = {};
        $scope.showCuestionario = false;
        $scope.message;

        //Se obtiene el cuestionario 
        $scope.cuestionario =
            menuFactory.get({
                id: $stateParams.id
            })
                .$promise.then(
                function (response) {
                    $scope.showCuestionario = true;
                    $scope.cuestionario = response.cuestionarios[0];
                    //Se crea un objeto que contendra la respuestas
                    $scope.answer = {};
                    //Se crea un array dentro del objeto respuesta que contendrá la respuesta a cada pregunta
                    $scope.answer.questions = [];
                    //Se añade un objeto al array $scope.answer.questions donde se guarda las respuestas correctas y el texto de la pregunta por cada pregunta del cuestionario 
                    for (var i = 0; i < $scope.cuestionario.questions.length; i++) {
                        var obj = {};
                        obj.rcorrect = $scope.cuestionario.questions[i].rcorrect;
                        obj.pregunta = $scope.cuestionario.questions[i].pregunta;
                        $scope.answer.questions.push(obj)
                    }
                    $scope.selected = [];
                    //Por cada pregunta del cuestionaro se guarda un array de respuestas
                    for (var j = 0; j < $scope.cuestionario.questions.length; j++) {
                        $scope.selected.push([]);
                    }
                    //Función que añade o elimina una respuesta al array de respuestas
                    $scope.toggle = function (item, list) {
                        var idx = list.indexOf(item);
                        if (idx > -1) {
                            list.splice(idx, 1);
                        } else {
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

        //Función que calcula la calificación para preguntas de tipo multiple
        function calmultiple(j, respuestas, type) {
            var correct = 0;
            var incorrect = 0;
            for (var z = 0; z < respuestas.length; z++) {
                if (($scope.answer.questions[j].rcorrect.includes(respuestas[z]) && $scope.answer.questions[j].r.includes(respuestas[z])) || (!$scope.answer.questions[j].rcorrect.includes(respuestas[z]) && !$scope.answer.questions[j].r.includes(respuestas[z])))
                    correct++;
                else
                    incorrect++;
            }
            if (type == "pos")
                $scope.answer.questions[j].estado = correct / respuestas.length;

            if (type == "neg")
                $scope.answer.questions[j].estado = (correct - incorrect) / respuestas.length;

            calEstado($scope.answer.questions[j].estado);
        }

        function calEstado(estado) {
            if (estado < 0) {
                $scope.negativas = $scope.negativas + estado;
                $scope.incorrectas++;
            }
            else if (estado == 0) {
                $scope.incorrectas++;
            } else if (estado < 1 && estado > 0) {
                $scope.parciales = $scope.parciales + estado;
                $scope.parcial++;
            } else if (estado == 1) {
                $scope.correctas++;
            }

        }
        //Se obtiene las respuestas guardadas
        $scope.submitAnswer = function () {
            //Se guarda la fecha en la que se realiza el cuestionario
            $scope.answer.date = $filter('date')(new Date(), 'y/M/d');
            //Si la pregunta es de tipo múltiple se guarda el array de respuestas contestadas en cada pregunta.
            for (var i = 0; i < $scope.selected.length; i++) {
                if ($scope.cuestionario.questions[i].tipo == "multiple")
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
                if ($scope.cuestionario.questions[j].tipo == "unica" && $scope.answer.questions[j].rcorrect == $scope.answer.questions[j].r) {
                    $scope.correctas++;
                    //Determina que la respuesta es correcta
                    $scope.answer.questions[j].estado = 1;
                }
                //Si la pregunta es de tipo múltiple
                else if ($scope.cuestionario.questions[j].tipo == "multiple") {
                    respuestas.push($scope.cuestionario.questions[j].r1, $scope.cuestionario.questions[j].r2, $scope.cuestionario.questions[j].r3, $scope.cuestionario.questions[j].r4);
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
            $scope.answer.cal = (($scope.answer.correctas + $scope.parciales + $scope.negativas) / $scope.answer.questions.length) * 100;

            $scope.cuestionario.tests.push($scope.answer);
            //Se guarda la respuesta al cuestionario en el array de respuestas a cuestionarios
            menuFactory.update({
                id: $stateParams.id
            }, $scope.cuestionario);

            $mdDialog.show({
                clickOutsideToClose: false,
                scope: $scope,
                preserveScope: true,
                template:

                '<md-dialog aria-label="Respuestas">' +
                '<md-toolbar>' +
                '<div class="md-toolbar-tools" >' +
                '<h2>{{cuestionario.title}}</h2>' +
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

            //Si el conjunto de respuestas tiene alguna respuesta a algún cuestionario , se obtiene el titulo  del cuestionario , el nº de respuestas correctas y la fecha en la que se hizo.
            //Se obtiene el titulo , la calificación y la fecha de cuestionario
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
                    data: [],
                }
            };
            //Filtra cada objeto estadisticas por titulo 
            var result = $scope.cuestionario.stats.filter(function (obj) {
                return obj.title == $scope.title;
            });

            //Si no está el cuestionario reflejado se guarda la fecha , el titulo y el resultado || Si si que esta reflejado solamente se guarda la fecha y el resultado
            if (result.length == 0) {
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


    .controller('CloudController', ['$scope', 'cloudFactory', 'menuFactory', function ($scope, cloudFactory, menuFactory) {
        $scope.showCloud = false;
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
         * Función que añade un cuestionario de la nube al menu
         * Se borra su identifador para evitar conflictos en la base de datos
         * @param {Object} test Cuestionario a añadir
         */
        $scope.addtoMenu = function (test) {
            var cuest = test;
            delete cuest._id;
            cuest.cuestCloud = false;
            menuFactory.save(cuest);
        }

    }])

    .controller('MakerController', ['$scope', '$mdDialog', 'menuFactory', 'AuthFactory', function ($scope, $mdDialog, menuFactory, AuthFactory) {
        $scope.form = {};
        $scope.showMaker = false;
        $scope.message;

        $scope.cuestionarios = menuFactory.query(
            function (response) {
                $scope.cuestionarios = response[0].cuestionarios;
                $scope.showMaker = true;
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
                return $scope.selectedQuest;
            }
        };

        $scope.getNumber = function (num) {
            return Array.apply(null, Array(num)).map(function (x, i) { return i; });
        };

        /**Función que redimensiona una imagen a un ancho y largo proporcionado */
        function imageToDataUri(img, width, height) {
            // create an off-screen canvas
            var canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d');
            // set its dimension to target size
            canvas.width = width;
            canvas.height = height;
            // draw source image into the off-screen canvas:
            ctx.drawImage(img, 0, 0, width, height);
            // encode image to data-uri with base64 version of compressed image
            return canvas.toDataURL();
        }

        $scope.cuest = {
            title: "",
            image: "img/libro.jpg",
            text: "",
            type: "",
            cuestCloud: "",
            author: "",
            questions: [{
                title: "",
                pregunta: "",
                image: "",
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


        $scope.submitTest = function () {

            for (var i = 0; i < $scope.cuest.questions.length; i++) {
                if (!$scope.cuest.questions[i].image) {
                    $scope.cuest.questions[i].image = "";
                } else {
                    var imga = document.createElement('img');
                    imga.src = $scope.cuest.questions[i].image;
                    var newDataUri = imageToDataUri(imga, 100, 100);
                    $scope.cuest.questions[i].image = newDataUri;
                }
                //Cada pregunta tiene como titulo el mismo titulo del cuestionario
                $scope.cuest.questions[i].title = $scope.cuest.title;
            }
            //El autor del cuestionario se obtiene del nombre de usuario
            $scope.cuest.author = AuthFactory.getUsername();
            //Se guarda el objeto cuestionario en el menu
            menuFactory.save($scope.cuest);
            //Resetea el formulario a  pristine
            $scope.form.makerForm.$setPristine();

            //Resetea el objeto JavaScript una vez que el cuestionario ha sido creado
            $scope.cuest = {
                title: "",
                image: "img/libro.jpg",
                text: "",
                type: "",
                cuestCloud: "",
                author: "",
                questions: [{
                    title: "",
                    pregunta: "",
                    image: "",
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
        //Función que importa un cuestionario desde un fichero en formato .json
        $scope.import = function () {

            $.getJSON($scope.fichero.fic, function (data) {
                //Se resetea las respuestas y las estadisticas 
                data.tests = []
                data.stats = []
                $scope.cuestionarios.push(data);
                //Se guarda el nuevo cuestionario en el array de cuestionarios
                menuFactory.save(data);
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

    .controller('StatsControllerDetails', ['$scope', '$filter', '$stateParams', '$mdDialog', 'menuFactory', function ($scope, $filter, $stateParams, $mdDialog, menuFactory) {
        $scope.showStatInd = false;
        $scope.message;
        $scope.cuestionario =
            menuFactory.get({
                id: $stateParams.id
            })
                .$promise.then(
                function (response) {
                    $scope.cuestionario = response.cuestionarios[0];
                    $scope.showStatInd = true;
                    //Dialogo que aparece cuando no hay cuestionarios completados
                    if ($scope.cuestionario.stats.length == 0) {
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
            }
        };

    }])
    .controller('StatsController', ['$scope', '$stateParams', '$translate', '$mdDialog', '$filter', 'menuFactory', function ($scope, $stateParams, $translate, $mdDialog, $filter, menuFactory) {
        $scope.showStat = false;
        $scope.message;
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

        //Dialogo que aparece cuando no se ha realizado un cuestionario pasado por parámetro
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
        $scope.datasetOverride2 = [{
            yAxisID: 'y-axis-1'
        }, {
            yAxisID: 'y-axis-2'
        }];
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
            }

        };

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
    }])

    .controller('HeaderController', ['$scope', '$translate', '$state', '$rootScope', 'ngDialog', 'AuthFactory', function ($scope, $translate, $state, $rootScope, ngDialog, AuthFactory) {

        $scope.loggedIn = false;
        $scope.username = '';
        $scope.changeLanguage = function (key) {
            $translate.use(key);
        };
        if (AuthFactory.isAuthenticated()) {
            $scope.loggedIn = true;
            $scope.username = AuthFactory.getUsername();
        }

        $scope.logOut = function () {
            AuthFactory.logout();
            $scope.loggedIn = false;
            $scope.username = '';
            $state.go('login');
        };

        $rootScope.$on('login:Successful', function () {
            $scope.loggedIn = AuthFactory.isAuthenticated();
            $scope.username = AuthFactory.getUsername();
        });

        $rootScope.$on('registration:Successful', function () {
            $scope.loggedIn = AuthFactory.isAuthenticated();
            $scope.username = AuthFactory.getUsername();
        });

        $scope.stateis = function (curstate) {
            return $state.is(curstate);
        };

    }])

    .controller('LoginController', ['$window', '$state', '$scope', '$translate', 'ngDialog', '$rootScope', '$localStorage', 'AuthFactory', function ($window, $state, $scope, $translate, ngDialog, $rootScope, $localStorage, AuthFactory) {

        //Permite el scroll a la seccion de caracteristicas
        $(document).ready(function () {
            $("#click").click(function () {
                $('html, body').animate({
                    scrollTop: $("#features").offset().top
                }, 2000);
            });
        });

        //Se detecta el lenguaje del navegador
        var language = $window.navigator.language || $window.navigator.userLanguage;
        language = language.split("-")[0];

        //Se traduce al lenguaje predefinido en el navegador
        if (language == 'es' || language == 'en')
            $translate.use(language);

        $scope.loggedIn = false;
        $scope.username = '';
        $scope.changeLanguage = function (key) {
            $translate.use(key);
        };

        if (AuthFactory.isAuthenticated()) {
            $scope.loggedIn = true;
            $scope.username = AuthFactory.getUsername();
        }
        $scope.loginData = $localStorage.getObject('userinfo', '{}');

        $scope.doLogin = function () {
            if ($scope.rememberMe)
                $localStorage.storeObject('userinfo', $scope.loginData);
            AuthFactory.login($scope.loginData);
        };

        $rootScope.$on('login:Successful', function () {
            $scope.loggedIn = AuthFactory.isAuthenticated();
            $scope.username = AuthFactory.getUsername();
            $state.go('app');
        });

        $rootScope.$on('registration:Successful', function () {
            $scope.loggedIn = AuthFactory.isAuthenticated();
            $scope.username = AuthFactory.getUsername();
        });

        $scope.stateis = function (curstate) {
            return $state.is(curstate);
        };

        $scope.openRegister = function () {
            ngDialog.open({
                template: 'views/register.html',
                scope: $scope,
                className: 'ngdialog-theme-default',
                controller: "RegisterController"
            });
        };

    }])

    .controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {

        $scope.register = {};
        $scope.loginData = {};

        $scope.doRegister = function () {

            AuthFactory.register($scope.registration);

            ngDialog.close();

        };
    }]);