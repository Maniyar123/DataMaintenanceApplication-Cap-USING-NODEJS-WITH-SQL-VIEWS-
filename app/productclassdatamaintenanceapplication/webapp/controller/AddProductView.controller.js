sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/routing/History",
], function (Controller, MessageToast,History) {
    "use strict";
    var that;
    return Controller.extend("com.productclassdatamaintenanceapplication.controller.AddProductView", {
        onInit: function () {
            that = this;
            var oModel = this.getOwnerComponent().getModel("productclassmodel");
           this.getView().setModel(oModel);
           that._loadCharacteristicValues(); //read method of charecetrictsvalue----
           that._loadProductClass(); //read method of productclass----
        },

         // Method to load characteristic values into a separate model
        _loadCharacteristicValues: function () {
             var oModel = this.getOwnerComponent().getModel("productclassmodel");

               oModel.read("/CHARACTERISTICSVALUE", {
               success: function (oData) {
            // Extract only the CHARACTERISTICSVALUE data
            var aCharacteristicValues = oData.results.filter(function(item) {
                return item.characteristicID_characteristicID; // Ensure it has a characteristic ID
            });

            // Create a new JSON model with the filtered data
            var oCharacteristicValuesModel = new sap.ui.model.json.JSONModel({ value: aCharacteristicValues });
            
            // Set the new model to the view with a specific name
            this.getView().setModel(oCharacteristicValuesModel, "CHARACTERISTICSVALUE");
        }.bind(this),
        error: function (oError) {
            console.error("Error fetching Characteristic Values:", oError.message);
        }
    });
},
       // Method to load product class  into a separate model
        _loadProductClass: function () {
            var oModel = this.getOwnerComponent().getModel("productclassmodel");

              oModel.read("/PRODUCTCLASS", {
              success: function (oData) {
           // Extract only the PRODUCTCLASS data
           var aProductClass = oData.results.filter(function(item) {
               return item.productID_productID; // Ensure it has a product ID
           });

           // Create a new JSON model with the filtered data
           var oProductClassModel = new sap.ui.model.json.JSONModel({ value: aProductClass });
           
           // Set the new model to the view with a specific name
           this.getView().setModel(oProductClassModel, "PRODUCTCLASS");
       }.bind(this),
       error: function (oError) {
           console.error("Error fetching Characteristic Values:", oError.message);
       }
   });
},
        //  ------------------ start of create operations-----------------------------
        // Create Class
        onSaveClass: function () {
            var oView = this.getView();
            var oModel = oView.getModel();
            var sClassID = oView.byId("classIdInput").getValue();
            var sClassName = oView.byId("classNameInput").getValue();
            
            if (!sClassID || !sClassName) {
                MessageToast.show("Please enter Class ID and Class Name");
                return;
            }

            var oClass = {
                classID: sClassID,
                className: sClassName
            };

            oModel.create("/CLASS", oClass, {
                success: function () {
                    MessageToast.show("Class created successfully");
                    oModel.refresh(); // Refresh model to update the table
                },
                error: function () {
                    MessageToast.show("Error creating Class");
                }
            });
        },

        // Create Product
        onSaveProduct: function () {
            var oView = this.getView();
            var oModel = oView.getModel();
            var sProductID = oView.byId("productIdInput").getValue();
            var sProductName = oView.byId("productNameInput").getValue();
            var sType = oView.byId("productTypeInput").getValue();
            
            if (!sProductID || !sProductName || !sType) {
                MessageToast.show("Please enter Product ID, Product Name and Type");
                return;
            }

            var oProduct = {
                productID: sProductID,
                productName: sProductName,
                type: sType
            };

            oModel.create("/PRODUCT", oProduct, {
                success: function () {
                    MessageToast.show("Product created successfully");
                    oModel.refresh(); // Refresh model to update the table
                },
                error: function () {
                    MessageToast.show("Error creating Product");
                }
            });
        },

        // Create Characteristic
        onSaveCharacteristic: function () {
            var oView = this.getView();
            var oModel = oView.getModel();
            var sCharacteristicID = oView.byId("characteristicIdInput").getValue();
            var sClassID = oView.byId("characteristicClassIdInput").getValue();
            var sCharacteristicName = oView.byId("characteristicNameInput").getValue();
        
            // Convert IDs to integers
            var iCharacteristicID = parseInt(sCharacteristicID, 10);
            var iClassID = parseInt(sClassID, 10);
        
            // // Debugging logs
            // console.log("Characteristic ID (integer):", iCharacteristicID);
            // console.log("Class ID (integer):", iClassID);
            // console.log("Characteristic Name:", sCharacteristicName);
        
            if (isNaN(iCharacteristicID) || isNaN(iClassID) || !sCharacteristicName) {
                sap.m.MessageToast.show("Please enter valid Characteristic ID, Class ID, and Characteristic Name");
                return;
            }
        
            // Create the payload based on the expected backend structure
            var oCharacteristic = {
                characteristicID: iCharacteristicID,
                classID_classID: iClassID,
                characteristicName: sCharacteristicName
            };
        
            // console.log("Data being sent:", oCharacteristic); // Log data being sent
        
            oModel.create("/CHARACTERISTICS", oCharacteristic, {
                success: function () {
                    sap.m.MessageToast.show("Characteristic created successfully");
                    oModel.refresh(); // Refresh model to update the table
                },
                error: function (oError) {
                    console.error("Error creating Characteristic:", oError); // Log error
                    sap.m.MessageToast.show("Error creating Characteristic");
                }
            });
        },
        
        
        // Create Characteristic Value
        // Create Characteristic Value
    onSaveCharacteristicValue: function () {
    var oView = this.getView();
    var oModel = oView.getModel();
    
    // Fetch values from the input fields
    var sCharacteristicID = oView.byId("characteristicValueIdInput").getValue();
    var sValue = oView.byId("characteristicValueInput").getValue();
    var sValueDescription = oView.byId("characteristicValueDesInput").getValue();
    
    // Validate the input values
    if (!sCharacteristicID || !sValue || !sValueDescription) {
        sap.m.MessageToast.show("Please enter Characteristic ID, Value and Value Description");
        return;
    }
    
    // Construct the data object with correct property names
    var oCharacteristicValue = {
        characteristicID_characteristicID: parseInt(sCharacteristicID, 10), // Convert to integer if necessary
        value: sValue,
        valueDescription: sValueDescription
    };
    
    // Use the correct entity set path
    oModel.create("/CHARACTERISTICSVALUE", oCharacteristicValue, {
        success: function () {
            sap.m.MessageToast.show("Characteristic Value created successfully");
            oModel.refresh(); // Refresh model to update the table
        },
        error: function (oError) {
            console.error("Error creating Characteristic Value:", oError);
            sap.m.MessageToast.show("Error creating Characteristic Value");
        }
    });
},


        // Create Product Class
      
       onSaveProductClassIds: function () {
    var oView = this.getView();
    var oModel = oView.getModel();

    // Retrieve values from input fields
    var sProductID = oView.byId("productClassIdInput").getValue();
    var sClassID = oView.byId("classProductIdInput").getValue();

    // Validate inputs
    if (!sProductID || !sClassID) {
        sap.m.MessageToast.show("Please enter Product ID and Class ID");
        return;
    }

    // Construct object with correct property names
    var oProductClass = {
        productID_productID: parseInt(sProductID, 10), // Convert to integer if needed
        classID_classID: parseInt(sClassID, 10)       // Convert to integer if needed
    };

    // Perform OData create operation
    oModel.create("/PRODUCTCLASS", oProductClass, {
        success: function () {
            sap.m.MessageToast.show("Product Class created successfully");
            oModel.refresh(); // Refresh model to update the table
        },
        error: function (oError) {
            console.error("Error creating Product Class:", oError);
            sap.m.MessageToast.show("Error creating Product Class");
        }
    });
},
//  ---------------------end of create operations----------------------

// ---------------sstart of delete functionality---------------------
 
  // ---delete functionality for class-----------

onDeleteClass: function (oEvent) {
    var oButton = oEvent.getSource();
    var oTable = oButton.getParent().getParent(); // Assuming the delete button is inside a row in the table
    var oItem = oTable.getBindingContext().getObject(); // Get the item bound to the row
    var oModel = this.getOwnerComponent().getModel("productclassmodel");
    var sPath = "/CLASS(" + oItem.classID + ")"; // Adjust to your entity's path

    sap.m.MessageBox.confirm("Are you sure you want to delete this class?", {
        actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
        onClose: function (sAction) {
            if (sAction === sap.m.MessageBox.Action.OK) {
                oModel.remove(sPath, {
                    success: function () {
                        sap.m.MessageToast.show("Class deleted successfully!");
                        // this.loadData(); // Reload data
                        oModel.refresh(true);
                    }.bind(this),
                    error: function (error) {
                        sap.m.MessageBox.error("Error while deleting class: " + error.message);
                    }
                });
            }
        }.bind(this)
    });
},


// ------delete functionality for product--------

onDeleteProduct: function (oEvent) {
    var oButton = oEvent.getSource();
    var oTable = oButton.getParent().getParent(); // Assuming the delete button is inside a row in the table
    var oItem = oTable.getBindingContext().getObject(); // Get the item bound to the row
    var oModel = this.getOwnerComponent().getModel("productclassmodel");
    var sPath = "/PRODUCT(" + oItem.productID + ")"; // Adjust to your entity's path

    sap.m.MessageBox.confirm("Are you sure you want to delete this Product?", {
        actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
        onClose: function (sAction) {
            if (sAction === sap.m.MessageBox.Action.OK) {
                oModel.remove(sPath, {
                    success: function () {
                        sap.m.MessageToast.show("Product deleted successfully!");
                        // this.loadData(); // Reload data
                        oModel.refresh(true);
                    }.bind(this),
                    error: function (error) {
                        sap.m.MessageBox.error("Error while deleting product: " + error.message);
                    }
                });
            }
        }.bind(this)
    });

},

// -------delete fucntionality for characteristic----

onDeleteCharacteristic: function (oEvent) {
    var oButton = oEvent.getSource();
    var oTable = oButton.getParent().getParent(); // Adjust based on your table structure
    var oItem = oTable.getBindingContext().getObject(); // Get the characteristic object
    var oModel = this.getOwnerComponent().getModel("productclassmodel");
    var sPath = "/CHARACTERISTICS(" + oItem.characteristicID + ")";

    sap.m.MessageBox.confirm("Are you sure you want to delete this characteristic?", {
        actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
        onClose: function (sAction) {
            if (sAction === sap.m.MessageBox.Action.OK) {
                oModel.remove(sPath, {
                    success: function () {
                        sap.m.MessageToast.show("Characteristic deleted successfully!");
                        // this.loadData(); // Reload data
                        oModel.refresh(true);
                    }.bind(this),
                    error: function (error) {
                        sap.m.MessageBox.error("Error while deleting characteristic: " + error.message);
                    }
                });
            }
        }.bind(this)
    });
},


// ------delte fucntionality for characteristic value----


onDeleteCharacteristicValue: function (oEvent) {
    // Get the OData model
    var oModel = this.getOwnerComponent().getModel("productclassmodel");
    
    // Get the binding context of the item to be deleted
    var oContext = oEvent.getSource().getBindingContext("CHARACTERISTICSVALUE");
    if (!oContext) {
        sap.m.MessageBox.error("No data found for deletion.");
        return;
    }

    // Get the ID for the item to be deleted
    var oItem = oContext.getObject();
    var sID = oItem.characteristicID_characteristicID; // Ensure this ID is correct

    // Construct the path for the item to be deleted
    var sPath = "/CHARACTERISTICSVALUE(" + sID + ")";

    // Confirm deletion
    sap.m.MessageBox.confirm("Are you sure you want to delete this characteristic value?", {
        actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
        onClose: function (sAction) {
            if (sAction === sap.m.MessageBox.Action.OK) {
                // Perform the deletion
                oModel.remove(sPath, {
                    success: function () {
                        sap.m.MessageToast.show("Characteristic value deleted successfully!");
                        // Reload the data to reflect the changes
                        oModel.refresh(true);
                    }.bind(this),
                    error: function (oError) {
                        sap.m.MessageBox.error("Error while deleting characteristic value: " + oError.message);
                    }
                });
            }
        }.bind(this)
    });
},




// ------delete fucntionality for product class---
// onDeleteProductClass: function (oEvent) {
//     var oView = this.getView();
//     var oModel = oView.getModel();
//     var oItem = oEvent.getSource().getParent().getParent(); // Get the ColumnListItem
//     var sPath = oItem.getBindingContext().getPath(); // Get the path of the item

//     oModel.remove(sPath, {
//         success: function () {
//             sap.m.MessageToast.show("Product Class deleted successfully");
//         },
//         error: function (oError) {
//             console.error("Error deleting Product Class:", oError);
//             sap.m.MessageToast.show("Error deleting Product Class");
//         }
//     });
// },
onDeleteProductClass: function (oEvent) {
    var oButton = oEvent.getSource();
    var oTable = oButton.getParent().getParent(); // Adjust based on your table structure
    var oItem = oTable.getBindingContext().getObject(); // Get the product-class relationship object
    var oModel = this.getOwnerComponent().getModel("productclassmodel");
    var sPath = "/PRODUCTCLASS(" + oItem.productID_productID + ")";

    sap.m.MessageBox.confirm("Are you sure you want to delete this product-class relationship?", {
        actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
        onClose: function (sAction) {
            if (sAction === sap.m.MessageBox.Action.OK) {
                oModel.remove(sPath, {
                    success: function () {
                        sap.m.MessageToast.show("Product-class relationship deleted successfully!");
                        // this.loadData(); // Reload data
                        oModel.refresh(true);
                    }.bind(this),
                    error: function (error) {
                        sap.m.MessageBox.error("Error while deleting product-class relationship: " + error.message);
                    }
                });
            }
        }.bind(this)
    });
},




// --------nav back to main view-----------
addProductOnNavBack:function(){
    var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteProductClassMainView", {}, true);
            }
}



    });
});
