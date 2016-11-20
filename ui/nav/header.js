angular.module('dnsim').controller('HeaderCtrl', 
[
  function() {
    'use strict';
    var vm = this;
  }
]).directive('dngearsimHeader', function() {
  return {
    templateUrl: 'ui/nav/header.html',
  };
});