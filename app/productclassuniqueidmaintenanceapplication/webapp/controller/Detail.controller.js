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

            // Unsubscribe to avoid memory leaks
            onExit: function () {
                this.bus.unsubscribe("flexible", "setDetailPage", this._onProductIDReceived, this);
            },

            // Method triggered when productID is received
            _onProductIDReceived: function (sChannel, sEvent, oData) {
                var sProductID = oData.productID;

                // Get the OData model
                var oModel = this.getView().getModel("cat3model");

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
            onDetailItemPress:function(){
                
            }

        });
    });
