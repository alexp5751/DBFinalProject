define(['./module'], function(controllers) {
    controllers.controller('MeController', function($scope, $state, API, User) {
        if (!User.getUser()) {
            $state.go('login');
        } else {
            $scope.username = User.getUser().Username;
        }
    });
});
