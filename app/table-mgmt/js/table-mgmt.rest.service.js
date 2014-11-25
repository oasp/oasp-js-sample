angular.module('app.tableMgmt').factory('tableManagementRestService', function ($http, currentContextPath) {
    'use strict';

    var servicePath = currentContextPath.get() + 'services/rest/tablemanagement';

    return {
        getTable: function (id) {
            return $http.get(servicePath + '/table/' + id);
        },
        getAllTables: function () {
            return $http.get(servicePath + '/table/');
        },
        createTable: function (id, table) {
            return $http.put(servicePath + '/table/' + id, table);
        },
        deleteTable: function (id) {
            return $http.delete(servicePath + '/table/' + id);
        },
        markTableAs: function (id, state) {
            return $http.post(servicePath + '/table/' + id + '/marktableas' + state);
        },
        isTableReleasable: function (id) {
            return $http.get(servicePath + '/table/' + id + '/istablereleasable/');
        }
    };
});
