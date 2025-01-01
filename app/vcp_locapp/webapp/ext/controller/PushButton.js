sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';
    var that;

    return {
        onPressPushButton: function(oEvent) {
            // Show a message that the push button has been clicked
            that = this;

            // Get the OData model
            var oModel = that.getModel('vmodel'); // Replace 'vcpmodel' with your actual model name if needed

            // Read the records from LOCATION_STB
            oModel.read("/LOCATION_STB", {
                success: function(oData) {
                    var aData = oData.results;

                    if (aData.length === 0) {
                        MessageToast.show("No records available to push.");
                        return;
                    }

                    // Loop through the records and create new entries in STAGE_LOC
                    aData.forEach(function(oRecord) {
                        var oNewRecord = {
                            LOCATION_ID: oRecord.LOCATION_ID,
                            LOCATION_DESC: oRecord.LOCATION_DESC,
                            LOCATION_TYPE: oRecord.LOCATION_TYPE,
                            LATITUDE: oRecord.LATITUDE,
                            LONGITUTE: oRecord.LONGITUTE,
                            RESERVE_FIELD1: oRecord.RESERVE_FIELD1,
                            RESERVE_FIELD2: oRecord.RESERVE_FIELD2,
                            RESERVE_FIELD3: oRecord.RESERVE_FIELD3,
                            RESERVE_FIELD4: oRecord.RESERVE_FIELD4,
                            RESERVE_FIELD5: oRecord.RESERVE_FIELD5,
                            AUTH_GROUP: oRecord.AUTH_GROUP,
                            CHANGED_DATE: oRecord.CHANGED_DATE,
                            CHANGED_TIME: oRecord.CHANGED_TIME,
                            CHANGED_BY: oRecord.CHANGED_BY,
                            CREATED_DATE: oRecord.CREATED_DATE,
                            CREATED_TIME: oRecord.CREATED_TIME,
                            CREATED_BY: oRecord.CREATED_BY
                        };

                        // Check if the record already exists in STAGE_LOC
                        oModel.read("/STAGE_LOC", {
                            success: function(oData) {
                                var aStageLocData = oData.results;

                                // Check if the LOCATION_ID exists in STAGE_LOC using strict equality
                                var bExists = aStageLocData.some(function(oStageRecord) {
                                    return oStageRecord.LOCATION_ID === oRecord.LOCATION_ID; // Using === for strict equality
                                });

                                if (bExists) {
                                    // Record already exists in STAGE_LOC
                                    MessageToast.show("Record with LOCATION_ID " + oRecord.LOCATION_ID + " already exists in STAGE_LOC.");
                                } else {
                                    // Create the new record in STAGE_LOC if not exists
                                    oModel.create("/STAGE_LOC", oNewRecord, {
                                        success: function() {
                                            MessageToast.show("Record pushed to STAGE_LOC.");
                                        },
                                        error: function() {
                                            MessageToast.show("Failed to push record to STAGE_LOC.");
                                        }
                                    });
                                }
                            },
                            error: function() {
                                MessageToast.show("Failed to check existence in STAGE_LOC.");
                            }
                        });
                    });

                    // After pushing the records, delete them from LOCATION_STB
                    aData.forEach(function(oRecord) {
                        oModel.remove("/LOCATION_STB('" + oRecord.LOCATION_ID + "')", {
                            success: function() {
                                MessageToast.show("Record deleted from LOCATION_STB.");
                                oModel.refresh();
                            },
                            error: function() {
                                MessageToast.show("Failed to delete record from LOCATION_STB.");
                            }
                        });
                    });

                },
                error: function() {
                    MessageToast.show("Failed to fetch records from LOCATION_STB.");
                }
            });
        }
    };
});
