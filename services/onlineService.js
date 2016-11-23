(function () {
'use strict';

angular.module('dnsim').factory('onlineService', ['$window','$q',onlineService]);

function onlineService($window, $q) {
  console.log('setup online service');
  
  var service = {
    login: login,
    getUser: function() {
      return firebase.auth().currentUser;
    },
    signOut: signOut,
    deleteAccount: deleteAccount,
    
    getUserBuilds: getUserBuilds,
    deleteBuild: deleteBuild,
    saveBuild: saveBuild,
    getBuild: getBuild,
    getClassBuilds: getClassBuilds,
    
    getProfile: getProfile,
    saveProfile: saveProfile,
    
    stripBuildName: stripBuildName
  };
  
  init();
  
  return service;
  
  function init() {
    console.log('init');
    firebase.initializeApp({
      apiKey: "AIzaSyC-Mckgho1xAI2SQzsKnpsr2ObDKOhdSrE",
      authDomain: "dngearsim.firebaseapp.com",
      databaseURL: "https://dngearsim.firebaseio.com",
      storageBucket: "dngearsim.appspot.com",
    });
  }
  
  function login() {
    return $q(function(resolve, reject) {
      var auth = firebase.auth();
        
      auth.onAuthStateChanged(function(user) {
        if(user == null) {
          console.log('redirecting');
          $window.location.href = 'login.html';
        }
        else {
          console.log('logged in');
          resolve(user);
        }
      });
    });
  }
  
  function getProfile(uid) {
    console.log('get profile');
    return $q(function(resolve, reject) {
      firebase.database().ref('profile/' + uid).once('value', function(storedProfile) {
        if(storedProfile) {
          resolve(storedProfile.val());
        }
        else {
          resolve({});
        }
      });
    });
  }
  
  function getBuild(uid, buildName) {
    console.log('get build');
    return $q(function(resolve, reject) {
      firebase.database().ref('skill-builds/' + uid + '/' + stripBuildName(buildName)).once('value', function(storedProfile) {
        if(storedProfile) {
          resolve(decompressBuild(storedProfile.val()));
        }
        else {
          resolve({});
        }
      });
    });
  }
  
  function saveProfile(profile) {
    return $q(function(resolve, reject) {
      var user = service.getUser();
      if(user) {
        profile = angular.copy(profile);
        deleteNullProperties(profile, true);
        firebase.database().ref('profile/' + user.uid).set(profile).then(resolve);
      }
    });
  }
  
  function getUserBuilds(uid) {
    console.log('get builds');
    return $q(function(resolve, reject) {
      console.log('getting builds');
      firebase.database().ref('skill-builds/' + uid).once('value', function(storedBuilds) {
        if(storedBuilds) {
          var retVal = {};
          var val = storedBuilds.val();
          for(var buildName in val) {
            retVal[buildName] = decompressBuild(val[buildName]);
          }
          resolve(retVal);
        }
        else {
          resolve({});
        }
      });
    });
  }
  
  function getClassBuilds(job) {
    console.log('get class builds');
    return $q(function(resolve, reject) {
      console.log('getting builds', job.id);
      firebase.database().ref('job-skill-builds/' + job.id).once('value', function(jobBuilds) {
        console.log('ok');
        if(jobBuilds) {
          resolve(jobBuilds.val());
        }
        else {
          resolve({});
        }
      });
    });
  }
  
  function compressBuild(build) {
    
    if(build.items) {
      _.each(build.items, function(item) {
        delete item.fullStats;
      });
    }
    
    var stringifiedData = JSON.stringify(build);
    return LZString.compressToUTF16(stringifiedData);
  }
  
  function decompressBuild(compressedBuild) {
    var stringifiedData = LZString.decompressFromUTF16(compressedBuild);
    var build = JSON.parse(stringifiedData);
    
    if(build.items) {
      _.each(build.items, function(item) {
        item.fullStats = item.stats;
        
        if(item.enchantmentStats && item.enchantmentStats.length) {
          item.fullStats = hCodeValues.mergeStats(item.enchantmentStats, item.fullStats);
        }
        
        if(item.sparkStats && item.sparkStats.length) {
          item.fullStats = hCodeValues.mergeStats(item.sparkStats, item.fullStats);
        }
      });
    }
    
    return build;
  }
  
  function saveBuild(buildName, build) {
    var user = service.getUser();
    var actions = [];
    if(user) {
      build = angular.copy(build);
      deleteNullProperties(build, true);
      // console.log('saving', build);
      actions.push(
        firebase.database().ref('skill-builds/' + user.uid + '/' + stripBuildName(buildName)).set(compressBuild(build))
      );
      
      if(build.job) {
        console.log('saving build');
          
        var data = {};
        if(build.region) {
          data.region = build.region;
        }
        if(build.guild) {
          data.guild = build.guild;
        }
        if(build.about) {
          data.about = build.about;
        }
        
        deleteNullProperties(data, true);
          
        actions.push(
          firebase.database().ref('job-skill-builds/' + build.job + '/' + user.uid + '/' + stripBuildName(buildName)).set(data)
        );
      }
    }
    return $q.all(actions);
  }
  
  function deleteNullProperties(test, recurse) {
    for (var i in test) {
        if (test[i] === undefined) {
            delete test[i];
        } else if (recurse && typeof test[i] === 'object') {
            deleteNullProperties(test[i], recurse);
        }
    }
  }
  
  function signOut() {
    var auth = firebase.auth();
    return $q(function(resolve, reject) {
      auth.signOut().then(function() {
        resolve();
      }, function(error) {
        reject();
      });
    });
  }
  
  function deleteAccount(builds) {
    var auth = firebase.auth();
    var user = service.getUser();
    
    return $q(function(resolve, reject) {
      
      var pList = [
        firebase.database().ref('builds/' + user.uid).remove(),
        firebase.database().ref('skill-builds/' + user.uid).remove(),
        firebase.database().ref('profile/' + user.uid).remove(),
        firebase.database().ref('private/' + user.uid).remove()];
        
      var jobIds = [];
      for(var buildName in builds) {
        if(builds[buildName].job) {
          jobIds.push(builds[buildName].job);
        }
      }
      
      jobIds = _.uniq(jobIds);
      _.each(jobIds, function(id) {
        pList.push(
          firebase.database().ref('job-builds/' + id + '/' + user.uid).remove()
        );
        pList.push(
          firebase.database().ref('job-skill-builds/' + id + '/' + user.uid).remove()
        )
      });
        
      $q.all(pList).then(function() {
        console.log('deleted data');
        user.delete().then(function() {
          console.log('deleted user');
          auth.signOut().then(function() {
            console.log('signed out');
            resolve();
          }, function(error) {
            reject();
          });
        });
      });
    });
  }
  
  function deleteBuild(buildName, build) {
    
    var pList = [];
    var user = service.getUser();
    if(user) {
      pList.push(
        firebase.database().ref('skill-builds/' + user.uid + '/' + stripBuildName(buildName)).remove());
      
      if(build.job) {
        pList.push(
          firebase.database().ref('job-skill-builds/' + build.job + '/' + user.uid + '/' + stripBuildName(buildName)).remove());
      }
    }
    
    return $q.all(pList);
  }
  
  function stripBuildName(buildName) {
    return buildName.replace(/[.$\[\]#\/]/g, '');
  }
}

})();