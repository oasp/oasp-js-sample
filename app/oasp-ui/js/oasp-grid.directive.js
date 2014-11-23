angular.module('oasp-ui').
    directive('oaspGrid', function ($sce) {
        'use strict';
        
        // used to translate between oasp-grid and ui-grid interfaces
        var transcodeRows = function(rows) {
        	// identity at the moment
        	return rows;
        },
        transcodeColumnDefs = function(columnDefs) {
        	return columnDefs && columnDefs.map(function(colDef) {
        		return {
        			field: colDef.field,
        			name: colDef.label
        		}
        	});
        };
        
        
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'oasp-ui/html/oasp-grid.html',
            scope: {
                title: '@?',
                rows: '=',
                columnDefs: '=',
                buttonDefs: '=?',
                dblclickCallback: '&?'
            },
            
            link: function (scope) {
            	// row selection placeholder
                scope.rowSelection = (function () {
                    var selectedRow = null;

                    return {
                        select: function (row) {
                            selectedRow = row;
                        },
                        isSelected: function (row) {
                            return selectedRow === row;
                        },
                        getSelected: function () {
                            return selectedRow;
                        }
                    };
                }());
                
                scope.noTitleDefined = function () {
                    return !scope.title;
                };
                
                // buttons interface
                scope.onButtonClick = function (buttonDef) {
                    if (buttonDef && angular.isFunction(buttonDef.onClick)) {
                        buttonDef.onClick(scope.rowSelection.getSelected());
                    }
                };
                scope.isButtonDisabled = function (buttonDef) {
                    if (buttonDef && angular.isFunction(buttonDef.isActive)) {
                        return !buttonDef.isActive(scope.rowSelection.getSelected());
                    }
                    if (buttonDef && angular.isFunction(buttonDef.isNotActive)) {
                        return buttonDef.isNotActive(scope.rowSelection.getSelected());
                    }
                    return true;
                };
                scope.onRowDblClick = function (row) {
                    scope.dblclickCallback({row: row});
                };
                
                scope.render = function (row, column) {
                    var result;
                    if (angular.isFunction(column.renderer)) {
                        result = column.renderer(row, column);
                    } else {
                        result = '<span>' + (row[column.field] || '') + '</span>';
                    }
                    return $sce.trustAsHtml(result);
                };
                
                // will be referenced from uiGrid getExternalScopes()
                scope.uiGridScopeWrapper = {
                	onRowDblClick: function(row) {
                		scope.onRowDblClick(row.entity);
	                }
                };
                
                // ui-grid options
                scope.gridData = {
                	data: transcodeRows(scope.rows),
                	columnDefs: transcodeColumnDefs(scope.columnDefs),
                	
                	enableRowHeaderSelection: false,
                	multiSelect: false,
                	
                	onRegisterApi: function(gridApi) {
                		gridApi.selection.on.rowSelectionChanged(scope, function(row) {
                			scope.rowSelection.select(row.entity);
                		});
                	},
                	
                	// enable double-click action
                	rowTemplate:  '<div ng-repeat="col in colContainer.renderedColumns track by col.colDef.name"'
                				+ '  data-ng-dblclick="getExternalScopes().onRowDblClick(row)"'
                				// + '  data-ng-class="{\'selected-row\': getExternalScopes().rowSelection.isSelected(row)}">'
                				+ '  class="ui-grid-cell" ui-grid-cell>'
                				+ '</div>'


                };
            }
        };
    });