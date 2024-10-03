sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
],
function (Controller,Fragment) {
    "use strict";
     var that;
    return Controller.extend("com.productclassuniqueidmaintenanceapplication.controller.ListView", {
        onInit: function () {
            that = this;
            var oModel = this.getOwnerComponent().getModel("cat3model");
            this.getView().setModel(oModel);
            this.bus = this.getOwnerComponent().getEventBus();
            // oModel.setProperty("/sId", null); // Initialize the sId property
        },
        // This function will be triggered when a row in the table is clicked
        onRowSelected: function (oEvent) {
            var oSelectedItem = oEvent.getSource();
            var oContext = oSelectedItem.getBindingContext();
            var sProductID = oContext.getProperty("productID");  // Assuming the binding path has "productID"
           
        
            // Publish the Product ID via EventBus
            var oEventBus = this.getOwnerComponent().getEventBus();
            console.log("Publishing event with productID: ", sProductID);
            var oGModel = this.getOwnerComponent().getModel("globalModel");
            oGModel.setProperty("/productID",sProductID);
            oEventBus.publish("flexible", "setDetailPage", { productID: sProductID });
        },
        // onRowSelected: function (oEvent) {
        //     var oSelectedItem = oEvent.getSource();
        //     var oContext = oSelectedItem.getBindingContext();
        //     var sProductID = oContext.getProperty("productID");  // Assuming the binding path has "productID"
            
        //     // Log the selected Product ID for debugging
        //     console.log("Selected Product ID: ", sProductID);
        
        //     // Use setTimeout to publish the Product ID via EventBus
        //     var oEventBus = this.getOwnerComponent().getEventBus();
        //     setTimeout(function () {
        //         console.log("Publishing productID after delay: ", sProductID);
        //         oEventBus.publish("flexible", "setDetailPage", { productID: sProductID });
        //     }.bind(this), 1000); // Adjust the delay as necessary
        // },
        onCreate: function () {
            if (!this._pCreateProductDialog) {
                this._pCreateProductDialog = Fragment.load({
                    id: 'createProductDialog',
                    name: "com.productclassuniqueidmaintenanceapplication.fragments.createproductandclassfragment",
                    controller: this
                }).then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    return oDialog;
                }.bind(this));
            }
            this._pCreateProductDialog.then(function (oDialog) {
                oDialog.open();
            });
        },
        
        onCloseCreateProductDialog: function () {
            // Close the dialog
            this._pCreateProductDialog.then(function (oDialog) {
                oDialog.close();
                // Reset the input fields after closing
                this._resetProductForm();
                // Ensure busy state is reset
                this.getView().setBusy(false);
            }.bind(this)); // Ensure 'this' is correctly bound
        },
        
        _resetProductForm: function () {
            // Reset input fields in the fragment
            Fragment.byId("createProductDialog", "inputProductID").setValue("");
            Fragment.byId("createProductDialog", "inputProductName").setValue("");
            Fragment.byId("createProductDialog", "inputDescription").setValue("");
            Fragment.byId("createProductDialog", "inputStatus").setSelectedKey(""); // Reset status selection
            Fragment.byId("createProductDialog", "inputValidFrom").setValue("");
            Fragment.byId("createProductDialog", "inputValidTo").setValue("");
        },
        
        onCreateProduct: function () {
            var oView = this.getView();
            var oModel = oView.getModel();
        
            // Get input values from the fragment
            var sProductID = Fragment.byId("createProductDialog", "inputProductID").getValue();
            var sProductName = Fragment.byId("createProductDialog", "inputProductName").getValue();
            var sDescription = Fragment.byId("createProductDialog", "inputDescription").getValue();
            var sStatus = Fragment.byId("createProductDialog", "inputStatus").getSelectedKey();
            var sValidFrom = Fragment.byId("createProductDialog", "inputValidFrom").getValue();
            var sValidTo = Fragment.byId("createProductDialog", "inputValidTo").getValue();
        
            // Validate and create product logic
            if ( !sProductName) {
                MessageToast.show("Please fill in all required fields.");
                return;
            }
        
            // Create product object
            var oProduct = {
                productID: sProductID,
                productName: sProductName,
                description: sDescription,
                status: sStatus,
                validFrom: sValidFrom,
                validTo: sValidTo
            };
        
            // Call the OData model to create the product
            oModel.create("/product", oProduct, {
                success: function () {
                    MessageToast.show("Product created successfully.");
                    oModel.refresh(); // Refresh model to update the table
                    this.onCancelProductDialog(); // Close the dialog after saving
                }.bind(this),
                error: function (oError) {
                    // Handle error
                    var oErrorResponse = JSON.parse(oError.responseText);
                    MessageToast.show("Error creating product: " + oErrorResponse.error.message.value);
                    console.error("Error creating product:", oError);
                }
            });
        },
        
       
       
        
    });
});
