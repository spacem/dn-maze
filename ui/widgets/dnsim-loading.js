(function () {
'use strict';

angular.module('dnsim').directive('dnsimLoading', ['dntData','translations','$timeout', 'region', dnsimLoading]);

function dnsimLoading(dntData, translations, $timeout, region) {
  'use strict';
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      alsoShowFor: '=alsoShowFor',
    },
    templateUrl: 'ui/widgets/dnsim-loading.html',
    link: function($scope, element, attrs) {
      $scope.$on('TRANSLATION_LOAD_EVENT', function() {
        $scope.setLoadCount();
      });
      
      $scope.$on('DNTDATA_LOAD_EVENT', function() {
        $scope.setLoadCount();
      });
      
      $scope.$on('DNTDATA_LOAD_ERROR', function() {
        $timeout(function() {
          $scope.loadError = true;
        });
      });
      
      $scope.$on('TRANSLATION_LOAD_ERROR', function() {
        $timeout(function() {
          $scope.loadError = true;
        });
      });

      $scope.numLoading = 0;
      $scope.setLoadCount = function() {
        $scope.noRegion = !region.dntLocation;
        
        var n = dntData.anyLoading();
        if(!translations.isLoaded())
        {
          n++;
        }
        
        $timeout(function() {
          if($scope.numLoading < n || !$scope.totalToLoad) {
            $scope.totalToLoad = n;
          }
          $scope.numLoading = n;
        });
      };
      
      $scope.loadError = false;
      $scope.setLoadCount();
    },
  };
}

})();