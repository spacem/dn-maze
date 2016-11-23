(function () {
'use strict';
angular.module('dnsim').filter('percentage', [function() {
  'use strict';

  function percentageFilter(input) {
    if(typeof input == 'number') {
      return (Math.round(input * 100 * 100) / 100) + '%';
    }
    else {
      return input;
    }
  }
  percentageFilter.$stateful = false;

  return percentageFilter;
}]);

})();