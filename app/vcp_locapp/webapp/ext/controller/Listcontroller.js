sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
], function (MessageToast, Fragment) {
    'use strict';
   var that;
    return {
        // onInit: function () {
        //     // Your initialization logic here, but no return statement
        //     // Example: Set up models, bind data, etc.
        //     var oModel = this.getOwnerComponent().getModel();
        //     this.getView().setModel(oModel);
        // },
        
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
        // onSaveLocation: function () {
        //     var that = this;
        
        //     // Collect form data from the fragment
        //     var oData = {
        //         LOCATION_ID: sap.ui.getCore().byId("locationIdInput").getValue(),
        //         LOCATION_DESC: sap.ui.getCore().byId("locationDescInput").getValue(),
        //         LOCATION_TYPE: sap.ui.getCore().byId("locationTypeInput").getValue(),
        //         LATITUDE: sap.ui.getCore().byId("latitudeInput").getValue(),
        //         LONGITUTE: sap.ui.getCore().byId("longitudeInput").getValue(),
        //         RESERVE_FIELD1: sap.ui.getCore().byId("reserveField1Input").getValue(),
        //         RESERVE_FIELD2: sap.ui.getCore().byId("reserveField2Input").getValue(),
        //         RESERVE_FIELD3: sap.ui.getCore().byId("reserveField3Input").getValue(),
        //         RESERVE_FIELD4: sap.ui.getCore().byId("reserveField4Input").getValue(),
        //         RESERVE_FIELD5: sap.ui.getCore().byId("reserveField5Input").getValue(),
        //         AUTH_GROUP: sap.ui.getCore().byId("authGroupInput").getValue(),
                
        //     };
        
        //     // Validate required fields
        //     if (!oData.LOCATION_ID ) {
        //         MessageToast.show("Above fields are required.");
        //         return;
        //     }
        
        //     // Get the OData model
        //     var oModel = that.getModel("vmodel");
        //     var oModelv4=that.getModel();
        //     // Check if the LOCATION_ID already exists
        //     oModel.read("/LOCATION_STB('" + oData.LOCATION_ID + "')", {
        //         success: function () {
        //             // If LOCATION_ID exists, show a message
        //             MessageToast.show("Location ID already exists. Please use a different ID.");
        //         },
        //         error: function () {
        //             // If LOCATION_ID does not exist, proceed to create
        //             oModel.create("/LOCATION_STB", oData, {
        //                 success: function () {
        //                     MessageToast.show("Location created successfully.");
        //                     oModelv4.refresh();
        //                     // Close the dialog after successful save
        //                     if (that._oCharacteristicCreateFragment) {
        //                         that._oCharacteristicCreateFragment.close();
        //                         that._oCharacteristicCreateFragment.destroy();
        //                         that._oCharacteristicCreateFragment = null;
        //                     }
        //                 },
        //                 error: function () {
        //                     MessageToast.show("Failed to create location.");
        //                 }
        //             });
        //         }
        //     });
        // },
        onSaveLocation: function () {
            var that = this;
            
            // Get current date and time
            var currentDate = new Date();
            var createdDate = currentDate.toISOString().split('T')[0];  // Date format yyyy-MM-dd
            var createdTime = currentDate.toTimeString().split(' ')[0];  // Time format HH:mm:ss
            var changedDate = createdDate;  // Same as created date for new records
            var changedTime = createdTime;  // Same as created time for new records
            
              // Default user if sap.ushell is not available
    var currentUser = "Unknown User"; 

    // Check if sap.ushell.Container is available (for BTP environment)
    if (typeof window.sap !== "undefined" && window.sap.ushell && window.sap.ushell.Container) {
        try {
            var oUserInfoService = sap.ushell.Container.getService("UserInfo");
            currentUser = oUserInfoService.getUser().getFullName(); // Fetch the full name of the user
        } catch (e) {
            console.error("Error retrieving user info:", e);
            currentUser = "Error Retrieving User"; // Fallback in case of any error
        }
    } else {
        console.log("sap.ushell.Container is not available. Using fallback user.");
    }var currentUser = "Fallback User"; // Mock or fallback user for trial environments

    // Check if sap.ushell.Container is available
    if (typeof window.sap !== "undefined" && window.sap.ushell && window.sap.ushell.Container) {
        try {
            var oUserInfoService = sap.ushell.Container.getService("UserInfo");
            currentUser = oUserInfoService.getUser().getFullName(); // Fetch user details if available
        } catch (e) {
            console.error("Error retrieving user info:", e);
            currentUser = "Error Retrieving User"; // Fallback in case of an error
        }
    } else {
        console.log("sap.ushell.Container is not available. Using fallback user.");
    }
    
    // Now you can use `currentUser` for your logic
    console.log("Current User: " + currentUser);
    
        
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
                CHANGED_DATE: changedDate,
                CHANGED_TIME: changedTime,
                CREATED_DATE: createdDate,
                CREATED_TIME: createdTime,
                CHANGED_BY: currentUser,   // Set current user as CHANGED_BY
                CREATED_BY: currentUser  // Set current user as CREATED_BY
            };
        
            // Validate required fields
            if (!oData.LOCATION_ID) {
                MessageToast.show("Location ID is required.");
                return;
            }
        
            // Get the OData model
            var oModel = that.getModel("vmodel");
            var oModelv4 = that.getModel();
        
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
