(function () {
'use strict';

// templates are imported via gulp job
angular.module('templates', []);

var baseElement = angular.element(document).find('base');
if(baseElement.length) {
    angular.module('dnsim', ['ngRoute','angulartics','angulartics.google.analytics','templates', 'ngAria', 'infinite-scroll']);
    angular.module('dnsim').config(['$locationProvider', setupHtml5Mode]);
}
else {
    angular.module('dnsim', ['ngRoute','templates']);
}

function setupHtml5Mode($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true,
        rewriteLinks: true
    });
};

})();