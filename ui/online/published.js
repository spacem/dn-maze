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
      return 'https://dnskillsim.herokuapp.com/' + build.region + '/' + buildJob.d.EnglishName.toLowerCase() + '-93/' + build.build;
    }
  }
  
  vm.baseSkillNums = [];
  vm.specSkillNums = [];
  vm.finalSkillNums = [];
  function setupSkillNums() {
    for(var i=0;i<6*4;++i) {
      vm.baseSkillNums.push(getSkillNum(i));
    }
    
    for(i=6*4;i<6*4*2;++i) {
      vm.specSkillNums.push(getSkillNum(i));
    }
    
    for(i=6*4*2;i<6*4*3;++i) {
      vm.finalSkillNums.push(getSkillNum(i));
    }
  }
  
  function getSkillNum(index) {
    var chars = vm.build.build.split('');
    if(chars.length > index) {
      var char = chars[index];
      var num = parseInt(char, 36);
      if(num >= 0) {
        return num + 1;
      }
    }
    return ' ';
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
    });
  }
  
  function getBuild() {
    onlineService.getBuild(vm.uid, vm.buildName).then(function(build) {
      if(build) {
        vm.build = build;
        setupSkillNums();
      }
      else {
        vm.build = {};
      }
    });
  }
}

})();