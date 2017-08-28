define(['./module'], function(controllers) {
    controllers.controller('RegisterController', function($scope, $state, API, User) {
        $scope.successMessage = '';
        $scope.successClass = '';
        $scope.credentials = {
            'username': '',
            'gtEmail': '',
            'password': '',
            'confirmPassword': ''
        }

        $scope.register = function(credentials) {
            $scope.successMessage = 'Attempting to create new user...';
            $scope.successClass = 'alert alert-warning';
            API.register(credentials).then(function(res) {
                $scope.successMessage = 'New user successfully created.';
                $scope.successClass = 'alert alert-success';
                User.setUser({
                    Username: credentials.username
                });
                $state.go('main');
            }, function(err) {
                if (err.status == 409) {
                    $scope.successMessage = 'User with this username or email already exists.';
                    $scope.successClass = 'alert alert-danger';
                } else if (err.status == 400) {
                    $scope.successMessage = 'Failed to create new user. Not all fields filled.';
                    $scope.successClass = 'alert alert-danger';
                } else {
                    $scope.successMessage = 'Failed to create new user.';
                    $scope.successClass = 'alert alert-danger';
                }
            });
        }
    });
})
