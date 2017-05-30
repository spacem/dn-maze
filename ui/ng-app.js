(function () {
'use strict';

// templates are imported via gulp job
angular.module('templates', []);

var baseElement = angular.element(document).find('base');
if(baseElement.length == 1 && baseElement[0].href && baseElement[0].href.indexOf('/dnskillsim/') > 0) {
    angular.module('dnsim', ['ngRoute','angulartics','angulartics.google.analytics','templates', 'ngAria', 'infinite-scroll']);
    angular.module('dnsim').config(['$locationProvider', setupHtml5Mode]);
    angular.module('dnsim').config(['$compileProvider', allowAutoBindings]);
}
else {
    console.log('base', baseElement);
    angular.module('dnsim', ['ngRoute','templates']);
}

function allowAutoBindings($compileProvider) {
    // angular 1.6 requires use of $onInit unless this config is set
    // https://toddmotto.com/angular-1-6-is-here
    $compileProvider.preAssignBindingsEnabled(true);
};

function setupHtml5Mode($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true,
        rewriteLinks: true
    });
};

})();