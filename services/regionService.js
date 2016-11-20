(function () {
'use strict';

angular.module('dnsim').factory('region', ['$window','$location', region]);
function region($window, $location) {
  
  var alternativeFiles = {region: 'ALT', name: 'Alternative user specified files', url : ''};
  var hostedFiles =[
      {region: 'sea', name: 'south east asia', url : 'https://seadnfiles.firebaseapp.com'},
      {region: 'na', name: 'north america', url : 'https://dnna.firebaseapp.com'},
      {region: 'eu', name: 'europe', url : 'https://eufiles.firebaseapp.com'},
      {region: 'ina', name: 'indonesia ', url : 'https://inafiles-da491.firebaseapp.com'},
      {region: 'th', name: 'thailand', url : 'https://thdnfiles.firebaseapp.com'},
      {region: 'tw', name: 'taiwan 臺灣', url : 'https://twdnfiles.firebaseapp.com'},
      {region: 'cdn', name: 'china 中國', url : 'https://cdnfiles.firebaseapp.com'},
      {region: 'kdn', name: 'korea 대한민국', url : 'https://kdnfiles.firebaseapp.com'},
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
        var newUrl = $window.location.href.substring(0, parts[0].length) + '/' + this.dntLocation.region;
        for(var i=2;i<parts.length;++i) {
          newUrl += '/' + parts[i];
        }
        $window.location.href = newUrl;
      }
    },
    
    init: function() {
      this.setLocationByName(getLocationFromUrl());
    },
    
    getOverride: function() {
      return false;
    }
  }
}

})();
