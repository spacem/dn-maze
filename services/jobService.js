(function () {
'use strict';

angular.module('dnsim').factory('jobs', ['dntData', 'translations', 'itemColumnsToLoad', jobs]);
function jobs(dntData, translations, itemColumnsToLoad) {
  
  var fileName ='jobtable.lzjson';
  var colsToLoad = itemColumnsToLoad.jobsDnt;
  
  return {
    fileName : fileName,
    allJobs : null,
    
    isLoaded : function() {
      return dntData.isLoaded(fileName);
    },
    
    hasStartedLoading: function() {
      return dntData.hasStartedLoading(fileName);
    },
    
    init : function(progress, complete) {
      dntData.init(fileName, colsToLoad, progress, function() {
        complete();
        });
    },

    reset : function() {
      this.allJobs = null;
      dntData.reset(fileName);
    },
    
    getFinalJobs : function () {
      var jobs = [];
      var alljobs = this.getAllJobs();
      if(alljobs) {
        var numRows = alljobs.length;
        for(var r=0;r<numRows;++r) {
          if(alljobs[r].d.JobNumber == 2 && alljobs[r].d.JobIcon > 0) {
            jobs.push(alljobs[r]);
          }
        }
      }
      
      return jobs;
    },
    
    getBaseJobs : function () {
      var retVal=[];
      var baseJobs = {};

      var self = this;
      angular.forEach(this.getFinalJobs(), function(job, key) {
        baseJobs[self.getBaseJobName(job)] = job;
      });

      angular.forEach(baseJobs, function(job, jobName) {
        retVal.push(jobName);
      });

      return retVal;
    },
    
    getAllJobs : function () {
      if(this.allJobs == null && this.isLoaded() && translations.isLoaded()) {
        var jobs = [];
        var data = dntData.getData(fileName);
        var numRows = data.length;
        for(var r=0;r<numRows;++r) {
          jobs[jobs.length] = this.createJob(data[r]);
        }
        
        this.allJobs = jobs;
      }
      return this.allJobs;
    },
    
    getById: function(id) {
      var data = this.getAllJobs();
      if(data) {
        var numRows = data.length;
        for(var r=0;r<numRows;++r) {
          if(data[r].id == id) {
            return data[r];
          }
        }
      }
    },
    
    getByEnglishName: function(englishName) {
      var data = this.getAllJobs();
      if(data) {
        var numRows = data.length;
        for(var r=0;r<numRows;++r) {
          if(data[r].d.EnglishName == englishName) {
            return data[r];
          }
        }
      }
    },
    
    createJob : function(d) {
      var t = this;
      return {
          d : d,
          id : d.id,
          name : translations.translate(d.JobName),
          isClassJob : function(c) {
            return t.isClassJob(d, c);
          }
        };
    },
    
    isClassJob : function (d, c) {
      if(c == 0) return true;
      if(d.id == c) {
        return true;
      }
      
      var parentJob = d.ParentJob;
      
      if(!parentJob) return false;
      if(parentJob == c) return true;

      var parentJobData = this.getById(parentJob);
      if(parentJobData) {
        return this.isClassJob(parentJobData.d, c);
      }
      
      return false;
    },
    
    getBaseJobName : function(job) {
      if(this.isLoaded()) {
        var alljobs = this.getAllJobs();
        if(alljobs) {
          var numRows = alljobs.length;
          for(var r=0;r<numRows;++r) {
            if(alljobs[r].id == (job.d.BaseClass+1) && alljobs[r].d.EnglishName) {
              return alljobs[r].d.EnglishName;
            }
          }
        }
      }
      
      return null;
    },
  }
}

})();