sap.ui.define([
    "sap/ui/core/mvc/Controller",
     "sap/ui/core/routing/History",
     "sap/m/MessageToast",
     "sap/ui/model/Filter"
],
function (Controller,History,MessageToast,Filter) {
    "use strict";
   

    return Controller.extend("com.productclassdatamaintenanceapplication.controller.ProductCharacteristicsView", {
        onInit: function () {
            // Get the productId from the component model
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            oRouter.getRoute("ProductCharacteristicsView").attachPatternMatched(this._onRouteMatched, this);
        },
        
        _onRouteMatched: function (oEvent) {
            // Get the productId from the route parameter
            var sProductId = oEvent.getParameter("arguments").productId;
            var iProductId = parseInt(sProductId, 10); // Convert to integer

            console.log(iProductId, "Product ID from route");

            // Get the OData model
            var oModel = this.getView().getModel("productclassmodel");

            // Read characteristics data from OData
            oModel.read("/productclasscalview", {
                success: function (oData) {
                    // var aCharacteristics = oData.results; // Get the characteristics data

                    // // Filter characteristics based on productId
                    // var aFilteredCharacteristics = aCharacteristics.filter(function (item) {
                    //     return item.PRODUCTID === iProductId; // Compare as integers
                    // });

                    // // Create a new model for the filtered data
                    // // var oFilteredModel = new sap.ui.model.json.JSONModel({
                    // //     items: aFilteredCharacteristics
                    // // });
                    // var oModel = new sap.ui.model.json.JSONModel();
                    // oModel.setData({
                    //     items: aFilteredCharacteristics
                    // })

                    // // Set the filtered model to the table
                    // // var oCharFragment = this.byId("characteristicsForm");
                    // // oCharFragment.setModel(oFilteredModel);
                    //  this.getView().setModel(oFilteredModel, "oModel");
                 //   sap.ui.getCore().byId("characteristicsForm").setModel(oModel);
                 var aCharacteristics = oData.results; // Get the characteristics data
 
                 // Filter characteristics based on productId
                 var aFilteredCharacteristics = aCharacteristics.filter(function (item) {
                     return item.PRODUCTID === iProductId; // Compare as integers
                 });
                  
                 // Create a new model for the filtered data
                 var oModel = new sap.ui.model.json.JSONModel();
                 oModel.setData({
                     items: aFilteredCharacteristics
                 });
                  
                 // Set the filtered model to the view
                 this.getView().setModel(oModel, "characteristicData");
                    // Store filtered data for later use
                    this._filteredCharacteristicsData = oFilteredModel;

                }.bind(this), 
                error: function () {
                    MessageToast.show("Failed to fetch characteristics.");
                }
            });
        },
        onNavBack: function () {
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
