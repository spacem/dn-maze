(function () {
'use strict';
angular.module('dnsim').controller('PublishCtrl', ['$location', 'onlineService', '$routeParams', 'region', 'jobs', publish]);

function publish($location, onlineService, $routeParams, region, jobs) {
  'use strict';
  
  var vm = this;
  
  vm.show = $routeParams.show;
  
  if($routeParams.build && $routeParams.job && $routeParams.region) {
    sessionStorage.setItem('current_skill_build', $routeParams.build);
    sessionStorage.setItem('current_skill_build_job', $routeParams.job);
    sessionStorage.setItem('current_skill_build_region', $routeParams.region);
    region.setLocationByName($routeParams.region);
    console.log('saved build from parameters');
  }
  
  onlineService.login().then(function(user) {
    getSavedBuilds();
    getProfile();
    getCurrentBuild();
  });
  
  jobs.init(function() {
    
  }, function() {
  });
  
  function getCurrentBuild() {
    vm.build = {
      build: sessionStorage.getItem('current_skill_build'),
      job: sessionStorage.getItem('current_skill_build_job'),
      region: sessionStorage.getItem('current_skill_build_region'),
      name: 'new build'
    };
    
    if(!vm.build.build || !vm.build.job || !vm.build.region) {
      vm.build = null;
    }
  }
  
  function getSavedBuilds() {
    var user = vm.getUser();
    if(user) {
      onlineService.getUserBuilds(user.uid).then(function(builds) {
        if(builds) {
          vm.storedBuilds = builds;
        }
        else {
          vm.storedBuilds = {};
        }
      });
    }
  }
  
  function getProfile() {
    var user = vm.getUser();
    if(user) {
      onlineService.getProfile(user.uid).then(function(profile) {
        if(profile) {
          vm.profile = profile;
        }
        else {
          vm.profile = {};
        }
      });
    }
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
  
  this.saveProfile = function() {
    onlineService.saveProfile(vm.profile).then(getProfile).catch(handleError);
  }
  
  this.getUser = function() {
    return onlineService.getUser();
  }
  
  this.save = function() {
    vm.build.lastUpdate = (new Date()).getTime();
    onlineService.saveBuild(vm.build.name, vm.build).then(getSavedBuilds).catch(handleError);
    vm.publishBuild = null;
  }
  
  this.startPublish = function() {
    var buildName = vm.build.name;
    if(buildName in vm.storedBuilds) {
      if(!vm.build.about) {
        vm.build.about = vm.storedBuilds[buildName].about;
      }
      
      if(!vm.build.guild) {
        vm.build.guild = vm.storedBuilds[buildName].guild;
      }
    }
    
    vm.publishBuild = buildName;
  }
  
  function handleError(err) {
    console.log(err);
  }
  
  this.deleteAccount = function() {
    onlineService.deleteAccount(vm.storedBuilds);
  }
  
  this.getBuildLimit = function() {
    if(vm.profile && vm.profile.maxBuilds) {
      return vm.profile.maxBuilds;
    }
    else {
      return 25;
    }
  }
  
  this.getNumStoredBuilds = function() {
    return _.size(vm.storedBuilds);
  }
  
  this.getNumBuilds = function() {
    return _.size(vm.builds);
  }
  
  this.signOut = function() {
    onlineService.signOut();
  }
  
  vm.getAllBuildNames = function() {
    var allKeys = _.keys(vm.storedBuilds);
    return _.uniq(allKeys.sort(), true);
  }
  
  vm.deleteServer = function(buildName) {
    vm.serverToDelete = buildName;
  }
  
  vm.reallyDeleteServer = function(buildName) {
    onlineService.deleteBuild(buildName, vm.storedBuilds[buildName]).then(getSavedBuilds);
    vm.serverToDelete = null;
  }
  
}

})();