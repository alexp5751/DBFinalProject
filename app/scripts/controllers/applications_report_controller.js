define(['./module'], function(controllers) {
    controllers.controller('ApplicationsReportController', function($scope, $state, API, User) {
        if (!User.getUser()) {
            $state.go('login');
        } else {
            $scope.username = User.getUser().Username;
        }

        API.getApplicationsReport().then(function(res) {
            $scope.items = res.data;
        });

        API.getTotalApplications().then(function(res) {
            $scope.applicationCounts = res.data[0];
        });
    });
});
