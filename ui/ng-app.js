(function () {
'use strict';

// templates are imported via gulp job
angular.module('templates', []);
angular.module('dnsim', ['ngRoute','angulartics','angulartics.google.analytics','templates', 'ngAria', 'infinite-scroll']);

var baseElement = angular.element(document).find('base');

if(baseElement.length) {
    angular.module('dnsim').config(['$locationProvider', setupHtml5Mode]);
}

function setupHtml5Mode($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true,
        rewriteLinks: true
    });
};

})();