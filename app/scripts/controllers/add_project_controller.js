define(['./module'], function(controllers) {
    controllers.controller('AddProjectController', function($scope, $state, API, User) {
        if (!User.getUser()) {
            $state.go('login');
        } else {
            $scope.username = User.getUser().Username;
        }

        $scope.message = '';
        $scope.messageClass = '';

        $scope.project = {};
        $scope.categoryOptions = [{
            index: 0,
            name: 'Category 1'
        }];
        $scope.years = [
            'Senior',
            'Junior',
            'Sophomore',
            'Freshman'
        ]

        API.getMajors().then(function(res) {
            $scope.majors = res.data;
        });

        API.getDepartments().then(function(res) {
            $scope.departments = res.data;
        });

        API.getDesignations().then(function(res) {
            $scope.designations = res.data;
        });

        API.getMajors().then(function(res) {
            $scope.majors = res.data;
        });

        API.getCategories().then(function(res) {
            $scope.categories = res.data;
        });

        $scope.addCategory = function() {
            $scope.categoryOptions.push({
                index: $scope.categoryOptions.length,
                name: 'Category ' + ($scope.categoryOptions.length + 1)
            });
        }

        $scope.removeCategory = function() {
            if ($scope.categoryOptions.length > 1) {
                $scope.categoryOptions.splice($scope.categoryOptions.length - 1, 1);
                if ($scope.project.categories[$scope.project.categories.length - 1]) {
                    $scope.project.categories.splice($scope.project.categories.length - 1, 1);
                }
            }
        }

        $scope.create = function(project) {
            $scope.message = 'Creating project...';
            $scope.messageClass = 'alert alert-info';
            API.createProject(project).then(function(res) {
                $scope.message = 'Project successfully created.';
                $scope.messageClass = 'alert alert-success';
            }, function (err) {
                if (err.status == 400) {
                    $scope.message = 'Please fill out all required fields.';
                    $scope.messageClass = 'alert alert-danger';
                } else {
                    $scope.message = 'There is already a project with that name.';
                    $scope.messageClass = 'alert alert-danger';
                }
            })
        }

        $scope.reset = function() {
            $scope.project = {
                'categories': []
            };
            $scope.categoryOptions = [{
                index: 0,
                name: 'Category 1'
            }];
        }
    });
});
