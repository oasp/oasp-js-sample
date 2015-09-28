angular.module('app.sales-mgmt', ['app.main', 'app.offer-mgmt', 'app.sales-mgmt.templates'])
    .config(function ($stateProvider, oaspAuthorizationServiceProvider, ROLES) {
        'use strict';

        $stateProvider.state('salesMgmt', {
            abstract: true,
            url: '/sales-mgmt',
            template: '<ui-view/>'
        });

        $stateProvider.state('salesMgmt.cookPositions',
            oaspAuthorizationServiceProvider.usersHavingAnyRoleOf(ROLES.COOK).mayGoToStateDefinedAs(
                {
                    url: '/cook-positions',
                    templateUrl: 'sales-mgmt/cook-positions/cook-positions.html',
                    controller: 'CookPositionsCntl',
                    resolve: {
                        currentPositions: ['positions', function (positions) {
                            return positions.get();
                        }]
                    }
                }
            )
        );
    });

