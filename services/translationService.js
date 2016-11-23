(function () {
'use strict';

angular.module('dnsim').factory('translations', ['$routeParams', '$rootScope', translations]);
function translations($routeParams, $rootScope) {

  var dnTranslations = new DnTranslations();
  var smallFile = 'uistring.optimised.lzjson';
  var bigFile = 'uistring.lzjson';

  var completeCallback = [];
  var progressCallback = [];

  return {
    
    reset : function() {
      dnTranslations = new DnTranslations();
      dnTranslations.sizeLimit = 100;
      this.loaded = false;
      this.startedLoading = false;
      completeCallback = [];
      progressCallback = [];
    },
    
    getFileName: function() {
      if(this.small) {
        // console.log('loading optimised translations');
        return smallFile;
      }
      else {
        // console.log('loading full translations');
        return bigFile;
      }
    },
    
    loaded : false,
    startedLoading : false,
    small: false,
    
    location : null,
  
    init : function(progress, complete) {

      if(this.isLoaded()) {
        complete();
      }
      else {
        progressCallback = [];
        if(progress) {
          progressCallback.push(progress);
        }
        if(complete) {
          completeCallback.push(complete);
        }
  
        if(!this.startedLoading) {
          this.startedLoading = true;
          var t = this;
          
          var fileName = null;
          if(this.location && this.location != '') {
            fileName = this.location + '/' + this.getFileName();
            
            if(fileName != localStorage.getItem("UIStrings_file")) {
              sessionStorage.removeItem('UIStrings');
              localStorage.removeItem('UIStrings_file');
            }
          }
          
          $rootScope.$broadcast('TRANSLATION_LOAD_EVENT');
          dnTranslations.loadDefaultFile(
            fileName, 
            function(msg) {
              angular.forEach(progressCallback, function(value, key) { value(msg); });
            }, 
            function() {
              t.loaded = true;
              angular.forEach(completeCallback, function(value, key) { value(); });
              completeCallback = [];
              $rootScope.$broadcast('TRANSLATION_LOAD_EVENT');
            },
            function(msg) {
              angular.forEach(progressCallback, function(value, key) { value(msg); });
              $rootScope.$broadcast('TRANSLATION_LOAD_ERROR');
              t.startedLoading = false;
              t.loaded = false;
            }
          );
        }
      }
    },
    
    isLoaded : function() {
      if(!this.loaded) {
        var fileName = this.location + '/' + this.getFileName();
        
        if(fileName != localStorage.getItem("UIStrings_file")) {
          sessionStorage.removeItem('UIStrings');
          localStorage.removeItem('UIStrings_file');
        }

        this.loaded = dnTranslations.loadFromSession();
        if(this.loaded) {
          this.startedLoading = true;
        }
      }
      return this.loaded;
    },
    
    translate : function(id,idParam) {
      if(this.loaded) {
        
        var name;
        if(!id) {
          return '';
        }
        else {
          name = dnTranslations.translate(id);
          
          if(typeof name != 'string') {
            return 'm' + name;
          }
        }
        
        if(idParam) {
          var params = idParam.split(',');
          for(var p=0;p<params.length;++p) {
            var pid = params[p];
            if(pid.indexOf('{') == 0) {
              pid = params[p].replace(/\{|\}/g,'');
              pid = dnTranslations.translate(pid);
            }
            
            name = name.replace('{' + p + '}', pid);
          }
        }

        return name;
      }
      else {
        return 'm' + id;
      }
    }
  }
}

})();