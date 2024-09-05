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
        //    ----for classedit----
           this._oTable = this.byId("classTable");
           this._oEditContainer = this.byId("editClassContainer");


        //    ---for product edit-----
            this._oProductTable = this.byId("productsTable");
            this._oEditProductContainer = this.byId("editProductContainer");

            // ----for charecetrics edit-----
             this._oCharacteristicTable = this.byId("characteristicsTable");
             this._oEditCharacteristicContainer = this.byId("editCharacteristicContainer");

            // ---for characterict value edit---------

            this._oCharacteristicValueTable = this.byId("characteristicsValueTable");
            this._oEditCharacteristicValueContainer = this.byId("editCharacteristicValueContainer");

           


        //    that._loadCharacteristicValues(); //read method of charecetrictsvalue----
        //    that._loadProductClass(); //read method of productclass----
        },

//          // Method to load characteristic values into a separate model
//         _loadCharacteristicValues: function () {
//              var oModel = this.getOwnerComponent().getModel("productclassmodel");

//                oModel.read("/CHARACTERISTICSVALUE", {
//                success: function (oData) {
//             // Extract only the CHARACTERISTICSVALUE data
//             var aCharacteristicValues = oData.results.filter(function(item) {
//                 return item.characteristicID_characteristicID; // Ensure it has a characteristic ID
//             });

//             // Create a new JSON model with the filtered data
//             var oCharacteristicValuesModel = new sap.ui.model.json.JSONModel({ value: aCharacteristicValues });
            
//             // Set the new model to the view with a specific name
//             this.getView().setModel(oCharacteristicValuesModel, "CHARACTERISTICSVALUE");
//         }.bind(this),
//         error: function (oError) {
//             console.error("Error fetching Characteristic Values:", oError.message);
//         }
//     });
// },
//        // Method to load product class  into a separate model
//         _loadProductClass: function () {
//             var oModel = this.getOwnerComponent().getModel("productclassmodel");

//               oModel.read("/PRODUCTCLASS", {
//               success: function (oData) {
//            // Extract only the PRODUCTCLASS data
//            var aProductClass = oData.results.filter(function(item) {
//                return item.productID_productID; // Ensure it has a product ID
//            });

//            // Create a new JSON model with the filtered data
//            var oProductClassModel = new sap.ui.model.json.JSONModel({ value: aProductClass });
           
