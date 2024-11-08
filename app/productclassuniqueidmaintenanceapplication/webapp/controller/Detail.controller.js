sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
function (Controller, JSONModel) {
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

        // Method to fetch product and characteristic data with custom filtering
        getData: function (suniqueID, characteristicIDs) {
            // Get the OData model for the service
            var oModel = this.getOwnerComponent().getModel("cat3model");

            // Fetch all the data for the product class
            oModel.read("/productclassunicalview", {
                success: function (oData) {
                    if (!oData || !oData.results) {
                        console.error("No data returned from the productclassunicalview service.");
                        return;
                    }

                    // Ensure characteristicIDs is an array (in case it's a string)
                    if (typeof characteristicIDs === "string") {
                        characteristicIDs = characteristicIDs.split(",");  // Convert comma-separated string to array
                    }

                    // Custom filter to match UNIQUEID and CHARACTERISTICID
                    var aFilteredProducts = oData.results.filter(function (item) {
                        // Check if UNIQUEID matches and CHARACTERISTICID is in the array of characteristicIDs
                        return item.UNIQUEID === suniqueID && characteristicIDs.includes(item.CHARACTERISTICID);
                    });

                    // Check if any products match the filter
                    if (aFilteredProducts.length === 0) {
                        console.warn("No products found for UNIQUEID: " + suniqueID + " and CHARACTERISTICID: " + characteristicIDs.join(", "));
                        return;
                    }

                    // Set the filtered data into a JSONModel and bind it to the view
                    var oFilteredModel = new JSONModel(aFilteredProducts);
                    console.log("Filtered Model Data:", oFilteredModel.getData());
                    this.getView().setModel(oFilteredModel, "productDetails");

                    // Optionally refresh the table binding
                    this.getView().byId("productClassTable").getBinding("items").refresh();
                }.bind(this),
                error: function (oError) {
                    console.error("Error fetching product details: ", oError);
                    // Optionally handle the error, e.g., show a message to the user
                }
            });
        },

        // Triggered after the view is rendered
        onAfterRendering: function () {
            var oGModel = this.getOwnerComponent().getModel("globalModel");
            var suniqueID = oGModel.getProperty("/uniqueID");
            var characteristicIDs = oGModel.getProperty("/characteristicIDs");
            this.getData(suniqueID, characteristicIDs); // Pass both the uniqueID and characteristicIDs to getData
        },

        // Unsubscribe from EventBus to avoid memory leaks
        onExit: function () {
            this.bus.unsubscribe("flexible", "setDetailPage", this._onProductIDReceived, this);
        },

        // Method triggered when productID is received via EventBus
        _onProductIDReceived: function (sChannel, sEvent, oData) {
            var suniqueID = oData.uniqueID;
            var characteristicID = oData.characteristicIDs;

            // Get the OData model for the service
            var oModel = this.getOwnerComponent().getModel("cat3model");

            // Fetch the product class data for PRODUCTID and CHARACTERISTICID
            oModel.read("/productclassunicalview", {
                success: function (oData) {
                    if (!oData || !oData.results) {
                        console.error("No data returned from the productclassunicalview service.");
                        return;
                    }

                    // Ensure characteristicIDs is an array (in case it's a string)
                    if (typeof characteristicID === "string") {
                        characteristicID = characteristicID.split(",");  // Convert comma-separated string to array
                    }

                    // Custom filter to match UNIQUEID and CHARACTERISTICID
                    var aFilteredProducts = oData.results.filter(function (item) {
                        // Check if UNIQUEID matches and CHARACTERISTICID is in the array of characteristicIDs
                        return item.UNIQUEID === suniqueID && characteristicID.includes(item.CHARACTERISTICID);
                    });

                    // Check if any products match the filter
                    if (aFilteredProducts.length === 0) {
                        console.warn("No products found for UNIQUEID: " + suniqueID + " and CHARACTERISTICID: " + characteristicID.join(", "));
                        return;
                    }

                    // Set the filtered data into a JSONModel and bind it to the view
                    var oFilteredModel = new JSONModel(aFilteredProducts);
                    console.log("Filtered Model Data:", oFilteredModel.getData());
                    this.getView().setModel(oFilteredModel, "productDetails");

                    // Optionally refresh the table binding
                    this.getView().byId("productClassTable").getBinding("items").refresh();
                }.bind(this),
                error: function (oError) {
                    console.error("Error fetching product details: ", oError);
                    // Optionally handle the error, e.g., show a message to the user
                }
            });
        }
    });
});
