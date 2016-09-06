angular.module('dnsim').controller('RegionCtrl', 
  ['$scope','$timeout','$location','region',
  function($scope,$timeout,$location,region) {
    'use strict';

    region.init();
      
    $scope.region = region;
    
    $scope.getDntLocation = function() {
      return region.dntLocation;
    }
    $scope.getTlocation = function() {
      return region.tlocation;
    }
     
    $scope.getHostedFiles = function() {
      // console.log('getting hosted files');
      return region.hostedFiles;
    }
    
    $scope.setTLocation = function(location) {
      region.setTLocation(location);
      $scope.edit = false;
    }
    
    $scope.setLocation = function(location) {
      region.setLocation(location);
    }
  }
])
.directive('dngearsimRegion', function() {
  return {
    templateUrl: 'ui/region/region.html'
  };
});