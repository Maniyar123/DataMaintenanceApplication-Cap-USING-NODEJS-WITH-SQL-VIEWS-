sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/vcplocapp/test/integration/FirstJourney',
		'com/vcplocapp/test/integration/pages/LOCATION_STBList',
		'com/vcplocapp/test/integration/pages/LOCATION_STBObjectPage'
    ],
    function(JourneyRunner, opaJourney, LOCATION_STBList, LOCATION_STBObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/vcplocapp') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheLOCATION_STBList: LOCATION_STBList,
					onTheLOCATION_STBObjectPage: LOCATION_STBObjectPage
                }
            },
            opaJourney.run
        );
    }
);