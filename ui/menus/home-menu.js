(function () {
'use strict';

angular.module('dnsim').directive('dngearsimHomeMenu', menu);

function menu() {
  return {
    restrict: 'E',
    scope: false,
    bindToController: {
    },
    templateUrl: 'ui/menus/home-menu.html',
    controllerAs: 'ctrl',
    controller: menuController,
  };
}

function menuController() {

}

})();
