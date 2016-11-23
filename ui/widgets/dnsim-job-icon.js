(function () {
'use strict';

angular.module('dnsim').directive('dnsimJobIcon', [dnsimJobIcon]);

function dnsimJobIcon() {
  return {
    restrict: 'E',
    scope: {},
    bindToController: {
      item: '=item',
    },
    templateUrl: 'ui/widgets/dnsim-job-icon.html',
    controller: dnsimJobIconController,
    controllerAs: 'ctrl'
  }
}

function dnsimJobIconController() {

  this.getIconXPostion = function() {
    if(this.item && this.item.d && this.item.d.JobIcon > 0) {
      return ((this.item.d.JobIcon % 9) * 44) + 5;
    }
    return 0;
  }
  
  this.getIconYPostion = function() {
    if(this.item && this.item.d && this.item.d.JobIcon > 0) {
      return (Math.floor(this.item.d.JobIcon / 9) * 44) + 5;
    }
    return 0;
  }
}

})();
