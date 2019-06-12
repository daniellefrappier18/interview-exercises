angular.module('jh-app', ['ui.router'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/start-here');
        $stateProvider.state('index', {
        url: '/start-here',
        template: require('../src/html/start-here.html')
        
    })
})
