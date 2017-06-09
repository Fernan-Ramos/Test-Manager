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
 * @author Fernán Ramos Saiz
 * @version 1.0
 * @description Fichero que almacena la configuración de la aplicación
 */
angular.module('testManager', ['ionic', 'ngCordova', 'testManager.controllers', 'testManager.services', 'pascalprecht.translate'])

  .run(function ($ionicPlatform, $cordovaSplashscreen, $timeout, $translate) {
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
      //Se detecta el idioma predifinido en el dispostivo y realiza la traducción a dicho idioma
      if (typeof navigator.globalization !== "undefined") {
        navigator.globalization.getPreferredLanguage(function (language) {
          $translate.use((language.value).split("-")[0]).then(function () {
            //Success
          }, function () {
            //Error
          });
        }, null);
      }
      //Se establece un tiempo para cerrar el SplashScreen
      $timeout(function () {
        $cordovaSplashscreen.hide();
      }, 1000);

    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $translateProvider) {
    $stateProvider

      /**
       * Estado principal de la aplicacion
       */
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/sidebar.html',
        controller: 'AppCtrl'
      })

      /**
       * Estado login, 
       */
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginController'
      })
      /**
       * Estado menu, 
       */
      .state('app.menu', {
        url: '/menu',
        views: {
          'mainContent': {
            templateUrl: 'templates/menu.html',
            controller: 'MenuController'
          }
        }
      })
      /**
       * Estado cloud, 
       */
      .state('app.cloud', {
        url: '/cloud',
        views: {
          'mainContent': {
            templateUrl: 'templates/cloud.html',
            controller: 'CloudController'
          }
        }
      })
      /**
       * Estado testDetails, 
       */
      .state('app.testDetails', {
        url: '/menu/:id',
        views: {
          'mainContent': {
            templateUrl: 'templates/testDetails.html',
            controller: 'TestController'
          }
        }
      })
      /**
       * Estado maker, 
       */
      .state('app.maker', {
        url: '/maker',
        views: {
          'mainContent': {
            templateUrl: 'templates/maker.html',
            controller: 'MakerController'
          }
        }
      })
      /**
       * Estado statDetails, 
       */
      .state('app.statDetails', {
        url: '/stats/:id',
        views: {
          'mainContent': {
            templateUrl: 'templates/statDetails.html',
            controller: 'StatsControllerDetails'
          }
        }
      })

      /**
       * Estado stats, 
       */
      .state('app.stats', {
        url: '/stats',
        views: {
          'mainContent': {
            templateUrl: 'templates/stats.html',
            controller: 'StatsController'
          }
        }
      });



    //Si no se puede acceder a ninguna ruta, por defecto se accede a la ruta /login
    $urlRouterProvider.otherwise('/login');
    /**
     * Se obtienen las traducciones de los ficheros locales .json
     */
    $translateProvider
      .useStaticFilesLoader({
        prefix: 'traductions/locale-',
        suffix: '.json'
      })
    $translateProvider.preferredLanguage('es');
    $translateProvider.fallbackLanguage('es');
    $translateProvider.useSanitizeValueStrategy('escapeParameters');
  });
