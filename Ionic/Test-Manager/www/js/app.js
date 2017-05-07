// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('testManager', ['ionic', 'ngCordova', 'testManager.controllers', 'testManager.services', 'pascalprecht.translate'])

  .run(function ($ionicPlatform, $cordovaSplashscreen, $timeout) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      $timeout(function () {
        $cordovaSplashscreen.hide();
      }, 1000);

    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $translateProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/sidebar.html',
        controller: 'AppCtrl'
      })

      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginController'
      })

      .state('app.menu', {
        url: '/menu',
        views: {
          'mainContent': {
            templateUrl: 'templates/menu.html',
            controller: 'MenuController'
          }
        }
      })

      .state('app.testDetails', {
        url: '/menu/:id',
        views: {
          'mainContent': {
            templateUrl: 'templates/testDetails.html',
            controller: 'TestController'
          }
        }
      })

      .state('app.maker', {
        url: '/maker',
        views: {
          'mainContent': {
            templateUrl: 'templates/maker.html',
            controller: 'MakerController'
          }
        }
      })

      .state('app.statDetails', {
        url: '/stats/:id',
        views: {
          'mainContent': {
            templateUrl: 'templates/statDetails.html',
            controller: 'StatsControllerDetails'
          }
        }
      })


      .state('app.stats', {
        url: '/stats',
        views: {
          'mainContent': {
            templateUrl: 'templates/stats.html',
            controller: 'StatsController'
          }
        }
      })

      .state('app.favorites', {
        url: '/favorites',
        views: {
          'mainContent': {
            templateUrl: 'templates/favorites.html',
            controller: 'FavoritesController'
          }
        }
      });


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');


    /**IDIOMAS */
    var translationsES = {
      /**LOGIN */

      REGISTER: 'Registrate',

      USER: 'Usuario',
      PASS: 'Contraseña',
      LOG: 'Entrar',
      FUN: 'Diviértete Aprendiendo',
      JOIN: 'Únete a Test Manager',
      STATS: 'Estadisticas detalladas',
      STATS1: 'Compueba tu evolución a través de la sección de Estadisticas!',
      LEARN: 'Aprendizaje',
      LEARN1: 'Aumenta tu aprendizaje gracias a la retroalimentación!',
      MAKE: 'Crea tus propios cuestionarios',
      MAKE1: 'Puedes crear cuestionarios de una forma muy sencilla!',
      EXPORT: 'Exporta cuestionarios',
      EXPORT1: 'Guarda tus cuestionarios para poder compartirlos con quien quieras!',
      NOLOGIN: 'Login Incorrecto',
      /**REGISTER */
      REGISTTITLE: 'Registro',
      NAME: 'Nombre',
      SUBNAME: 'Apellidos',
      NOREGISTER: 'Registro Incorrecto',
      /**HEADER */
      MENU: 'Menu',
      QUIZS: 'Mis Cuestionarios',
      QUIZ: 'Cuestionario',
      MAKER: 'Crear Cuestionario',
      STAT: 'Estadisticas',
      FAV: 'Mis Favoritos',
      EXIT: 'Salir',
      SERVICE: 'Servicios',
      /**MAKER */
      ADDEDQUIZ: 'Cuestionario creado',
      MAKERTAB1: 'Crear',
      MAKERTITLE: 'Crea tu propio cuestionario',
      QUIZTITLE: 'Título',
      QUIZTITLEPLACE: 'Escribe un Título',
      NOQUIZTITLE: 'El titulo es necesario',
      QUIZDESCR: 'Descripción',
      QUIZDESCRPLACE: 'Describelo',
      NQUESTIONS: 'Nº de preguntas',
      QUESTIONS: 'Preguntas',
      QUESTIONSSELECT1: 'Escribe un número',
      MAXQUESTPLACE: 'Nº de preguntas (max 30)',
      MAXQUEST: 'Máximo 30 preguntas',
      QUESTION: 'Pregunta',
      QUESTIONPLACE: 'Escribe la pregunta',
      NOQUESTION: 'La pregunta es necesaria',
      IMAGE: 'Selecciona una imagen',
      ANSWER: 'Respuesta',
      NOANSWER: 'La respuesta es necesaria',
      ANSWERPLACE: 'Escribe la respuesta',
      TYPE: 'Tipo de pregunta',
      UNIC: 'Respuesta única',
      MULTIPLE: 'Respuesta múltiple',
      QUESTIONCORRECT: 'Respuesta Correcta',
      CORRECTSELECT: 'Correctas',
      CREATE: 'Crear ',
      MAKERTAB2: 'Importar',
      IMPORTITLE: 'Importa un cuestionario',
      IMPORTALERT: 'el archivo debe estar en formato .json',
      IMPORTBUTTON: 'Importar',
      FILENOTVALID: 'Archivo no válido',
      FILEREC: 'Debes seleccionar un archivo en formato json',
      CLOSE: 'Cerrar',
      QUIZCREATED: 'Cuestionario creado',
      /**STATS */
      SORT: 'Ordenar por :',
      CHARTTITLE1: 'Gráficas de estadisticas',
      CHARTITLE2: 'Gráfica de estadisticas',
      CHARTSTATS: 'Estadisticas',
      STATSTITLE: 'Cuestionarios realizados',
      STATSDIALOGTITLE: 'No hay estadisticas que mostrar',
      STATDIALOGTEXT: 'Todavía no has realizado ningún cuestionario',
      STATSDIALOGTEXT: 'Todavía no has realizado este cuestionario',
      /**MENU */
      ADDFAVORITE: 'Añadir a mis favoritos',
      ADDEDFAVORITE: 'Añadido favorito',
      FAVORITEBUTTON: 'Mis Favoritos',
      EXISTFAVORITE: 'Ya existe el favorito',
      REMOVEQUESTION: 'Estas seguro de eliminar este cuestionario?',
      REMOVEQUIZ: 'Eliminar',
      CANCELREMOVE: 'Cancelar',
      /**TEST DETAILS */
      SELECTQUESTION: 'Selecciona una respuesta',
      SELECTQUESTIONS: 'Selecciona una o varias respuestas',
      READY: 'Listo !',
      RESULTTAB: 'Resultados',
      SUMMARYTAB: 'Sumario',
      CORRECT: 'Muy bien! La respuesta correcta es :',
      PARCIAL1: 'La respuesta',
      PARCIAL2: 'es correcta parcialmente.',
      INCORRECT: 'Vaya! La respuesta correcta no es : ',
      DATE: '{{date|date:\'d/M/yy H:mm\'}}',
      BUTTON_LANG_ES: 'Español',
      BUTTON_LANG_EN: 'Inglés'
    };

    var translationsEN = {
      /**LOGIN */

      REGISTER: 'Sign up',

      USER: 'User',
      PASS: 'Password',
      LOG: 'Sign in',
      FUN: 'Have fun learning',
      JOIN: 'Join Test Manager',
      STATS: 'Detailed Stats',
      STATS1: 'Compile your evolution through the Statistics section!',
      LEARN: 'Learning',
      LEARN1: 'Increase your learning thanks to feedback!',
      MAKE: 'Create your own quizzes',
      MAKE1: 'You can create quizs in a very simple way!',
      EXPORT: 'Export quizs',
      EXPORT1: 'Save your quizs so you can share them with anyone!',
      NOLOGIN: 'Login Unsuccessful',
      /**REGISTER */
      REGISTTITLE: 'Sign up',
      NAME: 'Name',
      SUBNAME: 'Last Name',
      NOREGISTER: 'Registro Incorrecto',
      /**HEADER */
      MENU: 'Menu',
      QUIZS: 'Quizs',
      QUIZ: 'Quiz',
      MAKER: 'Quiz Maker',
      STAT: 'Statistics',
      FAV: 'My Favorites',
      EXIT: 'Log out',
      SERVICE: 'Services',
      /**MAKER */
      ADDEDQUIZ: 'Quiz created',
      MAKERTAB1: 'Create',
      MAKERTITLE: 'Create your own quiz',
      QUIZTITLE: 'Title',
      QUIZTITLEPLACE: 'Write a title',
      NOQUIZTITLE: 'The title is necessary',
      QUIZDESCR: 'Description',
      QUIZDESCRPLACE: 'Describe it',
      NQUESTIONS: 'No. of questions',
      QUESTIONS: 'Questions',
      QUESTIONSSELECT1: 'Write a number',
      MAXQUESTPLACE: 'Nº de questions (max 30)',
      MAXQUEST: '30 questions max',
      QUESTION: 'Question ',
      QUESTIONPLACE: 'Write the question',
      NOQUESTION: 'The question is necessary',
      IMAGE: 'Select an image',
      ANSWER: 'Answer',
      NOANSWER: 'The answer is necessary',
      ANSWERPLACE: 'Write the answer',
      TYPE: 'Type of question',
      UNIC: 'Single answer',
      MULTIPLE: 'Multiple answer',
      QUESTIONCORRECT: 'Correct Answer',
      CORRECTSELECT: 'Corrects',
      CREATE: 'create',
      MAKERTAB2: 'Import',
      IMPORTITLE: 'Import a quiz',
      IMPORTALERT: 'The file must be in JSON format',
      IMPORTBUTTON: 'Import',
      FILENOTVALID: 'Invalid file',
      FILEREC: 'You must select a file in json format',
      CLOSE: 'Close',
      QUIZCREATED: 'Cuestionario creado',
      /**STATS */
      STATSTITLE: 'Completed quizs',
      SORT: 'Sort by :',
      CHARTTITLE1: 'Graphs of statistics',
      CHARTITLE2: 'Graph of statistics',
      CHARTSTATS: 'Statistics',
      STATSDIALOGTITLE: 'There are no statistics to display',
      STATDIALOGTEXT: 'You have not yet completed any quiz',
      STATSDIALOGTEXT: 'You have not yet completed this quiz',
      /**MENU */
      ADDFAVORITE: 'Add to my favorites',
      ADDEDFAVORITE: 'Added favorite',
      FAVORITEBUTTON: 'My favorites',
      EXISTFAVORITE: 'Favorite already exists',
      REMOVEQUESTION: 'Are you sure to delete this quiz?',
      REMOVEQUIZ: 'Delete',
      CANCELREMOVE: 'Cancel',
      /**TEST DETAILS */
      SELECTQUESTION: 'Select an answer',
      SELECTQUESTIONS: 'Select one or more answers',
      READY: 'Ready !',
      RESULTTAB: 'Results',
      SUMMARYTAB: 'Summary',
      CORRECT: 'Very good! The correct answer is :',
      PARCIAL1: 'The answer',
      PARCIAL2: 'is partially correct.',
      INCORRECT: 'Wow! The correct answer is not :',
      DATE: '{{date|date:\'medium\'}}',
      BUTTON_LANG_ES: 'Spanish',
      BUTTON_LANG_EN: 'English'
    };
    $translateProvider.translations('es', translationsES);
    $translateProvider.translations('en', translationsEN);
    $translateProvider.preferredLanguage('es');
    $translateProvider.fallbackLanguage('es');
  })

  .run(function ($ionicPlatform, $translate) {
    $ionicPlatform.ready(function () {
      if (typeof navigator.globalization !== "undefined") {
        navigator.globalization.getPreferredLanguage(function (language) {
          $translate.use((language.value).split("-")[0]).then(function (data) {
            console.log("SUCCESS -> " + data);
          }, function (error) {
            console.log("ERROR -> " + error);
          });
        }, null);
      }
    });
  });