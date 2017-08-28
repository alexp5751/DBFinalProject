define(['./module'], function(controllers) {
    controllers.controller('EditProfileController', function($scope, API, User) {
        if (!User.getUser()) {
            $state.go('login');
        } else {
            $scope.username = User.getUser().Username;
        }

        $scope.messageClass = '';
        $scope.message = '';

        API.getMajors().then(function(res) {
            $scope.majors = res.data;
        });

        API.getUserByUsername($scope.username).then(function(res) {
            $scope.user = res.data[0];
            $scope.updateDept();
        });

        $scope.updateDept = function() {
            API.getDepartmentByMajor($scope.user.Major).then(function(res) {
                $scope.department = res.data[0];
            });
        }

        $scope.editProfile = function() {
            $scope.messageClass = 'alert alert-warning';
            $scope.message = 'Attempting to edit user...';
            API.updateUser($scope.user).then(function(res) {
                $scope.messageClass = 'alert alert-success';
                $scope.message = 'Successfully updated user.';
            }, function(error) {
                $scope.messageClass = 'alert alert-danger';
                $scope.message = 'Failed to update user.';
            });
        }
    });
});
