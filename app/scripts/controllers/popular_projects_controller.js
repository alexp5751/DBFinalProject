define(['./module'], function(controllers) {
    controllers.controller('PopularProjectsController', function($scope, $state, API, User) {
        if (!User.getUser()) {
            $state.go('login');
        } else {
            $scope.username = User.getUser().Username;
        }

        API.getProjectsByNumApplicants().then(function(res) {
            $scope.items = res.data;
        });
    });
});
