(function () {
'use strict';

angular.module('dnsim').factory('region', ['$window','$location', region]);
function region($window, $location) {
  
  var alternativeFiles = {region: 'ALT', name: 'Alternative user specified files', url : ''};
  var hostedFiles =[
      {region: 'na', name: 'english files from nexon north america', url : 'https://dnna.firebaseapp.com'},
      {region: 'kdn', name: 'korean files from pupu', url : 'https://kdnfiles.firebaseapp.com'},
      {region: 'cdn', name: 'chinese files from shanda', url : 'https://cdnfiles.firebaseapp.com'},
      {region: 'sea', name: 'south east asia - english files from cherry credits', url : 'https://seadnfiles.firebaseapp.com'},
      {region: 'eu', name: 'europe - english files from cherry credits', url : 'https://eufiles.firebaseapp.com'},
      {region: 'ina', name: 'indonesian files from gemscool', url : 'https://inafiles-da491.firebaseapp.com'},
    ];
  
  var dntLocationRegion = localStorage.getItem('lastDNTRegion');
  var dntLocation = hostedFiles[0];
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
      if(this.dntLocation.region != currentLocation) {
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
    }
  }
}

})();