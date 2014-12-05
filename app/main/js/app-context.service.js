angular.module('app.main')
    .factory('appContext', function () {
        'use strict';
        var currentUserInternal = {
                isLoggedIn: false
            },
            currentUserExternal = (function (currentUser) {
                return {
                    isLoggedIn: function () {
                        return currentUser.isLoggedIn;
                    },
                    getUserName: function () {
                        var userName = '';
                        if (currentUser.profile && currentUser.profile.firstName && currentUser.profile.lastName) {
                            userName = currentUser.profile.firstName + ' ' + currentUser.profile.lastName;
                        }
                        return userName;
                    },
                    getHomeDialogPath: function () {
                        return (currentUser.profile && currentUser.profile.homeDialogPath) || '';
                    }
                };
            }(currentUserInternal)),
            updateUserProfile = function (userProfile) {
                currentUserInternal.isLoggedIn = true;
                currentUserInternal.profile = userProfile;
                // TODO remove it once implemented on the server
                if (angular.isUndefined(userProfile.homeDialogPath)) {
                    if (userProfile.role === 'WAITER') {
                        currentUserInternal.profile.homeDialogPath = '/table-mgmt/table-search';
                    } else if (userProfile.role === 'COOK') {
                        currentUserInternal.profile.homeDialogPath = '/cook-order-mgmt/order-view';
                    } else {
                        // TODO: add rest (+ default?) roles and dialogs
                        currentUserInternal.profile.homeDialogPath = '/table-mgmt/table-search';
                    }
                }
            },
            switchToAnonymousUser = function () {
                currentUserInternal.isLoggedIn = false;
                currentUserInternal.profile = undefined;
            };

        return {
            getCurrentUser: function () {
                return currentUserExternal;
            },
            onLoggingIn: function (currentUser) {
                updateUserProfile(currentUser);
            },
            onLoggingOff: function () {
                switchToAnonymousUser();
            }
        };
    });
