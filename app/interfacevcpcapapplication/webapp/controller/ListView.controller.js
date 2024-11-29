sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
], (Controller) => {
    "use strict";
    var that;

    return Controller.extend("com.interfacevcpcapapplication.controller.ListView", {
        onInit() {
            var that = this;
            var oModel = this.getOwnerComponent().getModel("vcpmodel");
            this.getView().setModel(oModel);
            this.bus = this.getOwnerComponent().getEventBus();
        },
        // onListItemPress: function(oEvent) {
        //     // Debugging: Check the selected item context
        //     var oBindingContext = oEvent.getParameter("listItem").getBindingContext("vcpmodel");
            
        //     if (!oBindingContext) {
        //         console.error("Binding context not found for the selected item.");
        //         return;
        //     }
        
        //     var selectedItem = oBindingContext.getObject();
        //     if (!selectedItem) {
        //         console.error("No data found in the binding context.");
        //         return;
        //     }
        
        //     // Retrieve the ID of the selected item
        //     var selectedItemId = selectedItem.interface_ID;
        
        //     // Publish the event with the selected item ID
        //     this.bus.publish("flexible", "setDetailPage", { selectedItemId });
        // }
        onListItemPress: function () {
            // Publish the event to load the detail page
            this.bus.publish("flexible", "setDetailPage");
        }
        
        
        
        
    });
});