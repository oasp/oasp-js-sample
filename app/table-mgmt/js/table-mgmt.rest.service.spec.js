/*globals oasp*/
describe('Module: tableMgmt, Service: tableManagementRestService', function () {
    'use strict';
    var tableManagementRestService, contextPath = '/contextPath/';

    beforeEach(module('app.table-mgmt', function ($provide) {
        $provide.value('currentContextPath', oasp.mock.currentContextPathReturning(contextPath));
    }));

    beforeEach(inject(function (_tableManagementRestService_) {
        tableManagementRestService = _tableManagementRestService_;
    }));

    it('should call $http.get when tableManagementRestService.getTable is called', inject(function ($http) {
        //given
        var id = 'tableId';
        spyOn($http, 'get');
        //when
        tableManagementRestService.getTable(id);
        //then
        expect($http.get).toHaveBeenCalledWith(contextPath + 'services/rest/tablemanagement/v1/table/' + id);
    }));

    it('should call $http.get when tableManagementRestService.getAllTables is called', inject(function ($http) {
        //given
        spyOn($http, 'get');
        //when
        tableManagementRestService.getAllTables();
        //then
        expect($http.get).toHaveBeenCalledWith(contextPath + 'services/rest/tablemanagement/v1/table/');
    }));

    it('should call $http.put when tableManagementRestService.createTable is called', inject(function ($http) {
        //given
        var id = 'tableId', table = {state: 'FREE'};
        spyOn($http, 'put');
        //when
        tableManagementRestService.createTable(id, table);
        //then
        expect($http.put).toHaveBeenCalledWith(contextPath + 'services/rest/tablemanagement/v1/table/' + id, table);
    }));

    it('should call $http.delete when tableManagementRestService.deleteTable is called', inject(function ($http) {
        //given
        var id = 'tableId';
        spyOn($http, 'delete');
        //when
        tableManagementRestService.deleteTable(id);
        //then
        expect($http.delete).toHaveBeenCalledWith(contextPath + 'services/rest/tablemanagement/v1/table/' + id);
    }));

    it('should call $http.post when tableManagementRestService.marktableas is called', inject(function ($http) {
        //given
        var id = 'tableId', state = 'FREE';
        spyOn($http, 'post');
        //when
        tableManagementRestService.markTableAs(id, state);
        //then
        expect($http.post).toHaveBeenCalledWith(contextPath + 'services/rest/tablemanagement/v1/table/' + id + '/marktableas/' + state);
    }));

    it('should call $http.get when tableManagementRestService.isTableReleasable is called', inject(function ($http) {
        //given
        var id = 'tableId';
        spyOn($http, 'get');
        //when
        tableManagementRestService.isTableReleasable(id);
        //then
        expect($http.get).toHaveBeenCalledWith(contextPath + 'services/rest/tablemanagement/v1/table/' + id + '/istablereleasable/');
    }));
});