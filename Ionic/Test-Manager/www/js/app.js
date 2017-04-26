// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('testManager', ['ionic', 'ngCordova', 'testManager.controllers', 'testManager.services'])

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
      }, 3000);

    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {
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
  });
