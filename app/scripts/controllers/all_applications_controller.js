define(['./module'], function(controllers) {
    controllers.controller('AllApplicationsController', function($scope, $state, API, User) {
        if (!User.getUser()) {
            $state.go('login');
        } else {
            $scope.username = User.getUser().Username;
        }

        API.getApplications().then(function(res) {
            $scope.items = res.data;
        });

        $scope.accept = function(item) {
            API.updateApplication(item.Username, item.ProjectName, 'Accepted').then(function(res) {
                item.Status = res.data[0].Status;
            });
        }

        $scope.reject = function(item) {
            API.updateApplication(item.Username, item.ProjectName, 'Rejected').then(function(res) {
                item.Status = res.data[0].Status;
            });
        }
    });
});
