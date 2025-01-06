sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (MessageToast, MessageBox) {
    'use strict';
    var that;

    return {
        onPressPushButton: function (oEvent) {
            that = this;

            // Reference the table and get selected indices
            var oTable = that.byId("com.vcplocapp::LOCATION_STBList--fe::table::LOCATION_STB::LineItem::Table"); // Replace with your table ID
            var aSelectedIndices = oTable.getSelectedContexts();

            // Check if no records are selected
            if (aSelectedIndices.length === 0 ) {
                MessageToast.show("Please select at least one record to push.");
                return; // Exit if no records are selected
            }
          
            // Show confirmation dialog after records are selected
            MessageBox.confirm("Are you sure you want to push the selected records to STAGE_LOC?", {
                title: "Confirmation",
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                onClose: function (sAction) {
                    if (sAction === MessageBox.Action.OK) {
                        var oModel = that.getModel('vmodel'); // Replace 'vmodel' with your actual model name
                        var oModelv4 = that.getModel();

                        // Retrieve selected records
                        var aSelectedRecords = aSelectedIndices.map(function (oContext) {
                            return oContext.getObject();
                        });

                        aSelectedRecords.forEach(function (oRecord) {
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
                                success: function (oData) {
                                    var aStageLocData = oData.results;

                                    // Check if the LOCATION_ID exists in STAGE_LOC
                                    var bExists = aStageLocData.some(function (oStageRecord) {
                                        return oStageRecord.LOCATION_ID === oRecord.LOCATION_ID;
                                    });

                                    if (bExists) {
                                        MessageToast.show("Record with LOCATION_ID " + oRecord.LOCATION_ID + " already exists in STAGE_LOC.can't push to STAGE_LOC");
                                    } else {
                                        // Create the record in STAGE_LOC
                                        oModel.create("/STAGE_LOC", oNewRecord, {
                                            success: function () {
                                                MessageToast.show("Record pushed to STAGE_LOC.");
                                                oModelv4.refresh();

                                                // Delete the record from LOCATION_STB
                                                oModel.remove("/LOCATION_STB('" + oRecord.LOCATION_ID + "')", {
                                                    success: function () {
                                                        MessageToast.show("Record deleted from LOCATION_STB.");
                                                        oModelv4.refresh();
                                                    },
                                                    error: function () {
                                                        MessageToast.show("Failed to delete record from LOCATION_STB.");
                                                    }
                                                });
                                            },
                                            error: function () {
                                                MessageToast.show("Failed to push record to STAGE_LOC.");
                                            }
                                        });
                                    }
                                },
                                error: function () {
                                    MessageToast.show("Failed to check existence in STAGE_LOC.");
                                }
                            });
                        });
                    } else {
                        MessageToast.show("Push operation cancelled.");
                    }
                }
            });
        }
    };
});
