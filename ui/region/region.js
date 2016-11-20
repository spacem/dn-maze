angular.module('dnsim').controller('RegionCtrl', 
  ['$timeout','$location','region',
  function($timeout,$location,region) {
    'use strict';
    
    var vm = this;

    vm.override = region.getOverride();
    region.init();
      
    vm.region = region;
    vm.tHoverLocation = region.tlocation;
    vm.hoverLocation = region.dntLocation;
    vm.edit = (region.dntLocation == null);
    
    vm.getDntLocation = function() {
      return region.dntLocation;
    };
    vm.getTlocation = function() {
      return region.tlocation;
    };
     
    vm.getHostedFiles = function() {
      // console.log('getting hosted files');
      return region.hostedFiles;
    };
    
    vm.setTLocation = function(location) {
      region.setTLocation(location);
      vm.edit = false;
    };
    
    vm.setLocation = function(location) {
      region.setLocation(location);
      vm.edit = false;
    };

    vm.setOverride = function(value) {
      region.setOverride(value);
      vm.override = value;
      vm.edit = value;
    };
  }
])
.directive('dngearsimRegion', function() {
  return {
    templateUrl: 'ui/region/region.html',
    controllerAs: 'ctrl',
  };
});