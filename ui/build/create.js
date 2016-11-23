(function () {
'use strict';
angular.module('dnsim').controller('CreateCtrl', ['$location','$window','$timeout','region',create]);

function create($location, $window, $timeout, region) {
  'use strict';
  
  var vm = this;
  vm.setJob = function() {
    $timeout(function() {
      console.log('they set the job', vm.job);
      $window.location.href = 'https://dnskillsim.herokuapp.com/' + region.dntLocation.region + '/' + vm.job.d.EnglishName.toLowerCase() + '-93/-';
    });
  }
  
}

})();