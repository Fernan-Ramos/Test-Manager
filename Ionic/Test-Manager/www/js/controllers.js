angular.module('testManager.controllers', [])

  .controller('AppCtrl', function ($scope, $rootScope, $ionicModal, $timeout, $ionicHistory, $state, $localStorage, AuthFactory) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});


    //Función que pasa de una vista a la vista anterior
    $scope.myGoBack = function () {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      //Si la vista es Estadisticas Individuales se vueleve a la vista menu
      if ($ionicHistory.currentTitle() == "Estadisticas Ind")
        $state.go('app.menu');
      else
        $ionicHistory.goBack();
    };


    $scope.logOut = function () {
      AuthFactory.logout();
      $scope.loggedIn = false;
      $scope.username = '';
      $state.go('login');
    };

  })

  .controller('MenuController', ['$scope', 'menuFactory', 'favoriteFactory', 'baseURL', '$mdDialog', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function ($scope, menuFactory, favoriteFactory, baseURL, $mdDialog, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

    $scope.$on("$ionicView.enter", function (event, data) {
      $scope.baseURL = baseURL;
      $scope.showMenu = false;
      $scope.message = "Loading ...";
      $scope.cuestionarios = menuFactory.query(
        function (response) {
          $scope.cuestionarios = response[0].cuestionarios;
          $scope.showMenu = true;
        },
        function (response) {
          $scope.message = "Error: " + response.status + " " + response.statusText;
        });

      $scope.favoritos = favoriteFactory.query(
        function (response) {
          $scope.favoritos = response[0].favoritos;
        },
        function (response) {
          $scope.message = "Error: " + response.status + " " + response.statusText;
        });


      //Dialogo que muestra las opciones para cada cuestionario
      $scope.showOptions = function (test) {
        $mdDialog.show({
          clickOutsideToClose: true,
          scope: $scope,
          preserveScope: true,
          locals: {
            test: test
          },
          template: '<md-dialog aria-label="List dialog">' +
          '  <md-dialog-content>' +
          '<md-content class="md-padding">' +
          '<div class="list">' +
          '<a class="item item-icon-left"  href="#/app/stats/{{test._id}}" ng-click="closeDialog()">' +
          '<i class="icon ion-stats-bars"></i>' +
          'Estadisticas' +
          ' </a>' +
          '<a class="item item-icon-left" ng-click="addFavorite(test);closeDialog()" >' +
          '<i class="icon ion-heart"></i>' +
          'Añadir a Favoritos' +
          '</a>' +
          '<a class="item item-icon-left"  ng-click="removeCuest(test)">' +
          '<i class="icon ion-trash-a"></i>' +
          'Eliminar' +
          '</a>' +
          '</div>' +
          '</md-content>' +
          '</md-dialog-content>' +
          '</md-dialog>',
          controller: function DialogController($scope, $mdDialog, test) {
            $scope.test = test;
            $scope.closeDialog = function () {
              $mdDialog.hide();
            }
          }
        });

      };

      $scope.addFavorite = function (test) {
        test.tests = []
        test.stats = [];
        favoriteFactory.save(test);
        $ionicPlatform.ready(function () {
          $cordovaLocalNotification.schedule({
            id: 1,
            title: "Añadio Favorito",
            text: test.title
          }).then(function () {
            console.log('Añadido favorito ' + test.title);
          },
            function () {
              console.log('Failed to add Notification ');
            });

          $cordovaToast
            .show('Añadido favorito ' + test.title, 'long', 'center')
            .then(function (success) {
              // success
            }, function (error) {
              // error
            });
        });
      }

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
          '    <md-button href="#/app/menu" ng-click="remove()" class="md-primary">' +
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
              //Se comprueba si existe favorito de dicho cuestionario
              var isFav = $scope.favoritos.some(function (element) {
                return element._id == cuest._id;
              });
              //Se elimina el favorito del cuestionario a borrar si existe dicho favorito
              if (isFav) {
                favoriteFactory.remove(cuest);
              }

              menuFactory.remove(cuest);
            }

            $scope.closeDialog = function () {
              $mdDialog.hide();
            }
          }
        });

      };
    });

  }])

  .controller('TestController', ['$scope', '$filter', '$stateParams', 'baseURL', '$mdDialog', '$ionicSlideBoxDelegate', 'menuFactory', function ($scope, $filter, $stateParams, baseURL, $mdDialog, $ionicSlideBoxDelegate, menuFactory) {
    $scope.baseURL = baseURL;
    $scope.updateSlider = function () {
      $ionicSlideBoxDelegate.update();
    }
    $scope.form = {};
    $scope.showCuestionario = false;
    $scope.message = "Loading ...";
    //Se obtiene el cuestionario 
    $scope.cuestionario =
      menuFactory.get({ id: $stateParams.id })
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

    //Función que calcula la calificación para preguntas de tipo multiple
    function multiple(j, respuestas) {
      var correct = 0;
      for (var z = 0; z < respuestas.length; z++) {
        if (($scope.answer.questions[j].rcorrect.includes(respuestas[z]) && $scope.answer.questions[j].r.includes(respuestas[z])) || (!$scope.answer.questions[j].rcorrect.includes(respuestas[z]) && !$scope.answer.questions[j].r.includes(respuestas[z])))
          correct++;
      }
      $scope.answer.questions[j].estado = correct / respuestas.length;
      if ($scope.answer.questions[j].estado == 0) {
        $scope.incorrectas++;
      } else if ($scope.answer.questions[j].estado < 1 && $scope.answer.questions[j].estado > 0) {
        $scope.parciales = $scope.parciales + $scope.answer.questions[j].estado;
        $scope.parcial++;
      } else if ($scope.answer.questions[j].estado == 1) {
        $scope.correctas++;
      }

    }

    //Se obtiene las respuestas guardadas
    $scope.submitAnswer = function (ev) {
      //Se guarda la fecha en la que se realiza el cuestionario
      $scope.answer.date = $filter('date')(new Date(), 'shortDate');
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
      //Se recorre el array de preguntas 
      for (var j = 0; j < $scope.answer.questions.length; j++) {
        //Si la pregunta es de tipo unica y la respuesta dada corresponde con la respuesta correcta
        if ($scope.cuestionario.questions[j].tipo == "unica" && $scope.answer.questions[j].rcorrect == $scope.answer.questions[j].r) {
          $scope.correctas++;
          //Determina que la respuesta es correcta
          $scope.answer.questions[j].estado = 1;
        }
        //Si la pregunta es de tipo múltiple y la respuesta no es vacía se calcula la calificación parcial
        else if ($scope.cuestionario.questions[j].tipo == "multiple" && $scope.answer.questions[j].r.length != 0) {
          respuestas.push($scope.cuestionario.questions[j].r1, $scope.cuestionario.questions[j].r2, $scope.cuestionario.questions[j].r3, $scope.cuestionario.questions[j].r4);
          multiple(j, respuestas);
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
      $scope.answer.cal = (($scope.answer.correctas + $scope.parciales) / $scope.answer.questions.length) * 100;

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
        '<md-toolbar class="nav-teal">' +
        '<div class="md-toolbar-tools"  >' +
        '<h2 style="color:floralwhite">{{cuestionario.title}}</h2>' +
        '<span flex></span>' +
        '</div>' +
        ' </md-toolbar>' +
        '  <md-dialog-content>' +
        '<md-tabs md-dynamic-height md-border-bottom>' +
        '<md-tab label="resultados">' +
        '<md-content class="md-padding">' +
        '<h5 class="md-display-1" style="text-align:center"><em>{{cuestionario.tests[cuestionario.tests.length-1].cal | number:2}}%</em></h5>' +
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
        '<div ng-if="preg.estado>0 && preg.estado<1 " class="bs-callout bs-callout-warning">' +
        '<h4><em>Pregunta {{$index+1}} : {{preg.pregunta}}</em></h4>' +
        '<p>La respuesta <strong class="text-warning">{{preg.r}} </strong> es correcta parcialmente.' +
        ' </div>' +
        '</md-content>' +
        '</md-tab>' +
        '</md-tabs>' +
        '  </md-dialog-content>' +
        '  <md-dialog-actions>' +
        '    <md-button href="#/app/menu" ng-click="closeDialog()" class="md-primary">' +
        '      Menu' +
        '    </md-button>' +
        '    <md-button href="#/app/stats/{{cuestionario._id}}" ng-click="closeDialog()" class="md-primary">' +
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
        $scope.stat.stats.data = [[$scope.respuestas]];
        $scope.stat.stats.colors = [colors[Math.floor(Math.random() * colors.length)]];
        $scope.cuestionario.stats.push($scope.stat);
        menuFactory.update({ id: $stateParams.id }, $scope.cuestionario);
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

  .controller('MakerController', ['$scope', '$mdDialog', 'menuFactory', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function ($scope, $mdDialog, menuFactory, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {
    $scope.form = {};
    $scope.showMaker = false;
    $scope.message = "Loading ...";
    $scope.cuestionarios = menuFactory.query(
      function (response) {
        $scope.cuestionarios = response[0].cuestionarios;
        $scope.showMaker = true;
      },
      function (response) {
        $scope.message = "Error: " + response.status + " " + response.statusText;
      });

    $scope.quests = [];
    for (var i = 1; i <= 20; i++) {
      $scope.quests.push(i);
    }

    $scope.number;

    $scope.max = function (n) {
      return parseInt(n, 10);
    }

    $scope.getNumber = function (num) {
      if (num != null)
        num = parseInt(num, 10);
      if (Number.isInteger(num) && num <= 30)
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
        //Se establece un identificador por cada pregunta
        if (typeof $scope.cuest.questions[i].image === "undefined") {
          $scope.cuest.questions[i].image = "img/libro.jpg";
        }
        //Cada pregunta tiene como titulo el mismo titulo del cuestionario
        $scope.cuest.questions[i].title = $scope.cuest.title;
      }

      //Poner el cuestionaro creado en array de cuestionarios
      menuFactory.save($scope.cuest);
      //$scope.cuestionarios.push($scope.cuest);
      $ionicPlatform.ready(function () {
        $cordovaLocalNotification.schedule({
          id: 1,
          title: "Cuestionario creado",
          text: $scope.cuest.title
        }).then(function () {
          console.log('Cuestionario creado ' + $scope.cuest.title);
        },
          function () {
            console.log('Failed to add Notification ');
          });

        $cordovaToast
          .show('Cuestionario creado ' + $scope.cuest.title, 'long', 'center')
          .then(function (success) {
            // success
          }, function (error) {
            // error
          });
      });
      //Resetea el formulario a  pristine
      $scope.form.makerForm.$setPristine();

      //Resetea el objeto JavaScript una vez que el cuestionario ha sido creado
      $scope.cuest = {
        title: "",
        image: "img/libro.jpg",
        text: "",
        questions: [{
          title: "",
          pregunta: "",
          image: "img/libro.jpg",
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
    $scope.$on("$ionicView.beforeEnter", function (event, data) {
      $scope.showStatInd = false;
      $scope.message = "Loading ...";
      $scope.cuestionario =
        menuFactory.get({ id: $stateParams.id })
          .$promise.then(
          function (response) {
            $scope.cuestionario = response.cuestionarios[0];
            $scope.showStatInd = true;
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
                '    <md-button href="#/app/menu" ng-click="closeDialog()" class="md-primary">' +
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
      }];
      $scope.options1 = {
        scales: {
          yAxes: [{
            ticks: {
              max: 100,
              min: 0,
              stepSize: 20
            },
            id: 'y-axis-1',
            type: 'linear',
            display: true,
            position: 'left'
          },

          ]
        }
      };
    });
  }])
  .controller('StatsController', ['$scope', '$stateParams', '$mdDialog', 'menuFactory', function ($scope, $stateParams, $mdDialog, menuFactory) {
    $scope.$on("$ionicView.enter", function (event, data) {
      $scope.showStat = false;
      $scope.message = "Loading ...";
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

      $scope.toggleTest = function (test) {
        if ($scope.isTestShown(test)) {
          $scope.shownTest = null;
        } else {
          $scope.shownTest = test;
        }
      };
      $scope.isTestShown = function (test) {
        return $scope.shownTest === test;
      };

      //Dialogo que aparece cuando no se ha realizado un cuestionario pasado por parámetro
      $scope.dialogo = function (cuest) {
        if (cuest.length == 0) {
          $mdDialog.show({
            clickOutsideToClose: false,
            scope: $scope,
            preserveScope: true,
            template: '<md-dialog aria-label="List dialog">' +
            '  <md-dialog-content>' +
            '<md-content class="md-padding">' +
            ' <h5 class="md-title">No hay estadisticas que mostrar</h5>' +
            ' <p class="md-textContent">Todavía no has realizado este cuestionario</p>' +
            '</md-content>      ' +
            '  </md-dialog-content>' +
            '  <md-dialog-actions>' +
            '    <md-button href="#/app/menu" ng-click="closeDialog()" class="md-primary">' +
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
      }];
      $scope.options2 = {
        scales: {
          yAxes: [{
            ticks: {
              max: 100,
              min: 0,
              stepSize: 20
            },
            id: 'y-axis-1',
            type: 'linear',
            display: true,
            position: 'left'
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
    });

  }])

  .controller('FavoritesController', ['$scope', 'menuFactory', 'favoriteFactory', 'baseURL', '$mdDialog', function ($scope, menuFactory, favoriteFactory, baseURL, $mdDialog) {
    $scope.$on("$ionicView.enter", function (event, data) {
      $scope.baseURL = baseURL;
      $scope.favoritos = favoriteFactory.query(
        function (response) {
          $scope.favoritos = response[0].favoritos;
          $scope.showMenu = true;
        },
        function (response) {
          $scope.message = "Error: " + response.status + " " + response.statusText;
        });


      //Dialogo que muestra las opciones para cada cuestionario
      $scope.showOptions = function (test) {
        $mdDialog.show({
          clickOutsideToClose: true,
          scope: $scope,
          preserveScope: true,
          locals: {
            test: test
          },
          template: '<md-dialog aria-label="List dialog">' +
          '  <md-dialog-content>' +
          '<md-content class="md-padding">' +
          '<div class="list">' +
          '<a class="item item-icon-left"  href="#/app/stats/{{test._id}}" ng-click="closeDialog()">' +
          '<i class="icon ion-stats-bars"></i>' +
          'Estadisticas' +
          ' </a>' +
          '<a class="item item-icon-left"  ng-click="removeFavorite(test);closeDialog()">' +
          '<i class="icon ion-trash-a"></i>' +
          'Eliminar' +
          '</a>' +
          '</div>' +
          '</md-content>' +
          '</md-dialog-content>' +
          '</md-dialog>',
          controller: function DialogController($scope, $mdDialog, test) {
            $scope.test = test;
            $scope.closeDialog = function () {
              $mdDialog.hide();
            }
          }
        });
      }

      $scope.removeFavorite = function (test) {
        var index = $scope.favoritos.indexOf(test);
        if (index > -1) {
          $scope.favoritos.splice(index, 1);
        }
        favoriteFactory.remove(test);
      }
    });

  }])

  .controller('LoginController', ['$state', '$scope', '$rootScope', '$ionicModal', '$localStorage', 'AuthFactory', function ($state, $scope, $rootScope, $ionicModal, $localStorage, AuthFactory) {


    /** Login */

    $scope.loginData = $localStorage.getObject('userinfo', '{}');

    $scope.loggedIn = false;

    if (AuthFactory.isAuthenticated()) {
      $scope.loggedIn = true;
      $scope.username = AuthFactory.getUsername();
    }

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      console.log('Doing login', $scope.loginData);
      $localStorage.storeObject('userinfo', $scope.loginData);

      AuthFactory.login($scope.loginData);
    };


    $rootScope.$on('login:Successful', function () {
      $scope.loggedIn = AuthFactory.isAuthenticated();
      $scope.username = AuthFactory.getUsername();
      $state.go('app.menu');
    });

    /** Register */

    $scope.registration = {};

    $ionicModal.fromTemplateUrl('templates/register.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.registerform = modal;
    });

    // Open the login modal
    $scope.register = function () {
      $scope.registerform.show();
    };

    // Triggered in the login modal to close it
    $scope.closeRegister = function () {
      $scope.registerform.hide();
    };
    $scope.doRegister = function () {
      console.log('Doing registration', $scope.registration);
      $scope.loginData.username = $scope.registration.username;
      $scope.loginData.password = $scope.registration.password;

      AuthFactory.register($scope.registration);

      $scope.closeRegister();

    };

    $rootScope.$on('registration:Successful', function () {
      $scope.loggedIn = AuthFactory.isAuthenticated();
      $scope.username = AuthFactory.getUsername();
      $localStorage.storeObject('userinfo', $scope.loginData);
    });

  }]);