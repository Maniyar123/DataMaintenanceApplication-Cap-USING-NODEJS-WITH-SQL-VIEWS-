sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
], function (MessageToast, Fragment) {
    'use strict';
   var that;
    return {
        onInit: function () {
            // Your initialization logic here, but no return statement
            // Example: Set up models, bind data, etc.
            var oModel = this.getOwnerComponent().getModel();
            this.getView().setModel(oModel);
        },
        
        // Function to open the create dialog
        onPressCreateButton: function () {
            that=this;
            // var oView = that.getView();
            // Check if the dialog already exists
            if (!this._oCharacteristicCreateFragment) {
                this._oCharacteristicCreateFragment = sap.ui.xmlfragment("com.vcplocapp.fragments.createButtonFragment", this);
                // oView.addDependent(this._oCharacteristicCreateFragment);
            }

            // Open the dialog
            this._oCharacteristicCreateFragment.open();
           
        },

        // Function to handle saving the location data
        onSaveLocation: function () {
            var that = this;
        
            // Collect form data from the fragment
            var oData = {
                LOCATION_ID: sap.ui.getCore().byId("locationIdInput").getValue(),
                LOCATION_DESC: sap.ui.getCore().byId("locationDescInput").getValue(),
                LOCATION_TYPE: sap.ui.getCore().byId("locationTypeInput").getValue(),
                LATITUDE: sap.ui.getCore().byId("latitudeInput").getValue(),
                LONGITUTE: sap.ui.getCore().byId("longitudeInput").getValue(),
                RESERVE_FIELD1: sap.ui.getCore().byId("reserveField1Input").getValue(),
                RESERVE_FIELD2: sap.ui.getCore().byId("reserveField2Input").getValue(),
                RESERVE_FIELD3: sap.ui.getCore().byId("reserveField3Input").getValue(),
                RESERVE_FIELD4: sap.ui.getCore().byId("reserveField4Input").getValue(),
                RESERVE_FIELD5: sap.ui.getCore().byId("reserveField5Input").getValue(),
                AUTH_GROUP: sap.ui.getCore().byId("authGroupInput").getValue(),
                CREATED_DATE: sap.ui.getCore().byId("createdDateInput").getDateValue(),
                CREATED_TIME: sap.ui.getCore().byId("createdTimeInput").getValue(),
                CREATED_BY: sap.ui.getCore().byId("createdByInput").getValue()
            };
        
            // Validate required fields
            if (!oData.LOCATION_ID || !oData.CREATED_DATE || !oData.CREATED_TIME) {
                MessageToast.show("Above fields are required.");
                return;
            }
        
            // Get the OData model
            var oModel = that.getModel("vmodel");
            var oModelv4=that.getModel();
            // Check if the LOCATION_ID already exists
            oModel.read("/LOCATION_STB('" + oData.LOCATION_ID + "')", {
                success: function () {
                    // If LOCATION_ID exists, show a message
                    MessageToast.show("Location ID already exists. Please use a different ID.");
                },
                error: function () {
                    // If LOCATION_ID does not exist, proceed to create
                    oModel.create("/LOCATION_STB", oData, {
                        success: function () {
                            MessageToast.show("Location created successfully.");
                            oModelv4.refresh();
                            // Close the dialog after successful save
                            if (that._oCharacteristicCreateFragment) {
                                that._oCharacteristicCreateFragment.close();
                                that._oCharacteristicCreateFragment.destroy();
                                that._oCharacteristicCreateFragment = null;
                            }
                        },
                        error: function () {
                            MessageToast.show("Failed to create location.");
                        }
                    });
                }
            });
        },
        
        onCancelLocation: function () {
            // Close the dialog when the cancel button is pressed
            if (this._oCharacteristicCreateFragment) {
                this._oCharacteristicCreateFragment.close();
                this._oCharacteristicCreateFragment.destroy();
                this._oCharacteristicCreateFragment=null;
            }
        }
        
    };
});
