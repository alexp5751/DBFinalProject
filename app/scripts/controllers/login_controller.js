define(['./module'], function (controllers) {
    controllers.controller('LoginController', function($scope, $state, API, User) {
        $scope.authMessage = '';
        $scope.authClass = '';
        $scope.credentials = {
            'username': '',
            'password': ''
        };

        $scope.login = function (credentials) {
            $scope.authClass = 'alert alert-warning';
            $scope.authMessage = 'Attempting to log in...';
            API.login(credentials).then(function(res) {
                $scope.authClass = 'alert alert-success';
                $scope.authMessage = 'Successfully logged in.';
                User.setUser({
                    Username: credentials.username
                });
                if (res.data[0].UserType == 'Admin') {
                    $state.go('admin_main')
                } else {
                    $state.go('main');
                }
            }, function (err) {
                if (err.status == 401) {
                    $scope.authClass = 'alert alert-danger';
                    $scope.authMessage = 'Username or password incorrect.';
                } else {
                    $scope.authClass = 'alert alert-danger';
                    $scope.authMessage = 'Something went wrong...';
                }
            });
        }
    });
})
