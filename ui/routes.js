(function () {
'use strict';

angular.module('dnsim').config(['$routeProvider', config]);

function config($routeProvider) {

  $routeProvider.
    
    when('/create', {
      templateUrl: 'ui/build/create.html',
      controller: 'CreateCtrl as ctrl',
    }).
    when('/publish', {
      templateUrl: 'ui/online/publish.html',
      controller: 'PublishCtrl as ctrl',
    }).
    
    when('/profile/:uid?', {
      templateUrl: 'ui/online/profile.html',
      controller: 'ProfileCtrl as ctrl',
    }).
    
    when('/published', {
      templateUrl: 'ui/online/published.html',
      controller: 'PublishedCtrl as ctrl',
    }).
    
    when('/published/:uid/:buildName*', {
      templateUrl: 'ui/online/published.html',
      controller: 'PublishedCtrl as ctrl',
    }).
    
    when('/build-search/:jobId?', {
      templateUrl: 'ui/online/build-search.html',
      controller: 'BuildSearchCtrl as ctrl',
    }).
  
    when('/:region?', {
      templateUrl: 'ui/home/home.html'
    }).
    
    otherwise({
      redirectTo: '/'
    });
}

})();