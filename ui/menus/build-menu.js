(function () {
'use strict';

angular.module('dnsim').directive('dngearsimBuildMenu', menu);

function menu() {
  return {
    restrict: 'E',
    scope: false,
    bindToController: {
      jobName: '=jobName'
    },
    templateUrl: 'ui/menus/build-menu.html',
    controllerAs: 'ctrl',
    controller: menuController,
  };
}

function menuController() {
  
  var vm = this;
  
  vm.publishBuild = function() {
    var parts = window.location.href.replace('//', '::').split('/');
    if(parts && parts.length) {
      window.location = "https://spacem.github.io/dnskillsim/publish?build=" + parts[parts.length-1];
    }
  }

}

})();
