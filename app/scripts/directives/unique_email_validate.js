define(['./module'], function (directives) {
    directives.directive('uniqueEmail', function($q, API) {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$asyncValidators.uniqueEmail = function(modelValue, viewValue) {
                    if (ctrl.$isEmpty(modelValue)) {
                        return $q.when();
                    }

                    var def = $q.defer();
                    API.getUserByEmail(modelValue).then(function (res) {
                      if (res.data.length > 0) {
                          def.reject('Email already exists.')
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
