(function () {
'use strict';

angular.module('dnsim').directive('dnsimViewBuild', viewBuild);

function viewBuild() {
  return {
    restrict: 'E',
    scope: true,
    bindToController: {
      build: '=build',
    },
    templateUrl: 'ui/build/view-build.html',
    controllerAs: 'ctrl',
    controller: [viewBuildController],
  };
}

function viewBuildController() {
  
  var vm = this;

  vm.baseSkillNums = [];
  vm.specSkillNums = [];
  vm.finalSkillNums = [];
  vm.awakenSkillNums = [];
  setupSkillNums();

  function setupSkillNums() {
    for(var i=0;i<6*4;++i) {
      vm.baseSkillNums.push(getSkillNum(i));
    }
    
    for(i=6*4;i<6*4*2;++i) {
      vm.specSkillNums.push(getSkillNum(i));
    }
    
    for(i=6*4*2;i<6*4*3;++i) {
      vm.finalSkillNums.push(getSkillNum(i));
    }
    
    for(i=6*4*3;i<6*4*4;++i) {
      vm.awakenSkillNums.push(getSkillNum(i));
    }
  }
  
  function getSkillNum(index) {
    if(vm.build) {
      var chars = vm.build.build.replace(/[!\.']/g,'').split('');
      if(chars.length > index) {
        var char = chars[index];
        var num = parseInt(char, 36);
        if(num >= 0) {
          return num + 1;
        }
      }
      return ' ';
    }
  }
}

})();
