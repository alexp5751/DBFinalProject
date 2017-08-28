requirejs.config({
    baseUrl: '/scripts',
    paths: {
        'angular': [
            'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular',
            'lib/angular/angular'
        ],
        'angularAnimate': [
            'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular-sanitize.min',
            'lib/angular/angular-animate.min'
        ],
        'angularSanitize': [
            'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular-animate.min',
            'lib/angular/angular-sanitize.min'
        ],
        'angularTouch': [
            'https://cdnjs.cloudflare.com/ajax/libs/angular-touch/1.5.8/angular-touch.min',
            'lib/angular/angular-touch.min'
        ],
        'uiBootstrap': [
            'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.2.0/ui-bootstrap.min',
            'lib/angular/ui-bootstrap.min'
        ],
        'uiRouter': [
            'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.3.1/angular-ui-router.min',
            'lib/angular/ui-router.min'
        ],
        'jquery': [
            'https://code.jquery.com/jquery-2.2.4.min',
            'lib/jquery.min'
        ]
    },
    shim: {
        'angular': {
            deps: [ 'jquery' ],
            exports: 'angular'
        },
        'angularAnimate': [ 'angular' ],
        'angularSanitize': [ 'angular' ],
        'angularTouch': [ 'angular' ],
        'uiRouter': [ 'angular',  'jquery' ],
        'uiBootstrap': ['angular', 'jquery', 'angularAnimate', 'angularTouch']
    }
});

require([
	'angular',
	'app',
    'routes',
	], function(angular, app) {
		var $html = angular.element(document.getElementsByTagName('html')[0]);
		angular.element().ready(function() {
			angular.bootstrap(document, ['team78App']);
		});
	}
);