//            // Set the new model to the view with a specific name
//            this.getView().setModel(oProductClassModel, "PRODUCTCLASS");
//        }.bind(this),
//        error: function (oError) {
//            console.error("Error fetching Characteristic Values:", oError.message);
//        }
//    });
// },
        //  ------------------ start of create operations-----------------------------
        // Create Class
        onSaveClasses: function () {
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
        onSaveProducts: function () {
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
        onSaveCharacteristics: function () {
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
    onSaveCharacteristicValues: function () {
    var oView = this.getView();
    var oModel = oView.getModel();
    
    // Fetch values from the input fields
    var sCharacteristicValueID = oView.byId("characteristicValueIdInput").getValue();
    var sValue = oView.byId("characteristicValueInput").getValue();
    var sValueDescription = oView.byId("characteristicValueDesInput").getValue();
    var sCharacteristicID = oView.byId("characteristicsIdInput").getValue();
    // Validate the input values
    if (!sCharacteristicValueID || !sValue || !sValueDescription ||!sCharacteristicID) {
        sap.m.MessageToast.show("Please enter Characteristic ID, Value, Characteristic Value ID and Value Description");
        return;
    }
    
    // Construct the data object with correct property names
    var oCharacteristicValue = {
        characteristicValueID: parseInt(sCharacteristicValueID, 10), // Convert to integer if necessary
        value: sValue,
        valueDescription: sValueDescription,
        characteristicID_characteristicID:parseInt(sCharacteristicID, 10)

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
    var sProductClassID = oView.byId("productsClassIdInput").getValue();
    var sClassID = oView.byId("classProductIdInput").getValue();
    var sProductID = oView.byId("productClassIdInput").getValue();

    // Validate inputs
    if (!sProductClassID||!sProductID || !sClassID) {
        sap.m.MessageToast.show("Please enter Product Class ID ,Product ID and Class ID");
        return;
    }

    // Construct object with correct property names
    var oProductClass = {
        productClassID: parseInt(sProductClassID, 10),
        classID_classID: parseInt(sClassID, 10) ,
        productID_productID: parseInt(sProductID, 10)     
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
    var oButton = oEvent.getSource();
    var oTable = oButton.getParent().getParent(); // Adjust based on your table structure
    var oItem = oTable.getBindingContext().getObject(); // Get the characteristic object
    var oModel = this.getOwnerComponent().getModel("productclassmodel");
    var sPath = "/CHARACTERISTICSVALUE(" + oItem.characteristicValueID + ")";

    sap.m.MessageBox.confirm("Are you sure you want to delete this characteristicvalue?", {
        actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
        onClose: function (sAction) {
            if (sAction === sap.m.MessageBox.Action.OK) {
                oModel.remove(sPath, {
                    success: function () {
                        sap.m.MessageToast.show("Characteristicvalue deleted successfully!");
                        // this.loadData(); // Reload data
                        oModel.refresh(true);
                    }.bind(this),
                    error: function (error) {
                        sap.m.MessageBox.error("Error while deleting characteristicvalue: " + error.message);
                    }
                });
            }
        }.bind(this)
    });
},






// ------delete fucntionality for product class---
onDeleteProductClass: function (oEvent) {
    var oButton = oEvent.getSource();
    var oTable = oButton.getParent().getParent(); // Adjust based on your table structure
    var oItem = oTable.getBindingContext().getObject(); // Get the characteristic object
    var oModel = this.getOwnerComponent().getModel("productclassmodel");
    var sPath = "/PRODUCTCLASS(" + oItem.productClassID + ")";

    sap.m.MessageBox.confirm("Are you sure you want to delete this productclass?", {
        actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
        onClose: function (sAction) {
            if (sAction === sap.m.MessageBox.Action.OK) {
                oModel.remove(sPath, {
                    success: function () {
                        sap.m.MessageToast.show("productclass deleted successfully!");
                        // this.loadData(); // Reload data
                        oModel.refresh(true);
                    }.bind(this),
                    error: function (error) {
                        sap.m.MessageBox.error("Error while deleting productclass: " + error.message);
                    }
                });
            }
        }.bind(this)
    });
},


// ----------delete funtionality end-------------

// -----------update fuunctionality start------------

// -------class update fucnctionality--------------

onEditClass: function (oEvent) {
    // Get the selected item
    var oSelectedItem = oEvent.getSource().getParent().getParent();
    var oContext = oSelectedItem.getBindingContext();

    // Get data from selected item
    var oData = oContext.getObject();

    // Set data to input fields
    this.byId("editClassIdInput").setValue(oData.classID);
    this.byId("editClassNameInput").setValue(oData.className);

    // Switch to edit mode
    this._oTable.setVisible(false);
    this._oEditContainer.setVisible(true);
},

onSaveClass: function () {
    var sClassId = this.byId("editClassIdInput").getValue();
    var sClassName = this.byId("editClassNameInput").getValue();

    // Assuming you have a reference to your ODataModel
    var oModel = this.getView().getModel();

    // Create a payload with the updated data
    var oPayload = {
        classID: sClassId,
        className: sClassName
    };

    // Update data in the OData service
    oModel.update("/CLASS(" + sClassId + ")", oPayload, {
        success: function () {
            MessageToast.show("Class updated successfully.");
            this._exitEditMode();
        }.bind(this),
        error: function () {
            MessageToast.show("Error updating class.");
        }
    });
},

onCancelEdit: function () {
    this._exitEditMode();
},

_exitEditMode: function () {
    this._oTable.setVisible(true);
    this._oEditContainer.setVisible(false);
},


// ----product update fucntionality--------

onEditProduct: function (oEvent) {
    // Get the selected item
    var oSelectedItem = oEvent.getSource().getParent().getParent();
    var oContext = oSelectedItem.getBindingContext();

    // Get data from selected item
    var oData = oContext.getObject();

    // Set data to input fields
    this.byId("editProductIdInput").setText(oData.productID); // ID is not editable
    this.byId("editProductNameInput").setValue(oData.productName);
    this.byId("editTypeInput").setValue(oData.type);

    // Switch to edit mode
    // this.byId("productTable").setVisible(false);
    // this.byId("editProductContainer").setVisible(true);
    this._oProductTable.setVisible(false);
    this._oEditProductContainer.setVisible(true);

    // Store context for later use
    this._oEditContext = oContext;
},

onSaveProduct: function () {
    var sProductName = this.byId("editProductNameInput").getValue();
    var sProductType = this.byId("editTypeInput").getValue();
    var sProductId = this.byId("editProductIdInput").getText(); // ID is read-only

    // Create a payload with the updated data
    var oPayload = {
        productName: sProductName,
        type:sProductType
    };

    // Assuming you have a reference to your ODataModel
    var oModel = this.getView().getModel();

    // Update data in the OData service
    oModel.update("/PRODUCT(" + sProductId + ")", oPayload, {
        success: function () {
            MessageToast.show("Product updated successfully.");
            this._exitEditMode("product");
        }.bind(this),
        error: function () {
            MessageToast.show("Error updating product.");
        }
    });
},

onCancelEditProduct: function () {
    this._exitEditMode();
},

_exitEditMode: function (sEntity) {
    // this.byId(sEntity + "Table").setVisible(true);
    // this.byId("edit" + sEntity.charAt(0).toUpperCase() + sEntity.slice(1) + "Container").setVisible(false);
    this._oProductTable.setVisible(true);
    this._oEditProductContainer.setVisible(false);
},

// -------------charecetrics update fucntionality----------------
onEditCharacteristic: function (oEvent) {
    // Get the selected item
    var oSelectedItem = oEvent.getSource().getParent().getParent();
    var oContext = oSelectedItem.getBindingContext();

    // Get data from selected item
    var oData = oContext.getObject();

    // Set data to input fields
    this.byId("editCharacteristicIdInput").setText(oData.characteristicID); // ID is not editable
    this.byId("editCharacteristicNameInput").setValue(oData.characteristicName);
    
    // Switch to edit mode
    this._oCharacteristicTable.setVisible(false);
    this._oEditCharacteristicContainer.setVisible(true);

    // Store context for later use
    this._oEditContext = oContext;
},

onSaveCharacteristic: function () {
    var sCharacteristicName = this.byId("editCharacteristicNameInput").getValue();
    
    var sCharacteristicId = this.byId("editCharacteristicIdInput").getText(); // ID is read-only

    // Create a payload with the updated data
    var oPayload = {
        characteristicName: sCharacteristicName,
        characteristicID:sCharacteristicId
    };

    // Assuming you have a reference to your ODataModel
    var oModel = this.getView().getModel();

    // Update data in the OData service
    oModel.update("/CHARACTERISTIC(" + sCharacteristicId + ")", oPayload, {
        success: function () {
            MessageToast.show("Characteristic updated successfully.");
            this._exitEditMode("characteristic");
        }.bind(this),
        error: function () {
            MessageToast.show("Error updating characteristic.");
        }
    });
},

onCancelEditCharacteristic: function () {
    this._exitEditMode();
},


_exitEditMode: function (sEntity) {
    // this.byId(sEntity + "Table").setVisible(true);
    // this.byId("edit" + sEntity.charAt(0).toUpperCase() + sEntity.slice(1) + "Container").setVisible(false);
    this._oCharacteristicTable.setVisible(true);
    this._oEditCharacteristicContainer.setVisible(false);
},


// ---------edit charecetrics value fucntilonality-----------
onEditCharacteristicValue: function (oEvent) {
    // Get the selected item
    var oSelectedItem = oEvent.getSource().getParent().getParent();
    var oContext = oSelectedItem.getBindingContext();

    // Get data from selected item
    var oData = oContext.getObject();

    // Set data to input fields
    this.byId("editCharacteristicValueIdInput").setText(oData.characteristicValueID); // ID is not editable
    this.byId("editCharacteristicValueInput").setValue(oData.value);
    this.byId("editCharacteristicValueDesInput").setValue(oData.valueDescription);

    // Switch to edit mode
    this._oCharacteristicValueTable.setVisible(false);
    this._oEditCharacteristicValueContainer.setVisible(true);

    // Store context for later use
    this._oEditContext = oContext;
},

onSaveCharacteristicValue: function () {
    var sCharacteristicValueName = this.byId("editCharacteristicValueInput").getValue();
    var sCharacteristicValueDesName = this.byId("editCharacteristicValueDesInput").getValue();
    var sCharacteristicValueId = this.byId("editCharacteristicValueIdInput").getText(); // ID is read-only

    // Create a payload with the updated data
    var oPayload = {
        value: sCharacteristicValueName,
        valueDescription:sCharacteristicValueDesName
    };

    // Assuming you have a reference to your ODataModel
    var oModel = this.getView().getModel();

    // Update data in the OData service
    oModel.update("/CHARACTERISTICVALUE(" + sCharacteristicValueId + ")", oPayload, {
        success: function () {
            MessageToast.show("Characteristic value updated successfully.");
            this._exitEditMode("value");
        }.bind(this),
        error: function () {
            MessageToast.show("Error updating characteristic value.");
        }
    });
},

onCancelEditCharacteristicValue: function () {
    this._exitEditMode();
},
_exitEditMode: function (sEntity) {
    // this.byId(sEntity + "Table").setVisible(true);
    // this.byId("edit" + sEntity.charAt(0).toUpperCase() + sEntity.slice(1) + "Container").setVisible(false);
    this._oCharacteristicValueTable.setVisible(true);
    this._oEditCharacteristicValueContainer.setVisible(false);
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
