(function () {
'use strict';

angular.module('dnsim').factory('region', ['translations','dntReset','dntData','$window','$timeout','$route', region]);
function region(translations,dntReset,dntData,$window,$timeout,$route) {
  
  var alternativeFiles = {region: 'ALT', name: 'Alternative user specified files', url : ''};
  var hostedFiles =[
    {region: 'sea', name: 'south east asia', url : 'https://seadnfiles.netlify.com/public'},
      {region: 'na', name: 'north america', url : 'https://nadnfiles.netlify.com/public'},
      {region: 'eu', name: 'europe', url : 'https://eudnfiles.netlify.com/public'},
      {region: 'th', name: 'thailand', url : 'https://thdnfiles.netlify.com/public'},
      {region: 'vn', name: 'vietnam ', url : 'https://vndnfiles.firebaseapp.com'},
      {region: 'tw', name: 'taiwan 臺灣', url : 'https://twdnfiles.firebaseapp.com'},
      // {region: 'jdn', name: 'japan 日本', url : 'https://jdnfiles-59d57.firebaseapp.com'},
      {region: 'cdn', name: 'china 中國', url : 'https://cdnfiles.netlify.com/public'},
      {region: 'kdn', name: 'korea 대한민국', url : 'https://kdnfiles.netlify.com/public'},
    ];
  
  var dntLocationRegion = localStorage.getItem('lastDNTRegion');
  var dntLocation = null;
  if(dntLocationRegion != null) {
    angular.forEach(hostedFiles, function(hostedFile, index) {
      if(hostedFile.region == dntLocationRegion) {
        dntLocation = hostedFile;
      }
    });
  }
  
  function getLocationFromUrl(url) {
    var parts = $window.location.href.replace('//', ':').split('/');
    if(parts.length > 1) {
      return parts[1];
    }
  }

  return {
    hostedFiles : hostedFiles,
    alternativeFiles : alternativeFiles,
    dntLocation : dntLocation,
    
    setCustomUrl: function(url) {
      // console.log('setting custom location');
      this.alternativeFiles.url = url;

      var newFiles = [];
      angular.forEach(hostedFiles, function(hostedFile, index) {
        if(hostedFile.region != alternativeFiles.region) {
          newFiles.push(hostedFile);
        }
      });
  
      newFiles.push(alternativeFiles);
      hostedFiles = newFiles;
      this.hostedFiles = newFiles;
    },
    
    setLocationByName: function(locationName) {
      var newLocation = null;
      
      angular.forEach(hostedFiles, function(hostedFile, index) {
        if(hostedFile.region == locationName) {
          newLocation = hostedFile;
        }
      });
        
      this.setLocation(newLocation);
    },
    
    setLocation: function(location) {
      if(location && location != this.dntLocation) {
        this.dntLocation = location;
      }
      
      var currentLocation = getLocationFromUrl();
      if(this.dntLocation && this.dntLocation.region != currentLocation) {
        var parts = $window.location.href.replace('//', '::').split('/');
        if(parts.length > 1 && parts[1] == 'dnskillsim') {
          console.log('running github', location);
          localStorage.setItem('lastDNTRegion', location.region);
          this.setTLocation(location);
          this.init();
        }
        else {
          console.log('running on heroku');
          var newUrl = $window.location.href.substring(0, parts[0].length) + '/' + this.dntLocation.region;
          for(var i=2;i<parts.length;++i) {
            newUrl += '/' + parts[i];
          }
          console.log('setting location to ', newUrl);
          $window.location.href = newUrl;
        }
      }
    },
    
    setTLocation: function(location) {
      
      if(location != this.tlocation) {
        
        this.tlocation = location;
        sessionStorage.removeItem('UIStrings');
        localStorage.removeItem('UIStrings_file');
        dntReset();
        translations.reset();
        if(location) {
          var override = this.getOverride();
          translations.small = !override;
          translations.location = this.tlocation.url;
          translations.init(function() {}, function() {
            $route.reload();
          });
        }
      }
    },
    
    init: function() {
      var urlLocation = getLocationFromUrl();
      if(urlLocation) {
        if(urlLocation == 'dnskillsim') {
          this.tlocation = this.dntLocation;
          translations.small = true;
          if(this.tlocation) {
            translations.location = this.tlocation.url;
          }
          dntData.setLocation(this.dntLocation);
          translations.init(function() {}, $timeout);
        }
        else {
          this.setLocationByName(urlLocation);
        }
      }
    },
    
    getOverride: function() {
      return false;
    }
  }
}

})();
