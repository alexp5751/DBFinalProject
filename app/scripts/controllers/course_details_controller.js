define(['./module'], function (controllers) {
    controllers.controller('CourseDetailsController', function($scope, $stateParams, API) {
        var name = $stateParams.courseName;
        API.getCourseByName(name).then(function (res) {
            if (res.data.length > 0) {
                $scope.course = res.data[0];

                API.getCourseCategories($scope.course.CourseNumber).then(function (res) {
                    $scope.course.Categories = res.data;
                });
            }
        });
    });
});
