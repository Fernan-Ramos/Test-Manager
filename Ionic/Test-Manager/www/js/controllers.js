/**
 * @author Fernán Ramos Saiz <frs0012@alu.ubu.es>
 * @version 1.0
 * @description Fichero que almacena los controlladores utilizados en la aplicación
 */
angular.module('testManager.controllers', [])

  /**
   * @ngdoc controller 
   * @name testManagerApp.controller:AppCtrl
   * @description
   * Controlador que gestiona la operaciones de la vista sidebar
   * Se realizan las operaciones:
   *  Transicciones entre vistas
   *  Sign Out de usuarios
   */
  .controller('AppCtrl', function ($scope, $filter, $rootScope, $ionicHistory, $state, AuthFactory) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});


    /**
     * @ngdoc method
     * @name myGoBack
     * @methodOf testManagerApp.controller:AppCtrl
     * @scope
     * @description
     * Función que permite la transicción entre vistas
     */
    $scope.myGoBack = function () {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      var vista = $filter('translate')('STAT');
      //Si la vista es Estadisticas se vueleve a la vista menu
      if ($ionicHistory.currentTitle() == vista) {
        $state.go('app.menu');
      } else
        $ionicHistory.goBack();
    };


    /**
     * @ngdoc method
     * @name logOut
     * @methodOf testManagerApp.controller:AppCtrl
     * @scope
     * @description
     * Función que el realiza el sign out de usuarios
     */
    $scope.logOut = function () {
      AuthFactory.logout();
      $scope.loggedIn = false;
      $scope.username = '';
      $state.go('login');
    };

  })

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
  .controller('MenuController', ['$scope', '$mdDialog', 'menuFactory', 'baseURL', function ($scope, $mdDialog, menuFactory, baseURL) {

    $scope.$on("$ionicView.enter", function () {
      $scope.baseURL = baseURL;

      /**
       * Se obtiene los cuestionarios de la base de datos
       */
      $scope.cuestionarios = menuFactory.query(
        function (response) {
          $scope.cuestionarios = response[0].cuestionarios;

        },
        function (response) {
          $scope.message = "Error: " + response.status + " " + response.statusText;
        });


      /**
       * @ngdoc method
       * @name removeCuest
       * @methodOf testManagerApp.controller:MenuController
       * @scope
       * @description
       * Función que permite borrar un cuestionario
       * @param {Object} cuest  cuestionario a borrar
       */
      $scope.removeCuest = function (cuest) {
        $mdDialog.show({
          clickOutsideToClose: true,
          scope: $scope,
          preserveScope: true,
          template: '<md-dialog aria-label="List dialog">' +
            '  <md-dialog-content>' +
            '<md-content class="md-padding">' +
            ' <h5 class="md-title">{{\'REMOVEQUESTION\'| translate }}</h5>' +
            '</md-content>      ' +
            '  </md-dialog-content>' +
            '  <md-dialog-actions>' +
            '    <md-button  translate="REMOVEQUIZ" href="#/app/menu" ng-click="remove()" class="md-primary">' +
            '      Eliminar' +
            '    </md-button>' +
            '    <md-button  translate="CANCELREMOVE" ng-click="closeDialog()" class="md-primary">' +
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
    });

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
  .controller('TestController', ['$scope', '$filter', '$stateParams', 'baseURL', '$mdDialog', '$ionicSlideBoxDelegate', 'menuFactory', function ($scope, $filter, $stateParams, baseURL, $mdDialog, $ionicSlideBoxDelegate, menuFactory) {
    $scope.baseURL = baseURL;
    /**
     * @ngdoc method
     * @name updateSlider
     * @methodOf testManagerApp.controller:TestController
     * @scope
     * @description
     * Función que permite la transicción entre las preguntas recogidas en un slider
     */
    $scope.updateSlider = function () {
      $ionicSlideBoxDelegate.update();
    }
    $scope.form = {};

    /**
     * Se obtiene el cuestionario por su id de la base de datos
     */
    $scope.cuestionario =
      menuFactory.get({
        id: $stateParams.id
      })
      .$promise.then(
        function (response) {

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
      if (type == "pos")
        $scope.answer.questions[j].estado = correct / respuestas.length;

      if (type == "neg")
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
      } else if (estado == 0) {
        $scope.incorrectas++;
      } else if (estado < 1 && estado > 0) {
        $scope.parciales = $scope.parciales + estado;
        $scope.parcial++;
      } else if (estado == 1) {
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
      //Diálogo que muestra los resultados del cuestionario realizado
      $mdDialog.show({
        clickOutsideToClose: false,
        scope: $scope,
        preserveScope: true,
        template: '<md-dialog aria-label="Respuestas">' +
          '<md-toolbar class="nav-teal">' +
          '<div class="md-toolbar-tools"  >' +
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
          '</md-content>' +
          '</md-tab>' +
          '<md-tab label="{{\'SUMMARYTAB\' | translate}}">' +
          ' <md-content class="md-padding" ng-repeat="preg in cuestionario.tests[cuestionario.tests.length-1].questions  track by $index">' +
          '<div ng-if="preg.estado==1" class="bs-callout bs-callout-success">' +
          '<h4><em>{{\'QUESTION\'| translate}} {{$index+1}} : {{preg.pregunta}}</em></h4>' +
          '<p translate>{{\'CORRECT\'}} </p> <strong class="text-success">{{preg.rcorrect}}</strong>' +
          '</div>' +
          '<div ng-if="preg.estado<=0" class="bs-callout bs-callout-danger">' +
          '<h4><em>{{\'QUESTION\'| translate}} {{$index+1}} : {{preg.pregunta}}</em></h4>' +
          '<p translate>{{\'INCORRECT\'}} </p> <strong class="text-danger">{{preg.r}} </strong>' +
          ' </div>' +
          '<div ng-if="preg.estado>0 && preg.estado<1 " class="bs-callout bs-callout-warning">' +
          '<h4><em>{{\'QUESTION\'| translate}} {{$index+1}} : {{preg.pregunta}}</em></h4>' +
          '<p translate>{{\'PARCIAL1\'}}</p> <strong class="text-warning">{{preg.r}} </strong> <p translate>{{\'PARCIAL2\'}}</p>' +
          ' </div>' +
          '</md-content>' +
          '</md-tab>' +
          '</md-tabs>' +
          '  </md-dialog-content>' +
          '  <md-dialog-actions>' +
          '    <md-button href="#/app/menu" ng-click="closeDialog()" class="md-primary">' +
          '      Menu' +
          '    </md-button>' +
          '    <md-button  translate="STAT" href="#/app/stats/{{cuestionario._id}}" ng-click="closeDialog()" class="md-primary">' +
          '      Estadisticas' +
          '    </md-button>' +
          '  </md-dialog-actions>' +
          '</md-dialog>',

        controller: function DialogController($scope, $mdDialog) {
          //Atributos para el char
          $scope.labels = [$filter('translate')('LABELCORRECT'), $filter('translate')('LABELINCORRECT'), $filter('translate')('LABELPARCIAL')];
          $scope.data = [$scope.cuestionario.tests[$scope.cuestionario.tests.length - 1].correctas, $scope.cuestionario.tests[$scope.cuestionario.tests.length - 1].incorrectas, $scope.cuestionario.tests[$scope.cuestionario.tests.length - 1].parcial];
          $scope.colors = ['#D1E5B3', '#F08080', '#f7d3a0'];
          //Función que cierra el dialogo
          $scope.closeDialog = function () {
            $mdDialog.hide();
          }
        }
      });

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
  .controller('CloudController', ['$scope', '$mdDialog', '$filter', '$ionicPlatform', 'cloudFactory', 'menuFactory', function ($scope, $mdDialog, $filter, $ionicPlatform, cloudFactory, menuFactory) {
    $scope.$on("$ionicView.enter", function () {

      /**
       * Se obtiene los cuestionarios privados
       */
      $scope.menu = menuFactory.query(
        function (response) {
          $scope.menu = response[0].cuestionarios;
        },
        function (response) {
          $scope.message = "Error: " + response.status + " " + response.statusText;
        });


      /**
       * Se obtiene los cuestionarios públicos
       */
      $scope.cuestionarios = cloudFactory.query(
        function (response) {
          $scope.cuestionarios = response;
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

        var isFav = $scope.menu.some(function (element) {
          return element._id == test._id;
        });
        if (!isFav) {
          //Se borran las estadisticas
          test.stats = [];
          test.tests = [];
          //cuestCloud se declara como false de forma que no haya cuestionarios públicos repetidos
          test.cuestCloud = false;
          menuFactory.save(test);
          //Notificación
          var add = $filter('translate')('ADDEDFAVORITE');
          $ionicPlatform.ready(function () {
            $cordovaToast
              .show(add + test.title, 'long', 'center')
              .then(function () {
                // success
              }, function () {
                // error
              });
          });
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
              '    <md-button ui-sref="app.menu" ng-click="closeDialog()" class="md-primary">' +
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

    });
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
  .controller('MakerController', ['$scope', '$filter', 'menuFactory', 'AuthFactory', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function ($scope, $filter, menuFactory, AuthFactory, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {
    $scope.form = {};
    /**
     * Se obtiene los cuestionarios privados
     */
    $scope.cuestionarios = menuFactory.query(
      function (response) {
        $scope.cuestionarios = response[0].cuestionarios;
      },
      function (response) {
        $scope.message = "Error: " + response.status + " " + response.statusText;
      });

    $scope.number;

    $scope.max = function (n) {
      return parseInt(n, 10);
    }

    /**
     * @ngdoc method
     * @name getNumber
     * @methodOf testManagerApp.controller:MakerController
     * @scope
     * @description
     * Función que convierte un string en entero, compruba si es menor que 30 
     * y devuelve un array de longuitud igual que el string convertido
     * @param {String} num string a convertir 
     * @returns {Integer} array de longuitud num
     */
    $scope.getNumber = function (num) {
      if (num != null)
        num = parseInt(num, 10);
      if (num <= 30)
        return Array.apply(null, Array(num)).map(function (x, i) {
          return i;
        });
    };


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
      //Notificación que indica que el cuestionario ha sido creado
      var add = $filter('translate')('CREATEDQUIZ');
      $ionicPlatform.ready(function () {
        $cordovaToast
          .show(add + $scope.cuest.title, 'long', 'center')
          .then(function () {
            // success
          }, function () {
            // error
          });
      });
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
    $scope.$on("$ionicView.beforeEnter", function () {
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
            //Dialogo que aparece cuando no hay cuestionarios completados
            if ($scope.cuestionario.stats.length == 0) {
              $mdDialog.show({
                clickOutsideToClose: true,
                scope: $scope,
                preserveScope: true,
                template: '<md-dialog aria-label="List dialog">' +
                  '  <md-dialog-content>' +
                  '<md-content class="md-padding">' +
                  ' <h5 class="md-title" translate>{{\'STATSDIALOGTITLE\'}}</h5>' +
                  ' <p class="md-textContent" translate>{{\'STATDIALOGTEXT\'}}</p>' +
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

      /**
       * @ngdoc method
       * @name filter
       * @methodOf testManagerApp.controller:StatsControllerDetails
       * @scope
       * @description
       * Función que ordena los cuestionarios por titulo, por calificación o por fecha.
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
      //Atributos para chart
      $scope.options1 = {
        responsive: true,
        scaleBeginAtZero: false,
        barBeginAtOrigin: true
      };

    });
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
  .controller('StatsController', ['$scope', '$filter', '$stateParams', '$mdDialog', 'menuFactory', function ($scope, $filter, $stateParams, $mdDialog, menuFactory) {
    $scope.$on("$ionicView.enter", function () {
      /**
       * Se obtiene todos los cuestionarios 
       */
      $scope.cuestionario =
        menuFactory.query()
        .$promise.then(
          function (response) {
            $scope.cuestionario = response[0].cuestionarios;
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
              '    <md-button ng-click="closeDialog()" class="md-primary">' +
              '      OK' +
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
    });

  }])

  /**
   * @ngdoc controller
   * @name testManagerApp.controller:LoginController
   * @description
   * Controlador que gestiona las operaciones de la vista login, vista principal que aparece antes de acceder a la aplicación
   * Permite realizar el login y registro a un usuario en la aplicación
   */
  .controller('LoginController', ['$state', '$scope', '$rootScope', '$ionicModal', '$localStorage', 'AuthFactory', function ($state, $scope, $rootScope, $ionicModal, $localStorage, AuthFactory) {

    /** Login */

    $scope.loginData = $localStorage.getObject('userinfo', '{}');
    $scope.loggedIn = false;

    if (AuthFactory.isAuthenticated()) {
      $scope.loggedIn = true;
      $scope.username = AuthFactory.getUsername();
    }

    /**
     * @ngdoc method
     * @name doLogin
     * @methodOf testManagerApp.controller:LoginController
     * @scope
     * @description
     * Función que realiza el logueo de un usuario en la aplicación
     */
    $scope.doLogin = function () {
      $localStorage.storeObject('userinfo', $scope.loginData);
      AuthFactory.login($scope.loginData);
    };

    /**
     * Función que comprueba si el acceso es satisfactorio
     */
    $rootScope.$on('login:Successful', function () {
      $scope.loggedIn = AuthFactory.isAuthenticated();
      $scope.username = AuthFactory.getUsername();
      $state.go('app.menu');
    });

    /** Register */

    $scope.registration = {};
    //Función que crea un dialógo para realizar el registro
    $ionicModal.fromTemplateUrl('templates/register.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.registerform = modal;
    });

    /**
     * @ngdoc method
     * @name register
     * @methodOf testManagerApp.controller:LoginController
     * @scope
     * @description
     * Función que crea un dialógo para realizar el registro
     */
    $scope.register = function () {
      $scope.registerform.show();
    };

    /**
     * @ngdoc method
     * @name closeRegister
     * @methodOf testManagerApp.controller:LoginController
     * @scope
     * @description
     * Función que cierra el dialógo para realizar el registro
     */
    $scope.closeRegister = function () {
      $scope.registerform.hide();
    };
    /**
     * @ngdoc method
     * @name doRegister
     * @methodOf testManagerApp.controller:LoginController
     * @scope
     * @description
     * Función que realiza el registro de un usuario
     */
    $scope.doRegister = function () {
      $scope.loginData.username = $scope.registration.username;
      $scope.loginData.password = $scope.registration.password;

      AuthFactory.register($scope.registration);

      $scope.closeRegister();

    };
    /**
     * Función que comprueba si el registro es satisfactorio
     */
    $rootScope.$on('registration:Successful', function () {
      $scope.loggedIn = AuthFactory.isAuthenticated();
      $scope.username = AuthFactory.getUsername();
      $localStorage.storeObject('userinfo', $scope.loginData);
    });

  }]);
