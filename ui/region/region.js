angular.module('dnsim').controller('RegionCtrl', 
  ['$timeout','$location','region','$http',
  function($timeout,$location,region,$http) {
    'use strict';
    
    var vm = this;

    vm.override = region.getOverride();
    region.init();
      
    vm.region = region;
    vm.tHoverLocation = region.tlocation;
    vm.hoverLocation = region.dntLocation;
    vm.edit = (region.dntLocation == null);
    vm.dntVersion = '';
    setDntVersion();
    
    vm.toggleEdit = function() {
      vm.edit = !vm.edit;
      if(typeof history_push !== 'undefined') {
        window.setTimeout(history_push, 100);
      }
    }
    
    vm.setHoverLocation = function(hoverLocation) {
      vm.hoverLocation = hoverLocation;
      if(typeof history_push !== 'undefined') {
        window.setTimeout(history_push, 1);
      }
    }
    
    function setDntVersion() {
      // console.log('setting version for ', vm.region.dntLocation);
      if(vm.region.dntLocation && vm.region.dntLocation.url) {
        var url = vm.region.dntLocation.url + '/Version.cfg';
        $http({
          url: url,
          method: 'GET',
          transformResponse: undefined
        }).then(function(res) {
          if(res && res.data) {
            var newLineDetails = res.data.split('\r\n');
            if(newLineDetails.length) {
              var spaceDetails = newLineDetails[0].split(' ');
              if(spaceDetails.length > 1) {
                vm.dntVersion = 'v' + spaceDetails[1];
              }
            }
          }
        });
      }
    }
    
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
      if(typeof history_push !== 'undefined') {
        history_push();
      }
      region.setLocation(location);
      vm.edit = false;
      setDntVersion();
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