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
        
        // _onRouteMatched: function (oEvent) {
        //     // Get the productId from the route parameter
        //     var sProductId = oEvent.getParameter("arguments").productId;
        //     var iProductId = sProductId; // Convert to integer

        //     console.log(iProductId, "Product ID from route");

        //     // Get the OData model
        //     var oModel = this.getView().getModel("productclassmodel");

        //     // Read characteristics data from OData
        //     oModel.read("/productclasscalview", {
        //         success: function (oData) {
        //             // var aCharacteristics = oData.results; // Get the characteristics data

        //             // // Filter characteristics based on productId
        //             // var aFilteredCharacteristics = aCharacteristics.filter(function (item) {
        //             //     return item.PRODUCTID === iProductId; // Compare as integers
        //             // });

        //             // // Create a new model for the filtered data
        //             // // var oFilteredModel = new sap.ui.model.json.JSONModel({
        //             // //     items: aFilteredCharacteristics
        //             // // });
        //             // var oModel = new sap.ui.model.json.JSONModel();
        //             // oModel.setData({
        //             //     items: aFilteredCharacteristics
        //             // })

        //             // // Set the filtered model to the table
        //             // // var oCharFragment = this.byId("characteristicsForm");
        //             // // oCharFragment.setModel(oFilteredModel);
        //             //  this.getView().setModel(oFilteredModel, "oModel");
        //          //   sap.ui.getCore().byId("characteristicsForm").setModel(oModel);
        //          var aCharacteristics = oData.results; // Get the characteristics data
 
        //          // Filter characteristics based on productId
        //          var aFilteredCharacteristics = aCharacteristics.filter(function (item) {
        //              return item.PRODUCTID === iProductId; // Compare as integers
        //          });
                  
        //          // Create a new model for the filtered data
        //          var oModel = new sap.ui.model.json.JSONModel();
        //          oModel.setData({
        //              items: aFilteredCharacteristics
        //          });
                  
        //          // Set the filtered model to the view
        //          this.getView().setModel(oModel, "characteristicData");
        //             // Store filtered data for later use
        //             this._filteredCharacteristicsData = oFilteredModel;

        //         }.bind(this), 
        //         error: function () {
        //             MessageToast.show("Failed to fetch characteristics.");
        //         }
        //     });
        // },
        
        // _onRouteMatched: function (oEvent) {
        //     // Get the productId from the route parameter
        //     var sProductId = oEvent.getParameter("arguments").productId;
        //     var iProductId = sProductId ;

        //     console.log(iProductId, "Product ID from route");

        //     // Get the OData model
        //     var oModel = this.getView().getModel("productclassmodel");

        //     // Read characteristics data from OData
        //     oModel.read("/productclasscalview", {
        //         success: function (oData) {
        //             var aCharacteristics = oData.results; // Get the characteristics data

        //             // Filter characteristics based on productId
        //             var aFilteredCharacteristics = aCharacteristics.filter(function (item) {
        //                 return item.PRODUCTID === iProductId; // Compare as integers
        //             });

        //             // Create a new model for the filtered data
        //             var oFilteredModel = new sap.ui.model.json.JSONModel();
        //             oFilteredModel.setData({
        //                 items: aFilteredCharacteristics
        //             });

        //             // Set the filtered model to the view
        //             this.getView().setModel(oFilteredModel, "characteristicData");

        //             // Optionally: Group the filtered data
        //             this._addGroupHeader(oFilteredModel);
        //         }.bind(this),
        //         error: function () {
        //             MessageToast.show("Failed to fetch characteristics.");
        //         }
        //     });
        // },
        _onRouteMatched: function (oEvent) {
            var sProductId = oEvent.getParameter("arguments").productId;
            var oModel = this.getView().getModel("productclassmodel");
        
            oModel.read("/productclasscalview", {
                success: function (oData) {
                    var allProducts = oData.results;
        
                    // Find the CLASSID of the selected product
                    var selectedProduct = allProducts.find(product => product.PRODUCTID === sProductId);
                    if (selectedProduct) {
                        var classId = selectedProduct.CLASSID_CLASSID;
        
                        // Custom filter logic to get products with the same CLASSID
                        var filteredProducts = allProducts.filter(product => product.CLASSID_CLASSID === classId);
        
                        // Sort filtered products by PRODUCTID
                        filteredProducts.sort(function (a, b) {
                            return a.PRODUCTID.localeCompare(b.PRODUCTID);
                        });
        
                        // Group products by PRODUCTID and separate characteristics
                        var groupedProducts = [];
                        var currentProductId = null;
        
                        filteredProducts.forEach(function (item) {
                            // Check if we are at a new product ID
                            if (item.PRODUCTID !== currentProductId) {
                                currentProductId = item.PRODUCTID;
        
                                // Create a group header for the new PRODUCTID
                                groupedProducts.push({
                                    isGroupHeader: true,
                                    PRODUCTID: currentProductId,
                                });
        
                                // Add characteristics only for the current product ID
                                var characteristics = filteredProducts.filter(prod => prod.PRODUCTID === currentProductId);
                                characteristics.forEach(function (char) {
                                    if (char.PRODUCTID === currentProductId) {
                                        groupedProducts.push(char);
                                    }
                                });
                            }
                        });
        
                        // Create a new model for the grouped data
                        var oGroupedModel = new sap.ui.model.json.JSONModel();
                        oGroupedModel.setData({ items: groupedProducts });
        
                        // Set the grouped model to the view
                        this.getView().setModel(oGroupedModel, "characteristicData");
                    }
                }.bind(this),
                error: function () {
                    MessageToast.show("Failed to fetch products.");
                }
            });
        } ,
        
        // _addGroupHeader: function (oFilteredModel) {
        //     var aItems = oFilteredModel.getData().items;
        //     var aGroupedItems = [];
        //     var currentId = "";

        //     aItems.forEach(function (item) {
        //         if (item.PRODUCTID !== currentId) {
        //             currentId = item.PRODUCTID;
        //             // Create a group header
        //             aGroupedItems.push({
        //                 isGroupHeader: true,
        //                 PRODUCTID: currentId
        //             });
        //         }
        //         // Push the actual item data
        //         aGroupedItems.push(item);
        //     });

        //     // Update the model with the grouped data
        //     oFilteredModel.setData({ items: aGroupedItems });
        // },
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
