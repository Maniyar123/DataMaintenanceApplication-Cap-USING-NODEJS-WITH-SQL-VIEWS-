sap.ui.define([
    "sap/m/MessageToast"
], function (MessageToast) {
    'use strict';
    var that;
    return {
        // Open the Update Location Dialog
        OnPressUpdateButton: function () {
            var that = this;
        
            // Try to find the table dynamically
            var oTable = that.byId("com.vcplocapp::LOCATION_STBList--fe::table::LOCATION_STB::LineItem::Table");
        
            // Check if oTable is available
            if (!oTable) {
                sap.m.MessageToast.show("Table not found!");
                return;
            }
        
            // Get selected items from the table
            var aSelectedItems = oTable.getSelectedContexts();
        
            // Check if no record is selected
            if (aSelectedItems.length === 0) {
                sap.m.MessageToast.show("Please select a location to update.");
                return;
            }
        
            // Check if more than one record is selected
            if (aSelectedItems.length > 1) {
                sap.m.MessageToast.show("Please select only one location to update.");
                return;
            }
        
            // Get the selected location data from the context
            var oSelectedContext = aSelectedItems[0];
            var oSelectedLocation = oSelectedContext.getObject();
            var sSelectedId = oSelectedLocation.LOCATION_ID; // Extract the ID of the selected record
        
            // Get the OData model
            var oModel = that.getModel("vmodel"); // Assuming this is the correct OData model
        
            // Read the entire dataset (use caution with large datasets)
            oModel.read("/LOCATION_STB", {
                success: function (oData) {
                    // Filter the results using ===
                    var aResults = oData.results || [];
                    var oFilteredData = aResults.find(function (item) {
                        return item.LOCATION_ID === sSelectedId;
                    });
        
                    // Create a JSON model and set the fetched data
                    var oJSONModel = new sap.ui.model.json.JSONModel(oFilteredData);
        
                    // Set the model globally or to the view
                    sap.ui.getCore().setModel(oJSONModel, "selectedLocationModel");
        
                    // Get the dialog and set the model
                    var oDialog = sap.ui.getCore().byId("locationUpdateDialog");
        
                    // If the dialog doesn't exist, create it
                    if (!oDialog) {
                        oDialog = sap.ui.xmlfragment("com.vcplocapp.fragments.updateButtonFragment", that);
                    }
        
                    // Set the dialog's model
                    oDialog.setModel(oJSONModel, "selectedLocationModel");
        
                    // Open the dialog
                    oDialog.open();
                },
                error: function (oError) {
                    sap.m.MessageToast.show("Error fetching location data.");
                }
            });
        },
        
        
       

        OnPressfraUpdateButton: function () {
            that = this;

            // Collect form data from the fragment
            var oData = {
                LOCATION_ID: sap.ui.getCore().byId("updateLocationIdInput").getValue(),
                LOCATION_DESC: sap.ui.getCore().byId("updateLocationDescInput").getValue(),
                LOCATION_TYPE: sap.ui.getCore().byId("updateLocationTypeInput").getValue(),
                LATITUDE: sap.ui.getCore().byId("updateLatitudeInput").getValue(),
                LONGITUTE: sap.ui.getCore().byId("updateLongitudeInput").getValue(),
                RESERVE_FIELD1: sap.ui.getCore().byId("updateReserveField1Input").getValue(),
                RESERVE_FIELD2: sap.ui.getCore().byId("updateReserveField2Input").getValue(),
                RESERVE_FIELD3: sap.ui.getCore().byId("updateReserveField3Input").getValue(),
                RESERVE_FIELD4: sap.ui.getCore().byId("updateReserveField4Input").getValue(),
                RESERVE_FIELD5: sap.ui.getCore().byId("updateReserveField5Input").getValue(),
                AUTH_GROUP: sap.ui.getCore().byId("updateAuthGroupInput").getValue(),
                // CREATED_DATE: sap.ui.getCore().byId("updateCreatedDateInput").getDateValue(),
                // CREATED_TIME: sap.ui.getCore().byId("updateCreatedTimeInput").getValue(),
                // CREATED_BY: sap.ui.getCore().byId("updateCreatedByInput").getValue()
            };

            // Validate required fields
            if (!oData.LOCATION_ID) {
                MessageToast.show("LOCATION_ID is required.");
                return;
            }

            // Get the OData model
            var oModel = that.getModel('vmodel');
            var oModelv4 = that.getModel();

            // Update entity in OData
            oModel.update("/LOCATION_STB('" + oData.LOCATION_ID + "')", oData, {
                success: function () {
                    MessageToast.show("Location updated successfully.");
                    oModelv4.refresh();
                    // Close the dialog
                    sap.ui.getCore().byId("locationUpdateDialog").close();
                }.bind(this),
                error: function () {
                    MessageToast.show("Failed to update location.");
                }
            });
        },

        onCancelUpdate: function () {
           sap.ui.getCore().byId("locationUpdateDialog").close();
        }
    };
});
