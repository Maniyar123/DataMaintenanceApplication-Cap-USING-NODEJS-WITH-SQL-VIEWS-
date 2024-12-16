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
        
        onListItemPress: function(oEvent) {
            // Get the selected item from the event
            var oSelectedItem = oEvent.getParameter("listItem");
        
            // Get the binding context of the selected item
            var oBindingContext = oSelectedItem.getBindingContext("vcpmodel");
            var oGModel = this.getOwnerComponent().getModel("globalModelvcp");
        
            if (oBindingContext) {
                // Access properties via the binding context
                var sID = oBindingContext.getProperty("interface_ID");
                var sName = oBindingContext.getProperty("interface_Name");
        
                // Log the properties (optional)
                // console.log("Selected ID: ", sID);
                // console.log("Selected Name: ", sName);
        
                // Set the selected values to the global model
                oGModel.setProperty("/id", sID);
                oGModel.setProperty("/name", sName);
        
                // Publish event to navigate to the detail page
                this.bus.publish("flexible", "setDetailPage", {
                    id: sID,
                    name: sName
                });
            } else {
                console.error("Binding context is undefined.");
            }
        },
        
        
        onLiveChange: function (oEvent) {
            // Get the value entered in the SearchField
            var sQuery = oEvent.getParameter("newValue");
            var oList = this.byId("listItems");
            var oBinding = oList.getBinding("items");
        
            // Apply the filter only if there is a query
            if (sQuery) {
                var oFilter = new sap.ui.model.Filter({
                    path: "interface_Name", // Property to filter
                    operator: sap.ui.model.FilterOperator.Contains,
                    value1: sQuery,
                    caseSensitive: false // Ensure case-insensitive filtering
                });
                oBinding.filter([oFilter]);
            } else {
                // Clear the filter if the query is empty
                oBinding.filter([]);
            }
        }

    });
}); 