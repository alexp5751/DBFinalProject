define(['app'], function(app) {
    return app.config(function($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/login');
        $stateProvider.state('login', {
            url: '/login',
            templateUrl: 'partials/login.html',
        }).state('register', {
            url: '/register',
            templateUrl: 'partials/register.html'
        }).state('main', {
            url: '/main',
            templateUrl: 'partials/main.html'
        }).state('me', {
            url: '/me',
            templateUrl: 'partials/me.html'
        }).state('my_applications', {
            url: '/my_applications',
            templateUrl: 'partials/my_applications.html'
        }).state('project', {
            url: '/project/:projectName',
            templateUrl: 'partials/project_details.html'
        }).state('course', {
            url: '/course/:courseName',
            templateUrl: 'partials/course_details.html'
        }).state('edit_profile', {
            url: '/edit_profile',
            templateUrl: 'partials/edit_profile.html'
        }).state('admin_main', {
            url: '/admin',
            templateUrl: 'partials/admin_main.html'
        }).state('all_applications', {
            url: '/admin/all-applications',
            templateUrl: 'partials/all_applications.html'
        }).state('popular_projects_report', {
            url: '/admin/popular-projects-report',
            templateUrl: 'partials/popular_projects_report.html'
        }).state('application_report', {
            url: '/admin/application-report',
            templateUrl: 'partials/applications_report.html'
        }).state('add_project', {
            url: '/admin/add_project',
            templateUrl: 'partials/add_project.html'
        }).state('add_course', {
            url: '/admin/add_course',
            templateUrl: 'partials/add_course.html'
        });
    });
});
