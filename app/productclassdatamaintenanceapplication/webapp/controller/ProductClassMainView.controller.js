sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";
    var that;

    return Controller.extend("com.productclassdatamaintenanceapplication.controller.ProductClassMainView", {
        onInit: function () {
            that=this;
            var oModel = this.getOwnerComponent().getModel("productclassmodel");
                this.getView().setModel(oModel);
        },

        onAddProduct: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("AddProductView");
        },
        
        onProductPress: function (oEvent) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            var oContext = oEvent.getSource().getBindingContext();
            var sProductId = oContext.getProperty("PRODUCTID");

              // Store the productId in the component model
            // var oComponentModel = this.getOwnerComponent().getModel("productclassmodel");
            // oComponentModel.setProperty("/selectedProductId", sProductId);

             // Navigate to the CharacteristicsView
            //  oRouter.navTo("ProductCharacteristicsView");
             
            // Navigate to the CharacteristicsView, passing the product ID as a route parameter
            oRouter.navTo("ProductCharacteristicsView", {
                productId: sProductId
            });
        }
    });
});
