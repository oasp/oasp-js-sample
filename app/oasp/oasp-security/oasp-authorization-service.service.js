angular.module('oasp.oaspSecurity')
    .provider('oaspAuthorizationService', function () {
        'use strict';
        var config = {
                appContextServiceName: 'appContext'
            },
            roleMapping,
            transformToRolesArray = function (roles) {
                if (angular.isString(roles)) {
                    return [roles];
                } else if (angular.isArray(roles)) {
                    return roles;
                } else {
                    throw new Error('String or array of strings expected');
                }
            };

        return {
            setAppContextServiceName: function (appContextServiceName) {
                config.appContextServiceName = appContextServiceName || config.appContextServiceName;
            },
            mapRoles: function (serverNamesToAppNames) {
                roleMapping = serverNamesToAppNames;
            },
            usersHavingAnyRoleOf: function (roles) {
                var roleList = transformToRolesArray(roles);
                return {
                    mayGoToStateDefinedAs: function (stateDef) {
                        var resolve;
                        if (stateDef) {
                            resolve = stateDef.resolve || {};
                            /* @ngInject */
                            resolve.authorize = function (oaspAuthorizationService) {
                                return oaspAuthorizationService.authorizationCheckResolver(roleList);
                            };
                        }
                        return stateDef;
                    }
                };
            },
            $get: function ($q, $log, $injector) {
                var getAppContextService = function () {
                        return $injector.get(config.appContextServiceName);
                    },
                    userHasAnyRole = function (requestedRoles) {
                        return getAppContextService().getUserRoles().then(
                            function (userRoles) {
                                if (userRoles) {
                                    var userRolesArray = transformToRolesArray(userRoles),
                                        requestedRolesArray = transformToRolesArray(requestedRoles);
                                    var userHasRole = function (role) {
                                        return userRolesArray.indexOf(role) !== -1;
                                    };
                                    var i;
                                    for (i = 0; i < requestedRolesArray.length; i++) {
                                        if (userHasRole(requestedRolesArray[i])) {
                                            return true;
                                        }
                                    }
                                }
                                return false;
                            });
                    };
                return {
                    authorizationCheckResolver: function (requestedRoles) {
                        var deferredAuthorizationCheck = $q.defer();

                        userHasAnyRole(requestedRoles).then(function (authorized) {
                            if (authorized) {
                                return deferredAuthorizationCheck.resolve(true);
                            } else {
                                $log.warn('Access denied. Any role of \'' + requestedRoles + '\' required to go to this state');
                                deferredAuthorizationCheck.reject();
                            }
                        });

                        return deferredAuthorizationCheck.promise;
                    },
                    userHasAnyRole: userHasAnyRole
                };
            }
        };
    });
