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

      .state('app.cloud', {
        url: '/cloud',
        views: {
          'mainContent': {
            templateUrl: 'templates/cloud.html',
            controller: 'CloudController'
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
      });

   

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
    $translateProvider
      .useStaticFilesLoader({
        prefix: 'js/locale-',
        suffix: '.json'
      })
    $translateProvider.preferredLanguage('es');
    $translateProvider.fallbackLanguage('es');
    $translateProvider.useSanitizeValueStrategy('escapeParameters');
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