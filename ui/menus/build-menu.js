(function () {
'use strict';

angular.module('dnsim').directive('dngearsimBuildMenu', menu);

function menu() {
  return {
    restrict: 'E',
    scope: false,
    bindToController: {
      jobName: '=jobName'
    },
    templateUrl: 'ui/menus/build-menu.html',
    controllerAs: 'ctrl',
    controller: ['region','jobs', menuController],
  };
}

function menuController(region, jobs) {
  
  var vm = this;
  
  vm.publishBuild = function() {
    
    var parts = window.location.href.replace('//', '::').split('/');
    if(parts && parts.length > 2) {
      jobs.init(
        function() {},
        function() {
        
        var jobName = parts[parts.length-2];
        jobName = jobName.substr(0, jobName.length-3);
        console.log('finding id for job ', jobName);
        var job = jobs.getByEnglishName(jobName);
          
        window.location = "https://spacem.github.io/dnskillsim/publish?build="
          + parts[parts.length-1]
          + '&region='
          + region.dntLocation.region
          + '&job='+job.id;
        });
      }
    }
}

})();
