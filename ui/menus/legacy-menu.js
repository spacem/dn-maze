(function () {
'use strict';

angular.module('dnsim').directive('dngearsimLegacyMenu', menu);

function menu() {
  return {
    restrict: 'E',
    scope: false,
    bindToController: {
    },
    templateUrl: 'ui/menus/legacy-menu.html',
    controllerAs: 'ctrl',
    controller: ['region', menuController],
  };
}

function menuController(region) {
  
  var vm = this;
  
  vm.getRegion = function() {
    if(region.dntLocation) {
      return region.dntLocation.region;
    }
  }
}

})();
