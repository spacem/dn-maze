(function () {
'use strict';

angular.module('dnsim').factory('dntData', ['$rootScope','$timeout',dntData]);

function dntData($rootScope,$timeout) {
  
  function createLoader(dntLocation, file, colsToLoad) {

    var loader = {
      reader: new DntReader(),
      
      loaded: false,
      startedLoading: false,
      
      file: file,
      
      dntLocation: dntLocation,
      progressCallback: null,
      completeCallbacks : [],
      
      init: function(progress, complete) {
        
        if(this.loaded) {
          complete();
        }
        else {
          this.progressCallback = progress;
          this.completeCallbacks.push(complete);
          
          if(!this.startedLoading) {
            this.startedLoading = true;
            var t = this;
            
            this.reader.colsToLoad = colsToLoad;
            
            if(this.dntLocation && 
              this.dntLocation.url &&
              this.dntLocation.url.length) {

              $rootScope.$broadcast('DNTDATA_LOAD_EVENT');

              $timeout(function() {
                t.reader.loadDntFromServerFile(
                  t.dntLocation.url + '/' + file,
                  function(msg) { if(t.progressCallback != null) t.progressCallback(msg) }, 
                  function(result, fileName) {
                    // console.info('dnt loading complete : ' + file);
                    t.loaded = true;
                    
                    angular.forEach(t.completeCallbacks, function(value, key) {
                      value();
                    });
                    t.completeCallbacks = [];
                    $rootScope.$broadcast('DNTDATA_LOAD_EVENT');
                  },
                  function(msg) {
                    $rootScope.$broadcast('DNTDATA_LOAD_ERROR');
                    t.startedLoading = false;
                    t.loaded = false;
                  }  );
              });
            }
            else {
              // console.log("dnt location not set!");
            }
          }
        }
      },
      
      reset: function() {
        this.reader = new DntReader();
        this.loaded = false;
        this.startedLoading = false;
      }
    }
  
    return loader;
  };
  
  return {
    loaders : {},
    findIndexes : {},
    dntLocation : null,
    
    setLocation: function(location) {
      this.dntLocation = location;
      var t = this;
      angular.forEach(this.loaders, function(value, key) {
        if(value.dntLocation != location) {
          value.dntLocation = location;
          t.reset(key);
        }
      });
    },
    
    init : function (fileName, colsToLoad, progress, complete) {
      if(!progress) {
        progress = function() {};
      }
      if(!(fileName in this.loaders)) {
        if(fileName.length > 0) {
          this.loaders[fileName] = createLoader(this.dntLocation, fileName, colsToLoad);
        }
      }
      this.loaders[fileName].init(progress, complete);
    },
    getData : function (fileName) {
      if(this.isLoaded(fileName)) {
        var reader = this.loaders[fileName].reader;
        var retVal = new Array(reader.numRows);
        for(var i=0;i<reader.numRows;++i) {
          retVal[i] = reader.getRow(i);
        }
        
        return retVal;
      }
      else {
        return [];
      }
    },
    find : function(fileName, column, value) {
      var results = this.findFast(fileName, column, value);
      var retVal = [];
      var numResults = results.length;
      for(var i=0;i<numResults;++i) {
        retVal.push(this.getRow(fileName, results[i]));
      }
      
      return retVal;
    },
    findFast : function(fileName, column, value) {
      
      if(this.isLoaded(fileName)) {
        if(!(fileName in this.findIndexes)){
          this.findIndexes[fileName] = {};
        }
        
        var reader = this.loaders[fileName].reader;
        var colIndex = reader.columnIndexes[column];
        
        var findIndex = this.findIndexes[fileName];
        
        if(!(column in findIndex)) {
          var index = {}
          findIndex[column] = index;
          
          var results = [];
          
          var data = reader.data;
          var len = data.length;
          for(var r=0;r<len;++r) {
            var d = data[r];
            var val = d[colIndex];

            if(!(val in index)) {
              index[val] = [r];
            }
            else {
              index[val].push(r);
            }
          }
        }
        
        if(value in findIndex[column]) {
          return findIndex[column][value];
        }
        else {
          return [];
        }
      }
      
      return [];
    },
    isLoaded : function(fileName) {
      return fileName in this.loaders && this.loaders[fileName].loaded;
    },
    hasStartedLoading : function(fileName) {
      return this.isLoaded(fileName) || (fileName in this.loaders && this.loaders[fileName].startedLoading);
    },
    reset : function(fileName) {
      if(fileName in this.loaders) {
        this.loaders[fileName].reset();
        delete this.loaders[fileName];
        delete this.findIndexes[fileName];
      }
    },
    resetAll : function() {
      var t = this;
      angular.forEach(this.loaders, function(value, key) {
        t.reset(key);
      });
    },
    anyLoading : function() {
      var t = this;
      var found = 0;
      angular.forEach(this.loaders, function(value, key) {
        if(!value.loaded && value.startedLoading) {
          found++;
        }
      });
      
      return found;
    },
    getNumRows : function(fileName) {
      if(this.isLoaded(fileName)) {
        return this.loaders[fileName].reader.numRows;
      }
      else {
        return 0;
      }
    },
    getRow : function(fileName, index) {
      if(this.isLoaded(fileName)) {
        return this.loaders[fileName].reader.getRow(index);
      }
      else {
        return {};
      }
    },
    lookupValue: function(fileName, data, columnName) {
      if(this.isLoaded(fileName)) {
        return data[this.loaders[fileName].reader.columnNames[columnName]];
      }
      else {
        return null;
      }
    },
    convertData: function(fileName, data) {
      if(this.isLoaded(fileName)) {
        return this.loaders[fileName].reader.convertData(data);
      }
      else {
        return null;
      }
    },
    getValue : function(fileName, index, columnName) {
      if(this.isLoaded(fileName)) {
        return this.loaders[fileName].reader.getValue(index, columnName);
      }
      else {
        return null;
      }
    }
  };
}

})();