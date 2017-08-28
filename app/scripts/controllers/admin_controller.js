define(['./module'], function(controllers) {
    controllers.controller('AdminController', function($scope, $state, API, User) {
        if (!User.getUser()) {
            $state.go('login');
        } else {
            $scope.username = User.getUser().Username;
        }
    });
});
