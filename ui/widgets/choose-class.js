(function () {
'use strict';

angular.module('dnsim').directive('dnsimChooseClass', chooseClass);

function chooseClass() {
  return {
    restrict: 'E',
    scope: true,
    bindToController: {
      job: '=job',
      onSetJob: '&onSetJob'
    },
    templateUrl: 'ui/widgets/choose-class.html',
    controllerAs: 'ctrl',
    controller: [
      '$window','$location','$routeParams','$timeout','jobs', 
      chooseClassController],
  };
}

function chooseClassController($window,$location,$routeParams,$timeout,jobs) {
  console.log('choose class');
  this.getFinalJobs = function() {
    var allJobs = jobs.getFinalJobs();
    var finalJobs = [];
    for(var j=0;j<allJobs.length;++j) {
      if(jobs.getBaseJobName(allJobs[j]) == this.bJob) {
        finalJobs.push(allJobs[j]);
      }
    }
    return finalJobs;
  }
  
  this.getBaseJobs = function() {
    return jobs.getBaseJobs();
  }
  
  this.getJobName = function(englishName) {
    var allJobs = jobs.getAllJobs();
    for(var j=0;j<allJobs.length;++j) {
      if(allJobs[j].d.EnglishName == englishName) {
        return allJobs[j].name;
      }
    }
  }
  
  this.setJob = function(job) {
    this.job = job;
    if(job) {
      this.onSetJob();
    }
  }
  
  
  jobs.init(reportProgress, $timeout);
  function reportProgress(msg) {
    // console.log('progress: ' + msg);
  }

}

})();
