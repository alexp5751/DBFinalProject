define(['./module'], function(controllers) {
    controllers.controller('ProjectDetailsController', function($scope, $stateParams, API, User) {
        if (!User.getUser()) {
            $state.go('login');
        } else {
            $scope.username = User.getUser().Username;
        }

        $scope.applyButtonHide = false;
        $scope.successMessage = '';
        $scope.successClass = '';

        var name = $stateParams.projectName;
        API.getProjectByName(name).then(function(res) {
            if (res.data) {
                $scope.project = res.data[0];

                API.getProjectCategories(name).then(function(res) {
                    $scope.project.Categories = res.data;
                });

                API.getProjectRequirements(name).then(function(res) {
                    $scope.project.Requirements = res.data;
                });

                API.getUserByUsername($scope.username).then(function(res) {
                    if (res.data[0].Major == null || res.data[0].Year == null) {
                        $scope.undeclared = true;
                    }
                });

                API.getApplicationByUsernameAndProjectName($scope.username, name).then(function(res) {
                    $scope.alreadyApplied = res.data.length == 1;
                    if ($scope.alreadyApplied) {
                        $scope.status = res.data[0].Status;
                    }
                });
            }
        });



        $scope.apply = function() {
            $scope.successMessage = 'Attempting to apply for project...';
            $scope.successClass = 'alert alert-warning';
            API.applyForProject($scope.username, $scope.project.ProjectName).then(function(res) {
                $scope.applyButtonHide = true;
                $scope.successMessage = 'Successfully applied to this project.';
                $scope.successClass = 'alert alert-success';
            }, function(err) {
                if (err.status == 409) {
                    $scope.successMessage = 'You have already applied to this project.';
                    $scope.successClass = 'alert alert-danger';
                } else if (err.status == 401) {
                    $scope.successMessage = 'You do not meet this project\'s requirements.';
                    $scope.successClass = 'alert alert-danger';
                }
            });
        }
    });
});
