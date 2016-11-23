(function () {
'use strict';

angular.module('dnsim').factory('dntReset',['jobs','dntData',dntReset]);
function dntReset(jobs, dntData) {
  return function() {
    
    jobs.reset();
    dntData.resetAll();
  }
}

})();