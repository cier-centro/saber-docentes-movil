angular.module('app.routes', [])
        .config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                    .state('start', {
                        url: '/start',
                        templateUrl: 'templates/startPage.html',
                        controller: 'startPageCtrl'
                    })
                    .state('select_test_type', {
                        url: '/selectType',
                        templateUrl: 'templates/SelectTestType.html',
                        controller: 'selectTestTypeCTRL'
                    })
                    .state('select_dba', {
                        url: '/selectDbas',
                        templateUrl: 'templates/selectDbas.html',
                        controller: 'selectDbasCTRL'
                    })
                    .state('selectQuestions', {
                        url: '/selectQuestions',
						            cache: false,
                        templateUrl: 'templates/selectQuestions.html',
                        controller: 'selectQuestionsCtrl'
                    })
                    .state('askaquestion', {
                        url: '/answerTest',
                        cache: false,
                        templateUrl: 'templates/askQuestion.html',
                        controller: 'askTestCtrl'
                    })
                    .state('show_test', {
                        url: '/showTest',
                        cache: false,
                        templateUrl: 'templates/ShowTest.html',
                        controller: 'showTestCtrl'
                    })
                    .state('show_answer_sheet', {
                        url: '/showAnswerSheet',
                        cache: false,
                        templateUrl: 'templates/ShowAnswerSheet.html',
                        controller: 'showAnswerSheetCtrl'
                    })
            $urlRouterProvider.otherwise('/start')
        });
