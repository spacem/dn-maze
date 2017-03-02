(function () {
'use strict';
angular.module('dnsim').controller('BuildSearchCtrl', ['$routeParams','$location','$timeout','onlineService','jobs', 'region', buildSearch]);

function buildSearch($routeParams,$location,$timeout,onlineService,jobs,region) {
  'use strict';
  
  var vm = this;
  
  if($routeParams.region) {
    region.setLocationByName($routeParams.region);
  }
  
  vm.maxDisplay = 15;
  vm.totalNumResults = 0;
  
  jobs.init(null, function() {
    if($routeParams.jobId) {
      vm.job = jobs.getById($routeParams.jobId);
      getClassBuilds();
    } 
  })
  
  this.setJob = function() {
    $timeout(function() {
      $location.search('jobId', vm.job.id);
    });
  }
  
  this.showMoreResults = function(extra) {
    vm.maxDisplay = vm.totalNumResults + extra;
    vm.totalNumResults = 0;
  }
  
  vm.allResults = null;
  vm.getFilteredBuilds = function() {
    
    // init
    if(vm.allResults == null) {
      vm.allResults = [];
      for(var uid in vm.jobBuilds) {
        for(var buildName in vm.jobBuilds[uid]) {
          if(vm.jobBuilds[uid][buildName] && vm.jobBuilds[uid][buildName].region) {
            var result = {
              uid: uid,
              name: buildName,
              data: vm.jobBuilds[uid][buildName]
            };
            
            if(result.data.about && result.data.about.length > 256) {
              result.data.about = result.data.about.substr(0, 256);
            }
            
            vm.allResults.push(result);
          }
        }
      }
    }
    
    var results = [];
    for(var i=0;i<vm.allResults.length;++i) {
      
      var result = vm.allResults[i];
      if(vm.filter && vm.filter.length > 0) {
        var f = vm.filter.toUpperCase();
        if(result.name.toUpperCase().indexOf(f) == -1) {
          if(!result.data.guild ||
             result.data.guild.toUpperCase().indexOf(f) == -1) {

            continue;
          }
        }
      }
      
      results.push(result);

      if(results.length >= vm.maxDisplay) {
        break;
      }
    }
    
    vm.totalNumResults = results.length;
    return results;
  }
  
  function getClassBuilds() {
    if(vm.job) {
      onlineService.getClassBuilds(vm.job).then(function(builds) {
        if(builds) {
          // console.log('got builds', builds);
          vm.jobBuilds = builds;
        }
        else {
          // console.log('no builds');
          vm.jobBuilds = {};
        }
      });
    }
  }
}

})();