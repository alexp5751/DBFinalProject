define(['./module', './api'], function(services) {
    services.factory('User', function($window, API) {
        return {
            setUser: function(user) {
                $window.sessionStorage.user = JSON.stringify(user);
            },

            getUser: function() {
                if ($window.sessionStorage.user) {
                    return JSON.parse($window.sessionStorage.user);
                }
            }
        }
    });
})
