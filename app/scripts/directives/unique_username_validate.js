define(['./module'], function (directives) {
    directives.directive('uniqueUsername', function($q, API) {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$asyncValidators.uniqueUsername = function(modelValue, viewValue) {
                    if (ctrl.$isEmpty(modelValue)) {
                        return $q.when();
                    }

                    var def = $q.defer();
                    API.getUserByUsername(modelValue).then(function (res) {
                        if (res.data.length > 0) {
                            def.reject('Username already exists.')
                        } else {
                            def.resolve(res);
                        }
                    }, function (err) {
                        def.reject(err);
                    });
                    return def.promise;
                };
            }
        };
    });
})
