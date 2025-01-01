sap.ui.define([
    "sap/m/MessageToast"
], function (MessageToast) {
    'use strict';
    var that;
    return {
        // Open the Update Location Dialog
        OnPressUpdateButton: function () {
            that = this;

            // Try to find the table dynamically
            var oTable = this.getView().byId("com.vcplocapp::LOCATION_STBList--fe::table::LOCATION_STB::LineItem-innerTable-listUl").getAggregation("pages")[0].getContent()[0];
            
            // If no selected item in the table
            var oSelectedItem = oTable.getSelectedItem();

            if (!oSelectedItem) {
                MessageToast.show("Please select a location to update.");
                return;
            }

            // Get the selected location data from the binding context
            var oSelectedLocation = oSelectedItem.getBindingContext().getObject();

            // Set the selected location data into the model if necessary
            var oModel = that.getView().getModel();
            oModel.setProperty("/selectedLocation", oSelectedLocation);

            // Get the dialog and set the context for binding
            var oDialog = sap.ui.getCore().byId("locationUpdateDialog");

            // If the dialog doesn't exist, create it
            if (!oDialog) {
                oDialog = sap.ui.xmlfragment("com.vcplocapp.fragments.updateButtonFragment", this);
                this.getView().addDependent(oDialog);
            }

            // Set the dialog's binding context
            oDialog.setBindingContext(oModel.createBindingContext("/selectedLocation"));

            // Open the dialog
            oDialog.open();
        },

        onUpdateLocation: function () {
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
                CREATED_DATE: sap.ui.getCore().byId("updateCreatedDateInput").getDateValue(),
                CREATED_TIME: sap.ui.getCore().byId("updateCreatedTimeInput").getValue(),
                CREATED_BY: sap.ui.getCore().byId("updateCreatedByInput").getValue()
            };

            // Validate required fields
            if (!oData.LOCATION_ID) {
                MessageToast.show("LOCATION_ID is required.");
                return;
            }

            // Get the OData model
            var oModel = that.getModel('vcpmodel');
            var oModelv4 = that.getModel();

            // Update entity in OData
            oModel.update("/LOCATION_STB('" + oData.LOCATION_ID + "')", oData, {
                success: function () {
                    MessageToast.show("Location updated successfully.");
                    oModelv4.refresh();
                    // Close the dialog
                    if (this._oLocationUpdateFragment) {
                        this._oLocationUpdateFragment.close();
                    }
                }.bind(this),
                error: function () {
                    MessageToast.show("Failed to update location.");
                }
            });
        },

        onCancelUpdate: function () {
            // Close the update dialog
            if (this._oLocationUpdateFragment) {
                this._oLocationUpdateFragment.close();
            }
        }
    };
});
