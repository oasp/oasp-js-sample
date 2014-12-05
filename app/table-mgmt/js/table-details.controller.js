angular.module('app.table-mgmt').controller('TableDetailsCntl',
    function ($scope, $sce, tableDetails, allOffers, currentOrder, sales, globalSpinner) {
        'use strict';
        $scope.table = tableDetails;
        $scope.allOffers = allOffers;
        $scope.model = {};
        $scope.model.order = currentOrder;
        $scope.model.selected = allOffers.length ? allOffers[0] : undefined;

        $scope.trustAsHtml = function (value) {
            return $sce.trustAsHtml(value);
        };

        $scope.noOrderAssigned = function () {
            return !$scope.model.order;
        };
        $scope.orderAssigned = function () {
            return !$scope.noOrderAssigned();
        };
        $scope.assignNewOrder = function () {
            $scope.model.order = {
                order: {
                    tableId: $scope.table.id,
                    state: 'OPEN'
                },
                positions: []
            };
        };
        $scope.columnDefs = [
            {
                field: 'id',
                label: 'Number'
            },
            {
                field: 'offerName',
                label: 'Title'
            },
            {
                field: 'state',
                label: 'Status'
            },
            {
                field: 'price',
                label: 'Price',
                renderer: function (row) {
                    return row.price ? '<span>' + row.price + ' EUR</span>' : '';
                }
            },
            {
                field: 'comment',
                label: 'Comment'
            }
        ];

        // form container to access forms added in parent scopes
        $scope.forms = {};

        $scope.submit = function () {
            globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                return sales.saveOrUpdateOrder($scope.model.order);
            }).then(function () {
                $scope.$close();
            });
        };
        $scope.addPosition = function (offer) {
            $scope.model.order.positions.push({
                revision: null,
                orderId: $scope.model.order.order.id,
                offerId: null,
                offerName: offer.description,
                state: 'ORDERED',
                price: offer.currentPrice,
                comment: ''
            });
        };
        $scope.buttonDefs = [
            {
                label: 'Remove',
                onClick: function (selectedPosition) {
                    $scope.model.order.positions.splice($scope.model.order.positions.indexOf(selectedPosition), 1);
                },
                isNotActive: function (selectedRow) {
                    return selectedRow === null;
                }
            }
        ];
    });
