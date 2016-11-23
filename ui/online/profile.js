(function () {
'use strict';
angular.module('dnsim').controller('ProfileCtrl', ['$location', '$routeParams', 'onlineService','jobs', profile]);

function profile($location, $routeParams, onlineService, jobs) {
  'use strict';
  
  var vm = this;
  vm.uid = $routeParams.uid;
  
  jobs.init(function() {}, function() {});
  
  getSavedBuilds();
  getProfile();
  
  function getSavedBuilds() {
    onlineService.getUserBuilds(vm.uid).then(function(builds) {
      if(builds) {
        vm.storedBuilds = builds;
      }
      else {
        vm.storedBuilds = {};
      }
    });
  }
  
  function getProfile() {
    onlineService.getProfile(vm.uid).then(function(profile) {
      if(profile) {
        vm.profile = profile;
      }
      else {
        vm.profile = {};
      }
    });
  }
  
  this.getJob = function(build) {
    if(build.job) {
      return jobs.getById(build.job);
    }
  }
  
  this.getBuildJobName = function(build) {
    var buildJob = jobs.getById(build.job);
    if(buildJob) {
      return buildJob.name;
    }
  }
  
  this.getBuildLink = function(build) {
    var buildJob = jobs.getById(build.job);
    if(buildJob) {
      return 'https://dnskillsim.herokuapp.com/' + build.region + '/' + buildJob.d.EnglishName.toLowerCase() + '-93/' + build.build;
    }
  }
}

})();