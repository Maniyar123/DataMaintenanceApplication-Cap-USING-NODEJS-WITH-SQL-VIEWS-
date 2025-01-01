sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'com.vcplocapp',
            componentId: 'LOCATION_STBObjectPage',
            contextPath: '/LOCATION_STB'
        },
        CustomPageDefinitions
    );
});