'use strict';
angular.module('testManagerApp', ['ngMaterial', 'ui.router', 'chart.js', 'ngResource', 'ngDialog', 'pascalprecht.translate'])
    .config(function ($stateProvider, $urlRouterProvider, $translateProvider) {
        $stateProvider

            //ruta para login
            .state('app', {
                url: '/',
                views: {
                    'header': {
                        templateUrl: 'views/header.html',
                        controller: 'HeaderController'
                    },
                    'content': {
                        templateUrl: 'views/menu.html',
                        controller: 'MenuController'
                    },
                    'footer': {
                        templateUrl: 'views/footer.html',
                    }
                }

            })


            //ruta para menu
            .state('login', {
                url: '/login',
                views: {
                    'content@': {
                        templateUrl: 'views/home.html',
                        controller: 'LoginController'
                    }
                }
            })


            //ruta para testDetails
            .state('app.testDetails', {
                url: 'menu/:id',
                views: {
                    'content@': {
                        templateUrl: 'views/testDetails.html',
                        controller: 'TestController'
                    }
                }
            })

            //ruta para maker
            .state('app.maker', {
                url: 'maker',
                views: {
                    'content@': {
                        templateUrl: 'views/maker.html',
                        controller: 'MakerController'
                    }
                }
            })

            //ruta para statDetails
            .state('app.statDetails', {
                url: 'stats/:id',
                views: {
                    'content@': {
                        templateUrl: 'views/statDetails.html',
                        controller: 'StatsControllerDetails'
                    }
                }
            })


            //ruta para stats
            .state('app.stats', {
                url: 'stats',
                views: {
                    'content@': {
                        templateUrl: 'views/stats.html',
                        controller: 'StatsController'
                    }
                }
            })

            //ruta para favorites
            .state('app.favorites', {
                url: 'favorites',
                views: {
                    'content@': {
                        templateUrl: 'views/favorites.html',
                        controller: 'FavoritesController'
                    }
                }
            });


        $urlRouterProvider.otherwise('/login');

        /**IDIOMAS */
        var translationsES = {
            /**LOGIN */
            FEATURES: 'Caracteristicas',
            REGISTER: 'Registrate',
            INFO: 'Test Manager es una plataforma diseñada para la evaluación de cuestionarios',
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
            QUIZS: 'Mis Cuestionarios',
            MAKER: 'Crear Cuestionario',
            STAT: 'Estadisticas',
            FAV: 'Mis Favoritos',
            EXIT: 'Salir',
            /**MAKER */
            MAKERTAB1: 'Crear',
            MAKERTITLE: 'Crea tu propio cuestionario',
            QUIZTITLE: 'Título',
            QUIZTITLEPLACE: 'Escribe un Título',
            NOQUIZTITLE: 'El titulo es necesario',
            QUIZDESCR: 'Descripción',
            QUIZDESCRPLACE: 'Describelo',
            NQUESTIONS: 'Nº de preguntas',
            QUESTIONS: 'Preguntas',
            QUESTIONSSELECT1: 'Por favor selecciona un número',
            QUESTION: 'Pregunta',
            QUESTIONPLACE: 'Escribe la pregunta',
            NOQUESTION: 'La pregunta es necesaria',
            IMAGE: 'Selecciona una imagen',
            ANSWER1: 'Respuesta 1',
            ANSWER2: 'Respuesta 2',
            ANSWER3: 'Respuesta 3',
            ANSWER4: 'Respuesta 4',
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
            ADDFAVORITE: 'Añadido favorito',
            FAVORITEBUTTON: 'Mis Favoritos',
            EXISTFAVORITE: 'Ya existe el favorito',
            REMOVEQUESTION: 'Estas seguro de eliminar este cuestionario?',
            REMOVEQUIZ: 'Eliminar',
            CANCELREMOVE: 'Cancelar',
            /**TEST DETAILS */
            SELECTQUESTION: 'Selecciona una respuesta',
            READY: 'Listo !',
            RESULTTAB: 'Resultados',
            SUMMARYTAB: 'Sumario',
            CORRECT: 'Muy bien! La respuesta correcta es :',
            PARCIAL1: 'La respuesta',
            PARCIAL2: 'es correcta parcialmente.',
            INCORRECT: 'Vaya! La respuesta correcta no es : ',
            DATE: '{{date|date:\'short\'}}',
            BUTTON_LANG_ES: 'Español',
            BUTTON_LANG_EN: 'Inglés'
        };

        var translationsEN = {
            /**LOGIN */
            FEATURES: 'Features',
            REGISTER: 'Sign up',
            INFO: 'Test Manager is a platform designed for the evaluation of quiz',
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
            QUIZS: 'Quizs',
            MAKER: 'Quiz Maker',
            STAT: 'Statistics',
            FAV: 'My Favorites',
            EXIT: 'Log out',
            /**MAKER */
            MAKERTAB1: 'Create',
            MAKERTITLE: 'Create your own quiz',
            QUIZTITLE: 'Title',
            QUIZTITLEPLACE: 'Write a title',
            NOQUIZTITLE: 'The title is necessary',
            QUIZDESCR: 'Description',
            QUIZDESCRPLACE: 'Describe it',
            NQUESTIONS: 'No. of questions',
            QUESTIONS: 'Questions',
            QUESTIONSSELECT1: 'Por favor selecciona un número',
            QUESTION: 'Question ',
            QUESTIONPLACE: 'Write the question',
            NOQUESTION: 'The question is necessary',
            IMAGE: 'Select an image',
            ANSWER1: 'Answer 1',
            ANSWER2: 'Answer 2',
            ANSWER3: 'Answer 3',
            ANSWER4: 'Answer 4',
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
            ADDFAVORITE: 'Added favorite',
            FAVORITEBUTTON: 'My favorites',
            EXISTFAVORITE: 'Favorite already exists',
            REMOVEQUESTION: 'Are you sure to delete this quiz?',
            REMOVEQUIZ: 'Delete',
            CANCELREMOVE: 'Cancel',
            /**TEST DETAILS */
            SELECTQUESTION: 'Select an answer',
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
        $translateProvider.useSanitizeValueStrategy(null);
        $translateProvider.forceAsyncReload(true);


    });