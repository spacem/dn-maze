(function () {
'use strict';
angular.module('dnsim').controller('PublishedCtrl', ['onlineService', '$location', '$routeParams','jobs', published]);

function published(onlineService, $location, $routeParams, jobs) {
  'use strict';
  
  var vm = this;
  vm.uid = $routeParams.uid;
  vm.buildName = $routeParams.buildName;
  
  getBuild();
  getProfile();
  
  jobs.init(function() {}, function() {});
  
  vm.getBuildLink = function(build) {
    var buildJob = jobs.getById(build.job);
    if(build && buildJob) {
      var level = build.level;
      if(!level) {
        level = 93;
      }
      return 'https://dnskillsim.herokuapp.com/' + build.region + '/' + buildJob.d.EnglishName.toLowerCase() + '-' + level + '/' + build.build;
    }
  }
  
  
  vm.getJob = function(build) {
    if(build.job) {
      return jobs.getById(build.job);
    }
  }
  
  function getProfile() {
    onlineService.getProfile(vm.uid).then(function(profile) {
      if(profile) {
        vm.profile = profile;
      }
      else {
        vm.profile = {};
      }
    }).catch(function(err) {
      console.log('unable to load profile', err);
      vm.profile = {};
    });
  }
  
  function getBuild() {
    onlineService.getBuild(vm.uid, vm.buildName).then(function(build) {
      if(build) {
        vm.build = build;
      }
      else {
        vm.build = {};
      }
    });
  }
}

})();