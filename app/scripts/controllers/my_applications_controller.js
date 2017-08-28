define(['./module'], function(controllers) {
    controllers.controller('MyApplicationsController', function($scope, API, User) {
        if (!User.getUser()) {
            $state.go('login');
        } else {
            $scope.username = User.getUser().Username;
        }

        API.getApplicationsByUsername($scope.username).then(function(res) {
            $scope.applications = res.data;
        });
    });
});
