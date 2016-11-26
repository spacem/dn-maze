(function () {
'use strict';
angular.module('dnsim').controller('CreateCtrl', ['$location','$window','$timeout','region','$routeParams', create]);

function create($location, $window, $timeout, region, $routeParams) {
  'use strict';
  
  var vm = this;
  
  if($routeParams.region) {
    region.setLocationByName($routeParams.region);
  }
  
  vm.setJob = function() {
    $timeout(function() {
      console.log('they set the job', vm.job);
      $window.location.href = 'https://dnskillsim.herokuapp.com/' + region.dntLocation.region + '/' + vm.job.d.EnglishName.toLowerCase() + '-93/-';
    });
  }
  
}

})();