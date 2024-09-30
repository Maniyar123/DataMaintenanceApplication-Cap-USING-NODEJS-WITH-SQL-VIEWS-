sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
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
        // onRowSelected: function (oEvent) {
        //     var oSelectedItem = oEvent.getSource();
        //     var oContext = oSelectedItem.getBindingContext();
        //     var sProductID = oContext.getProperty("productID");  // Assuming the binding path has "productID"
           
        
        //     // Publish the Product ID via EventBus
        //     var oEventBus = this.getOwnerComponent().getEventBus();
        //     console.log("Publishing event with productID: ", sProductID);
        //     oEventBus.publish("flexible", "setDetailPage", { productID: sProductID });
        // }
        onRowSelected: function (oEvent) {
            var oSelectedItem = oEvent.getSource();
            var oContext = oSelectedItem.getBindingContext();
            var sProductID = oContext.getProperty("productID");  // Assuming the binding path has "productID"
            
            // Log the selected Product ID for debugging
            console.log("Selected Product ID: ", sProductID);
        
            // Use setTimeout to publish the Product ID via EventBus
            var oEventBus = this.getOwnerComponent().getEventBus();
            setTimeout(function () {
                console.log("Publishing productID after delay: ", sProductID);
                oEventBus.publish("flexible", "setDetailPage", { productID: sProductID });
            }.bind(this), 1000); // Adjust the delay as necessary
        }
        
    });
});
