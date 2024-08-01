sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"

],
function (Controller, ODataModel,MessageBox,Fragment,JSONModel) {
    "use strict";
    var that;
    return Controller.extend("com.productdetailsapplication.productdetailsapplication.controller.ProductView", {
        
        onInit: function () {
          //  var oModel = new ODataModel("/odata/v2/catalog/");
           // this.getView().setModel(oModel);
           // Initialize the product ID counter
           this.productIdCounter = 101; // Start from 101
           this.editMode = false;  // Flag to track edit mode
           this.aProducts = [];    // Array to hold original products data
            this.loadData();
             that = this;
        },
    // -----------  reading properties from product entity---------------
        loadData: function () {
            var that = this;
            var oModel = that.getOwnerComponent().getModel("oModel") //this.getView().getModel();

            oModel.read("/products", {
                success: function (oData) {
                    var jsonModel = new sap.ui.model.json.JSONModel();
                    jsonModel.setData({
                        Products: oData.results 
                    });
                    that.getView().byId("table").setModel(jsonModel);
                    that.getView().setBusy(false);
                },
                error: function (error) {
                    console.error("Error while loading data:", error);
                    that.getView().setBusy(false);
                }
            });
                // -----------reading properties from characteristics entity-------------
            oModel.read("/Characteristics", {
                urlParameters: {
                    "$expand": "product"
                },
                success: function (oData) {
                    var charJsonModel = new sap.ui.model.json.JSONModel();
                    charJsonModel.setData({
                        Characteristics: oData.results
                    });
                    that.getView().byId("charTable").setModel(charJsonModel);
                    that.getView().setBusy(false);
                },
                error: function (error) {
                    console.error("Error while loading data:", error);
                    that.getView().setBusy(false);
                }
            });
        },

        //  ----------disabling the delete buttton in characteristic tab bar------------------
        onSelectTab: function (oEvent) {
            var sSelectedKey = oEvent.getParameter("key");
            var bIsProductsTab = sSelectedKey === "Products";
            this.getView().byId("deleteButton").setEnabled(bIsProductsTab);
        },

        // onCreateProduct: function () {
        //      // Load the fragment asynchronously
        //      if (!this._oCreateDialog) {
        //         Fragment.load({
        //             id: "productDialog",
        //             name: "com.productdetailsapplication.productdetailsapplication.fragmnets.CreateProductFragment",
        //             controller: this // Pass the current controller to the fragment if needed
        //         }).then(function (oFragment) {
        //             that._oCreateDialog = oFragment;
        //             // that.getView().addDependent(that._oCreateDialog);
        //             that._oCreateDialog.open();
        //         });
        //     } else {
        //         this._oCreateDialog.open();
        //     }
        
        // },

        // --------create button fragment------------
        onCreateProduct: function () {
            if (!this._oCreateDialog) {
                this._oCreateDialog = Fragment.load({
                    id: this.getView().getId(),
                    name: "com.productdetailsapplication.productdetailsapplication.fragmnets.CreateProductFragment",
                    controller: this
                }).then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    
                    return oDialog;
                }.bind(this));
            }
            this._oCreateDialog.then(function (oDialog) {
                oDialog.open();
                
            });
        },
            //   ----------submit button in create fragment-----------------
        // onSubmitCreate: function () {
        //     var oView = this.getView();
        //     var oModel = this.getOwnerComponent().getModel("oModel");

        //     var sProductName = oView.byId("productNameInput").getValue();
        //     var sCharacteristicName = oView.byId("characteristicNameInput").getValue();
        //     var sCharacteristicValue = oView.byId("characteristicValueInput").getValue();

        //     if (sProductName && sCharacteristicName && sCharacteristicValue) {
        //         // Create product
        //         oModel.create("/products", { productName: sProductName }, {
        //             success: function (oProductData) {
        //                 // Create characteristic
        //                 var sProductId = oProductData.ID;
        //                 var oCharacteristicData = {
        //                     product_ID: sProductId,
        //                     characteristicName: sCharacteristicName,
        //                     characteristicValue: sCharacteristicValue
        //                 };
        //                 oModel.create("/Characteristics", oCharacteristicData, {
        //                     success: function () {
        //                         MessageBox.success("Product and Characteristics created successfully!");
        //                         this.loadData();
        //                         this._oCreateDialog.then(function (oDialog) {
        //                             oDialog.close();
        //                         });
        //                     }.bind(this),
        //                     error: function (error) {
        //                         console.error("Error while creating characteristic:", error);
        //                     }
        //                 });
        //             }.bind(this),
        //             error: function (error) {
        //                 console.error("Error while creating product:", error);
        //             }
        //         });
        //     } else {
        //         MessageBox.error("Please fill all fields.");
        //     }
        // },

        onSubmitCreate: function() {
            var oView = this.getView();
            var oModel = this.getOwnerComponent().getModel("oModel");
        
            var sProductName = oView.byId("productNameInput").getValue();
            var sCharacteristicName = oView.byId("charNameInput").getValue();
            var sCharacteristicValue = oView.byId("charValueInput").getValue();
        
            if (sProductName && sCharacteristicName && sCharacteristicValue) {
                // Generate Product ID
                var sProductId = this.generateProductId();
        
                // Create product
                oModel.create("/products", { ID: sProductId, productName: sProductName }, {
                    success: function(oProductData) {
                        // Generate Characteristic ID
                        var sCharacteristicId = this.generateCharacteristicId();
        
                        // Create characteristic
                        var oCharacteristicData = {
                            product_ID: sProductId,
                            ID: sCharacteristicId,
                            characteristicName: sCharacteristicName,
                            characteristicValue: sCharacteristicValue
                        };
        
                        oModel.create("/Characteristics", oCharacteristicData, {
                            success: function() {
                                MessageBox.success("Product and Characteristics created successfully!");
                                this.loadData();
                                this._oCreateDialog.then(function(oDialog) {
                                    oDialog.close();
                                    oDialog.destroy();
                                    that._oCreateDialog = null; // Clear fields on dialog close
                                });
                            }.bind(this),
                            error: function(error) {
                                console.error("Error while creating characteristic:", error);
                            }
                        });
                    }.bind(this),
                    error: function(error) {
                        console.error("Error while creating product:", error);
                    }
                });
            } else {
                MessageBox.error("Please fill all fields.");
            }
        },
        
        // -----------generating productid-----------------

        generateProductId: function() {
            var oView = this.getView();
        
            // Check if there are any products in the table
            var aProducts = oView.byId("table").getModel().getData().Products;
            if (aProducts && aProducts.length > 0) {
                // Find the maximum ID currently in use
                var maxId = Math.max.apply(Math, aProducts.map(function(product) {
                    return parseInt(product.ID);
                }));
        
                // Increment the maximum ID
                var productId = maxId + 1;
                return productId.toString();
            } else {
                // If no products exist, start from 101
                if (!this.productIdCounter) {
                    this.productIdCounter = 101;
                }
                var productId = this.productIdCounter.toString();
                this.productIdCounter++;
                return productId;
            }
        },
        // ------------generating characteristicid-------------------
        generateCharacteristicId: function() {
            var oView = this.getView();
        
            // Check if there are any characteristics in the table
            var aCharacteristics = oView.byId("charTable").getModel().getData().Characteristics;
            if (aCharacteristics && aCharacteristics.length > 0) {
                // Find the maximum ID currently in use
                var maxId = Math.max.apply(Math, aCharacteristics.map(function(characteristic) {
                    return parseInt(characteristic.ID);
                }));
        
                // Increment the maximum ID
                var characteristicId = maxId + 1;
                return characteristicId.toString();
            } else {
                // If no characteristics exist, start from 1
                if (!this.characteristicIdCounter) {
                    this.characteristicIdCounter = 1;
                }
                var characteristicId = this.characteristicIdCounter.toString();
                this.characteristicIdCounter++;
                return characteristicId;
            }
        },
        


        //   -------------cancel button in create fragment-------------------
        onCancelCreate: function () {
            this._oCreateDialog.then(function (oDialog) {
                oDialog.close();
                oDialog.destroy();
                that._oCreateDialog = null;// Clear fields on dialog close
             
            }.bind(this));
           
            
        },
        
      

        
        // -----delete functionality---------


        // onDeleteProduct: function (oEvent) {
        //     // var createData=sap.ui.getCore().getModel("inputModel").getData();
        //     var odataModel = this.getOwnerComponent().getModel("oModel");
        //     // var ID=oEvent.getParameters()['listItem'].getBindingContext().getObject().ID;
        //     // var sObj = oEvent.getSource().getParent().getBindingContext().getProperty();
        //     var selectedProduct = this.getView().byId("table").getSelectedItem();
        //     var productPath = selectedProduct.getBindingContext().getProperty();

        //     var sPath = "/products(" + productPath.ID + ")";
        //     odataModel.remove(sPath, {
        //         success: function (oData) {
        //             // Handle successful delete
        //             MessageBox.success("data is deleted succssesfully:", oData);
        //             that.getData();
        //         },
        //         error: function (error) {
        //             // Handle error
        //             MessageBox.error("Error In Data Deletion:", error);
        //         }
        //     });
        // },


    //  ------------ single delete functionality to delete record's from both product and characteristics entitie's---------------------

         onDeleteProduct: function (oEvent) {
            var oView = this.getView();
            var odataModel = this.getOwnerComponent().getModel("oModel");
            var selectedProduct = oView.byId("table").getSelectedItem();
            var that = this;
        
            if (!selectedProduct) {
                MessageBox.error("Please select a product to delete.");
                return;
            }
        
            var productPath = selectedProduct.getBindingContext().getObject();
            var sProductPath = "/products(" + productPath.ID + ")";
        
            // Define the characteristic filter for associated product ID
            var sCharacteristicFilter = new sap.ui.model.Filter("product_ID", sap.ui.model.FilterOperator.EQ, productPath.ID);
        
            // Show confirmation dialog
            MessageBox.confirm("Are you sure you want to delete the selected product and its associated characteristics?", {
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                onClose: function (sAction) {
                    if (sAction === MessageBox.Action.OK) {
                        // Read characteristics associated with the product
                        odataModel.read("/Characteristics", {
                            filters: [sCharacteristicFilter],
                            success: function (oData) {
                                var characteristicsToDelete = oData.results;
                                var deleteCharacteristic = function (index) {
                                    if (index < characteristicsToDelete.length) {
                                        var characteristic = characteristicsToDelete[index];
                                        var sCharacteristicPath = "/Characteristics(" + characteristic.ID + ")";
                                        odataModel.remove(sCharacteristicPath, {
                                            success: function () {
                                                // Proceed to delete next characteristic
                                                deleteCharacteristic(index + 1);
                                            },
                                            error: function (error) {
                                                MessageBox.error("Error while deleting characteristic: " + error.message);
                                            }
                                        });
                                    } else {
                                        // All characteristics deleted, now delete the product
                                        odataModel.remove(sProductPath, {
                                            success: function () {
                                                MessageBox.success("Product and associated characteristics deleted successfully!");
                                                that.loadData(); // Reload data
                                            },
                                            error: function (error) {
                                                MessageBox.error("Error while deleting product: " + error.message);
                                            }
                                        });
                                    }
                                };
        
                                // Start deleting characteristics
                                if (characteristicsToDelete.length > 0) {
                                    deleteCharacteristic(0);
                                } else {
                                    // No characteristics to delete, directly delete the product
                                    odataModel.remove(sProductPath, {
                                        success: function () {
                                            MessageBox.success("Product deleted successfully!");
                                            that.loadData(); // Reload data
                                        },
                                        error: function (error) {
                                            MessageBox.error("Error while deleting product: " + error.message);
                                        }
                                    });
                                }
                            },
                            error: function (error) {
                                MessageBox.error("Error while reading characteristics: " + error.message);
                            }
                        });
                    }else {
                        // Cancel action, refresh the table if needed
                        that.loadData(); // Reload data
                    }
                }
            });
        },


         //   --------------update functionality-------------
           
        //  onUpdateProduct: function () {
        //     var oModel = this.getView().getModel("oModel");
        //     var oSelectedProduct=oModel.getView().getSelectedItem();
        //     // var oSelectedProduct = oTable.getSelectedItem();
        
        //     if (oSelectedProduct) {
        //         var oContext = oSelectedProduct.getBindingContext();
        //         var oProduct = oContext.getObject();
        
        //         var oView = this.getView();
        //         var oDialog = oView.byId("updateProductDialog");
        
        //         // Set the selected product details in the update dialog
        //         oView.byId("updateProductIdInput").setValue(oProduct.ID);
        //         oView.byId("updateProductNameInput").setValue(oProduct.productName);
        
        //         // Fetch associated characteristics and set in the update dialog
        //         var oCharTable = this.getView().byId("charTable");
        //         var oCharItems = oCharTable.getItems();
        
        //         // Example: Assuming you want to populate only the first characteristic
        //         if (oCharItems.length > 0) {
        //             var oCharContext = oCharItems[0].getBindingContext();
        //             var oCharacteristic = oCharContext.getObject();
        
        //             oView.byId("updateCharNameInput").setValue(oCharacteristic.characteristicName);
        //             oView.byId("updateCharValueInput").setValue(oCharacteristic.characteristicValue);
        //         }
        
        //         // Open the update dialog
        //         if (!oDialog) {
        //             Fragment.load({
        //                 id: oView.getId(),
        //                 name: "com.productdetailsapplication.productdetailsapplication.fragmnets.UpdateProductFragment",
        //                 controller: this
        //             }).then(function (oDialog) {
        //                 oView.addDependent(oDialog);
        //                 oDialog.open();
        //             });
        //         } else {
        //             oDialog.open();
        //         }
        //     } else {
        //         MessageBox.error("Please select a product to update.");
        //     }
        // },
        
            
         
        //  onUpdateProduct: function () {
        //     // this.aProducts = JSON.parse(JSON.stringify(this.getView().getModel("oModel").getProperty("/products"))); // Deep copy of products data
        //     this.editMode = true;
        //     this.byId("editButton").setVisible(false);
        //     this.byId("saveButton").setVisible(true);
        //     this.byId("cancelButton").setVisible(true);
        //     this.rebindTable();  // Rebind table for editing
        // },

        // onSave: function () {
        //     // Logic to save changes to backend or update model
        //     // For simplicity, assume updating the model directly here
        //     this.editMode = false;
        //     this.byId("saveButton").setVisible(false);
        //     this.byId("cancelButton").setVisible(false);
        //     this.byId("editButton").setVisible(true);
        //     // Implement logic to update data in backend if necessary
        //     MessageBox.success("Changes saved successfully!");
        //     this.rebindTable();  // Rebind table after saving
        // },

        // onCancel: function () {
        //     // Reset to original products data
        //     this.getView().getModel().setProperty("/Products", this.aProducts);
        //     this.editMode = false;
        //     this.byId("cancelButton").setVisible(false);
        //     this.byId("saveButton").setVisible(false);
        //     this.byId("editButton").setVisible(true);
        //     this.rebindTable();  // Rebind table after canceling
        // },

        // rebindTable: function () {
        //     var sMode = this.editMode ? "Edit" : "Navigation";
        //     var oTable = this.byId("table"); // Assuming your table ID is "table"
        //     oTable.unbindItems();
        //     oTable.bindItems({
        //         path: "/products",
        //         template: this.getTemplate(sMode),
        //         templateShareable: false
        //     });
        // },

        // getTemplate: function (sMode) {
        //     if (sMode === "Edit") {
        //         return new sap.m.ColumnListItem({
        //             cells: [
        //                 new sap.m.Input({
        //                     value: "{productName}"
        //                 }),
        //                 new sap.m.Input({
        //                     value: "{characteristicName}"
        //                 }),
        //                 new sap.m.Input({
        //                     value: "{characteristicValue}"
        //                 })
        //                 // Add more Input fields for other properties as needed
        //             ]
        //         });
        //     } else { // Navigation mode
        //         return new sap.m.ColumnListItem({
        //             cells: [
        //                 new sap.m.Text({
        //                     text: "{productName}"
        //                 }),
        //                 new sap.m.Text({
        //                     text: "{characteristicName}"
        //                 }),
        //                 new sap.m.Text({
        //                     text: "{characteristicValue}"
        //                 })
        //                 // Add more Text fields for other properties as needed
        //             ]
        //         });
        //     }
        // }











 

            // ------batch delete functionality------
        // onDeleteProduct: function (oEvent) {
        //     var oView = this.getView();
        //     var odataModel = this.getOwnerComponent().getModel("oModel");
        //     var selectedProduct = oView.byId("table").getSelectedItem();
        //     var that = this;
        
        //     if (!selectedProduct) {
        //         MessageBox.error("Please select a product to delete.");
        //         return;
        //     }
        
        //     var productPath = selectedProduct.getBindingContext().getObject();
        //     // var sProductPath = "/products(" + productPath.ID + ")";
        
        //     // Define the characteristic filter for associated product ID
        //     var sCharacteristicFilter = new sap.ui.model.Filter("product_ID", sap.ui.model.FilterOperator.EQ, productPath.ID);
        
        //     // Show confirmation dialog
        //     MessageBox.confirm("Are you sure you want to delete the selected product and its associated characteristics?", {
        //         actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
        //         onClose: function (sAction) {
        //             if (sAction === MessageBox.Action.OK) {
        //                 // Read characteristics associated with the product
        //                 odataModel.read("/Characteristics", {
        //                     filters: [sCharacteristicFilter],
        //                     success: function (oData) {
        //                         var characteristicsToDelete = oData.results;
        
        //                         // Create batch operations
        //                         var batchOperations = [];
        //                         for (var i = 0; i < characteristicsToDelete.length; i++) {
        //                             // var characteristic = characteristicsToDelete[i];
        //                             // var sObject = characteristic.getBindingContext().getObject();
        //                             // var oEntry = oSelectedItem.getBindingContext().getObject();
        //                             // batchOperations.push(odataModel.createBatchOperation("/Characteristics(" + sObject.ID + ")", "DELETE", oEntry));
        //                             var characteristicId = characteristicsToDelete[i].ID;
        //                             var characteristicPath = "/Characteristics(" + characteristicId + ")";
        //                             batchOperations.push(odataModel.createBatchOperation(characteristicPath, "DELETE"));
        //                         }
        
        //                         // Add product delete operation to batch
                               
        //                         // batchOperations.push(odataModel.createBatchOperation("/products(" + productPath.ID + ")", "DELETE", oEntry));
        //                         var productPath = "/products(" + productId + ")";
        //                         batchOperations.push(odataModel.createBatchOperation(productPath, "DELETE"));
        //                         // Submit batch operations
        //                         odataModel.addBatchChangeOperations(batchOperations);
        //                         odataModel.submitBatch({
        //                             success: function (oData) {
        //                                 MessageBox.success("Product and associated characteristics deleted successfully!");
        //                                 that.loadData(); // Reload data
        //                             },
        //                             error: function (error) {
        //                                 MessageBox.error("Error while deleting product or characteristics: " + error.message);
        //                             }
        //                         });
        //                     },
        //                     error: function (error) {
        //                         MessageBox.error("Error while reading characteristics: " + error.message);
        //                     }
        //                 });
        //             }
        //         }
        //     });
        // },
      
   
    
    
    });
});
