'use strict';

define([
	'angular',
	'angularAnimate',
	'angularSanitize',
    'angularTouch',
    'uiRouter',
    'uiBootstrap',
    'controllers/app.controllers',
    'directives/app.directives',
	'services/app.services'
], function(angular) {
	return angular.module('team78App', [
		'ngAnimate',
        'ngSanitize',
        'ngTouch',
        'ui.router',
        'ui.bootstrap',
        'app.controllers',
        'app.services',
	    	'app.directives'
	])
});
