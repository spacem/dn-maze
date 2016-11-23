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
    controller: menuController,
  };
}

function menuController() {

}

})();
