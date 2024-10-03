sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    function (Controller) {
        "use strict";
        var that;
        return Controller.extend("com.productclassuniqueidmaintenanceapplication.controller.Detail", {
            onInit: function () {
                that = this;

                // Set up model for the view
                // var oModel = this.getOwnerComponent().getModel("cat3model");
                // this.getView().setModel(oModel);

                // Subscribe to EventBus to receive the productID from ListView
                console.log("Subscribing to EventBus");
                this.bus = this.getOwnerComponent().getEventBus();
                this.bus.subscribe("flexible", "setDetailPage", this._onProductIDReceived, this);

                
            },
            // ---new method to get the product data 
            getData:function(sProductID){
                 // Get the OData model
                 var oModel = this.getOwnerComponent().getModel("cat3model");

                 // Read the data for PRODUCTID
                 oModel.read("/productclassunicalview", {
                     success: function (oData) {
                         if (!oData || !oData.results) {
                             console.error("No data returned from the productclassunicalview service.");
                             return;
                         }
 
                         // Filter the product details based on the PRODUCTID
                         var aFilteredProducts = oData.results.filter(function (item) {
                             return item.PRODUCTID === sProductID;
                         });
 
                         // Check if any products match the filter
                         if (aFilteredProducts.length === 0) {
                             console.warn("No products found for PRODUCTID: " + sProductID);
                             return;
                         }
 
                         // Set the filtered data to the Detail View
                         var oFilteredModel = new sap.ui.model.json.JSONModel(aFilteredProducts);
                         console.log("Filtered Model Data:", oFilteredModel.getData());
                         this.getView().setModel(oFilteredModel, "productDetails");
                         
 
                         // Optional: Log the filtered data
                         console.log("Filtered Products:", aFilteredProducts);
                           // Optionally refresh the table binding if needed
                     this.getView().byId("productClassTable").getBinding("items").refresh(); // Ensure this matches your table ID
 
                     }.bind(this),
                     error: function (oError) {
                         console.error("Error fetching product details: ", oError);
                         // Optionally handle the error, e.g., show a message to the user
                     }
                 });
            },

            onAfterRendering:function(){
                var oGModel = this.getOwnerComponent().getModel("globalModel");
                var sProductID = oGModel.getProperty("/productID");
                this.getData(sProductID);
            },

            // Unsubscribe to avoid memory leaks
            onExit: function () {
                this.bus.unsubscribe("flexible", "setDetailPage", this._onProductIDReceived, this);
            },

            // Method triggered when productID is received
            _onProductIDReceived: function (sChannel, sEvent, oData) {
                var sProductID = oData.productID;

                // Get the OData model
                var oModel = this.getOwnerComponent().getModel("cat3model");

                // Read the data for PRODUCTID
                oModel.read("/productclassunicalview", {
                    success: function (oData) {
                        if (!oData || !oData.results) {
                            console.error("No data returned from the productclassunicalview service.");
                            return;
                        }

                        // Filter the product details based on the PRODUCTID
                        var aFilteredProducts = oData.results.filter(function (item) {
                            return item.PRODUCTID === sProductID;
                        });

                        // Check if any products match the filter
                        if (aFilteredProducts.length === 0) {
                            console.warn("No products found for PRODUCTID: " + sProductID);
                            return;
                        }

                        // Set the filtered data to the Detail View
                        var oFilteredModel = new sap.ui.model.json.JSONModel(aFilteredProducts);
                        console.log("Filtered Model Data:", oFilteredModel.getData());
                        this.getView().setModel(oFilteredModel, "productDetails");
                        

                        // Optional: Log the filtered data
                        console.log("Filtered Products:", aFilteredProducts);
                          // Optionally refresh the table binding if needed
                    this.getView().byId("productClassTable").getBinding("items").refresh(); // Ensure this matches your table ID

                    }.bind(this),
                    error: function (oError) {
                        console.error("Error fetching product details: ", oError);
                        // Optionally handle the error, e.g., show a message to the user
                    }
                });
            },

            // onInit: function () {
            //     // Subscribe to the EventBus
            //     this.bus = this.getOwnerComponent().getEventBus();
            //     this.bus.subscribe("flexible", "setDetailPage", this._onProductIDReceived, this);
            //     console.log("Subscribed to EventBus");
    
            //     // Load the default product dynamically
            //     this._setDefaultProductID();
            // },
    
            // _setDefaultProductID: function () {
            //     // Get the model from the owner component
            //     var oModel = this.getOwnerComponent().getModel("cat3model");
            //     if (oModel) {
            //         // Assuming the model has a property that lists products, e.g., "/Products"
            //         oModel.read("/productclassunicalview", {
            //             success: function (data) {
            //                 if (data && data.results && data.results.length > 0) {
            //                     // Select the first product as the default
            //                     var defaultProductID = data.results[0].PRODUCTID; // Adjust according to your data structure
            //                     console.log("Default Product ID set to: ", defaultProductID);
            //                     this._loadProductData(defaultProductID);
            //                 } else {
            //                     console.warn("No products found in the model.");
            //                 }
            //             }.bind(this),
            //             error: function (error) {
            //                 console.error("Error fetching products: ", error);
            //             }
            //         });
            //     } else {
            //         console.error("Model 'cat3model' is not available on the owner component.");
            //     }
            // },
    
            // _onProductIDReceived: function (sChannel, sEvent, oData) {
            //     console.log("Received productID via EventBus: ", oData.productID);
            //     if (oData && oData.productID) {
            //         this._loadProductData(oData.productID);
            //     } else {
            //         console.warn("No productID received.");
            //     }
            // },
    
            // _loadProductData: function (PRODUCTID) {
            //     var oModel = this.getOwnerComponent().getModel("cat3model");
            //     if (!oModel) {
            //         console.error("OData model 'cat3model' is not available.");
            //         return; // Exit the function if the model is not available
            //     }
    
            //     // Adjust the path to your specific entity
            //     var sPath = "/productclassunicalview(" + PRODUCTID + ")"; // Ensure the correct path is being used
    
            //     oModel.read(sPath, {
            //         success: function (productDetails) {
            //             console.log("Data received: ", productDetails);
            //             this.getView().getModel("cat3model").setProperty("/detailData", productDetails); // Bind the data to your detail table
            //         }.bind(this), // Important to bind the context to 'this'
            //         error: function (error) {
            //             console.error("Error fetching data: ", error);
            //         }
            //     });
            // }


            // onInit: function () {
            //     // Subscribe to the EventBus
            //     this.bus = this.getOwnerComponent().getEventBus();
            //     this.bus.subscribe("flexible", "setDetailPage", this._onProductIDReceived, this);
            //     console.log("Subscribed to EventBus");
            
            //     // Attach request completed event to ensure the model is loaded
            //     var oModel = this.getOwnerComponent().getModel("cat3model");
            //     if (oModel) {
            //         oModel.attachRequestCompleted(this._onRequestCompleted, this);
            //     } else {
            //         console.error("Model 'cat3model' is not available on the owner component.");
            //     }
            // },
            
            // onExit: function () {
            //     // Unsubscribe from EventBus
            //     this.bus.unsubscribe("flexible", "setDetailPage", this._onProductIDReceived, this);
            //     console.log("Unsubscribed from EventBus");
                
            //     // Detach request completed event
            //     var oModel = this.getOwnerComponent().getModel("cat3model");
            //     if (oModel) {
            //         oModel.detachRequestCompleted(this._onRequestCompleted, this);
            //     }
            // },
            
            // _onRequestCompleted: function () {
            //     console.log("Model request completed. Proceeding to load default product.");
            //     // Load the default product dynamically
            //     this._setDefaultProductID();
            // },
            
            // _setDefaultProductID: function () {
            //     // Get the model from the owner component
            //     var oModel = this.getOwnerComponent().getModel("cat3model");
            //     if (oModel) {
            //         // Read the product class view
            //         oModel.read("/productclassunicalview", {
            //             success: function (data) {
            //                 if (data && data.results && data.results.length > 0) {
            //                     // Select the first product as the default
            //                     var defaultProductID = data.results[0].PRODUCTID; // Adjust according to your data structure
            //                     console.log("Default Product ID set to: ", defaultProductID);
            //                     this._loadProductData(defaultProductID);
            //                 } else {
            //                     console.warn("No products found in the model.");
            //                 }
            //             }.bind(this),
            //             error: function (error) {
            //                 console.error("Error fetching products: ", error);
            //             }
            //         });
            //     } else {
            //         console.error("Model 'cat3model' is not available on the owner component.");
            //     }
            // },
            
            // _onProductIDReceived: function (sChannel, sEvent, oData) {
            //     console.log("Received productID via EventBus: ", oData.productID);
            //     if (oData && oData.productID) {
            //         var sProductID = oData.productID;
            
            //         // Get the OData model
            //         var oModel = this.getView().getModel("cat3model");
            
            //         // Read the data for PRODUCTID
            //         oModel.read("/productclassunicalview", {
            //             success: function (oData) {
            //                 if (!oData || !oData.results) {
            //                     console.error("No data returned from the productclassunicalview service.");
            //                     return;
            //                 }
            
            //                 // Filter the product details based on the PRODUCTID
            //                 var aFilteredProducts = oData.results.filter(function (item) {
            //                     return item.PRODUCTID === sProductID;
            //                 });
            
            //                 // Check if any products match the filter
            //                 if (aFilteredProducts.length === 0) {
            //                     console.warn("No products found for PRODUCTID: " + sProductID);
            //                     return;
            //                 }
            
            //                 // Set the filtered data to the Detail View
            //                 var oFilteredModel = new sap.ui.model.json.JSONModel(aFilteredProducts);
            //                 console.log("Filtered Model Data:", oFilteredModel.getData());
            //                 this.getView().setModel(oFilteredModel, "productDetails");
            
            //                 // Optional: Log the filtered data
            //                 console.log("Filtered Products:", aFilteredProducts);
                            
            //                 // Optionally refresh the table binding if needed
            //                 this.getView().byId("productClassTable").getBinding("items").refresh(); // Ensure this matches your table ID
            
            //             }.bind(this),
            //             error: function (oError) {
            //                 console.error("Error fetching product details: ", oError);
            //                 // Optionally handle the error, e.g., show a message to the user
            //             }
            //         });
            //     } else {
            //         console.warn("No productID received.");
            //     }
            // },
            
            // _loadProductData: function (PRODUCTID) {
            //     var oModel = this.getOwnerComponent().getModel("cat3model");
            //     if (!oModel) {
            //         console.error("OData model 'cat3model' is not available.");
            //         return; // Exit the function if the model is not available
            //     }
            
            //     // Adjust the path to your specific entity
            //     var sPath = "/productclassunicalview(" + PRODUCTID + ")"; // Ensure the correct path is being used
            
            //     oModel.read(sPath, {
            //         success: function (productDetails) {
            //             console.log("Data received: ", productDetails);
            //             this.getView().getModel("cat3model").setProperty("/detailData", productDetails); // Bind the data to your detail view
            //         }.bind(this), // Important to bind the context to 'this'
            //         error: function (error) {
            //             console.error("Error fetching data: ", error);
            //         }
            //     });
            // },
            onCreateCharacteristic:function(){
                
            }
            
        });
    });
