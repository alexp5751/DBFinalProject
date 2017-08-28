define(['./module'], function(controllers) {
    controllers.controller('MainController', function($scope, API, User) {
        if (!User.getUser()) {
            $state.go('login');
        } else {
            $scope.username = User.getUser().Username;
        }

        $scope.params = {
            'projects_only': false,
            'courses_only': false
        };
        $scope.params.categories = [];
        $scope.categoryOptions = [
            {
                index: 0,
                name: 'Category 1'
            }
        ];

        API.queryProjectsAndCourses({}).then(function(res) {
            $scope.items = res.data;
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

        $scope.years = [
            'Senior',
            'Junior',
            'Sophomore',
            'Freshman'
        ]

        $scope.addCategory = function() {
            $scope.categoryOptions.push({
                index: $scope.categoryOptions.length,
                name: 'Category ' + ($scope.categoryOptions.length + 1)
            });
        }

        $scope.removeCategory = function() {
            if ($scope.categoryOptions.length > 1) {
                $scope.categoryOptions.splice($scope.categoryOptions.length - 1, 1);
                if ($scope.params.categories[$scope.params.categories.length - 1]) {
                    $scope.params.categories.splice($scope.params.categories.length - 1, 1);
                }
            }
        }

        $scope.search = function(params) {
            console.log(params);
            if (params.categories.length == 0) {
                delete params.categories;
            }
            API.queryProjectsAndCourses(params).then(function(res) {
                $scope.items = res.data;
                if (!params['categories']) {
                    params.categories = []
                }
            });
        }

        $scope.reset = function() {
            $scope.params = {
                'categories': [],
                'projects_only': false,
                'courses_only': false
            };
            $scope.categoryOptions = [{
                index: 0,
                name: 'Category 1'
            }];
        }
    });
});
