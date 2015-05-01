
'use strict';

angular
    .module('app', [
        'ngAnimate',
        'ngCookies',
        'ngTouch',
        'ngSanitize',
        'restangular',
        'ui.router',
        'LocalStorageModule',
        'pascalprecht.translate',
        'ui.bootstrap',
        'ngDraggable',
        'febworms',
        'formly',
        'formlyBootstrap'
    ])
    .config(function ($stateProvider, $urlRouterProvider, localStorageServiceProvider, $translateProvider) {

        //translations
        $translateProvider.translations('en', {
            BSGRID: {
                PAGE_FIRST: "First",
                PAGE_PREVIOUS: "Previous",
                PAGE_NEXT: "Next",
                PAGE_LAST: "Last",
                BUTTON_OPTIONS: "Options <span class=\"caret\"></span>",
                BUTTON_EXPORT: "Export <span class=\"caret\"></span>",
                EXPORT_FILTERED: "Filtered",
                EXPORT_SELECTED: "Selected",
                EXPORT_ALL: "All",
                LABEL_SEARCH: "Search",
                SELECTED_STATS: "Selected <strong class=\"text-primary\">{{num}}</strong>",
                DISPLAY_STATS: "Showing <strong>{{begin}}</strong> to <strong>{{end}}</strong> of <strong class=\"text-primary\">{{of}}</strong> items",
                FILTERED_STATS: "(<em>Filtered down from <strong>{{of}}</strong></em>)",
                PAGESIZE: "Page Size",
                COLUMNS: "Columns"
            }
        });
        $translateProvider.preferredLanguage('en');

        //ui-router
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'app/main/main.html',
                controller: 'MainCtrl'
            })
            .state('about', {
                url: '/about',
                templateUrl: 'app/about/about.html',
                controller: 'AboutCtrl'
            })
            .state('bsgrid', {
                url: '/bsgrid',
                templateUrl: 'app/bsgrid/bsgrid.html',
                controller: 'BsgridCtrl'
            })
            .state('forms', {
                url: '/forms',
                templateUrl: 'app/forms/forms.html',
                controller: 'FormsCtrl'
            })
            .state('mortgage', {
                url: '/mortgage',
                templateUrl: 'app/mortgage/mortgage.html',
                controller: 'MortgageCtrl as vm'
            });
        $urlRouterProvider.otherwise('/');


        //local storage
        localStorageServiceProvider
            .setPrefix('demo');
    });


