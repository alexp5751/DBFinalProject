define(['./module'], function(controllers) {
    controllers.controller('AddCourseController', function($scope, $state, API, User) {
        if (!User.getUser()) {
            $state.go('login');
        } else {
            $scope.username = User.getUser().Username;
        }

        $scope.message = '';
        $scope.messageClass = '';

        $scope.course = {};
        $scope.categoryOptions = [{
            index: 0,
            name: 'Category 1'
        }];

        API.getDesignations().then(function(res) {
            $scope.designations = res.data;
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
                if ($scope.course.categories[$scope.course.categories.length - 1]) {
                    $scope.course.categories.splice($scope.course.categories.length - 1, 1);
                }
            }
        }

        $scope.create = function(course) {
            $scope.message = 'Creating course...';
            $scope.messageClass = 'alert alert-info';
            API.createCourse(course).then(function(res) {
                $scope.message = 'Course successfully created.';
                $scope.messageClass = 'alert alert-success';
            }, function (err) {
                if (err.status == 400) {
                    $scope.message = 'Please fill out all required fields.';
                    $scope.messageClass = 'alert alert-danger';
                } else {
                    $scope.message = 'There is already a course with that name.';
                    $scope.messageClass = 'alert alert-danger';
                }
            })
        }

        $scope.reset = function() {
            $scope.course = {};
            $scope.categoryOptions = [{
                index: 0,
                name: 'Category 1'
            }];
        }
    });
});
