sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'com.vcplocapp',
            componentId: 'LOCATION_STBList',
            contextPath: '/LOCATION_STB'
        },
        CustomPageDefinitions
    );
});