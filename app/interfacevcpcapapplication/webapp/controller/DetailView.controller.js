sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/Tree",
    "sap/m/StandardTreeItem",
    "sap/ui/model/json/JSONModel",
    "sap/m/BusyDialog"
], function (Controller, ODataModel, Tree, StandardTreeItem, JSONModel, BusyDialog) {
    "use strict";

    return Controller.extend("com.interfacevcpcapapplication.controller.DetailView", {

        onInit: function () {
            this.bus = this.getOwnerComponent().getEventBus();
            this.bus.subscribe("flexible", "setDetailPage", this.setDetailPage, this);
            this._busyDialog = new BusyDialog(); // Initialize the BusyDialog
        },

        getData: function (sInterfaceID) {
            var oModel = this.getOwnerComponent().getModel("vcpmodel");

            // Open the BusyDialog before starting data load
            this._busyDialog.open();

            oModel.read("/interface_View", {
                success: function (oData) {
                    if (!oData || !oData.results) {
                        console.error("No data found for the interface.");
                        this._busyDialog.close(); // Close the BusyDialog on failure
                        return;
                    }

                    // Filter data based on SERVICE_ID
                    var filteredData = oData.results.filter(function (item) {
                        return item.SERVICE_ID === sInterfaceID;
                    });

                    if (filteredData.length > 0) {
                        // Group data by SERVICE_TYPENAME and assign the correct CRUD operations
                        var groupedData = this._groupDataWithCRUD(filteredData);

                        // Set the grouped data to the model to bind to Tree
                        var oTreeModel = new JSONModel({ SERVICE_TYPES: groupedData });
                        this.getView().setModel(oTreeModel, "treeModel");
                    } else {
                        console.error("No matching data found for the interface ID.");
                    }

                    // Close the BusyDialog after data load is complete
                    this._busyDialog.close();
                }.bind(this),

                error: function (oError) {
                    console.error("Error fetching interface data: ", oError);

                    // Close the BusyDialog in case of an error
                    this._busyDialog.close();
                }
            });
        },

        onAfterRendering: function () {
            var oGModel = this.getOwnerComponent().getModel("globalModelvcp");
            var sInterfaceID = oGModel.getProperty("/id");
            this.getData(sInterfaceID); // Call getData with interface ID
        },

        setDetailPage: function (sChannel, sEvent, oData) {
            var sInterfaceID = oData.id;
            this.getData(sInterfaceID);
        },

        _groupDataWithCRUD: function (data) {
            var grouped = [];
            var uniqueTypes = new Set(); // Track unique SERVICE_TYPENAME values
        
            // Set to track already added combinations of SERVICE_TYPENAME and PARAMETER_ID
            var addedOperations = new Map();
        
            data.forEach(function (item) {
                var serviceType = item.SERVICE_TYPENAME; // Get SERVICE_TYPENAME
                var parameterId = item.PARAMETER_ID; // Get PARAMETER_ID
        
                // Ensure the item has a valid SERVICE_TYPENAME before processing
                if (!serviceType) {
                    console.error("Missing SERVICE_TYPENAME for item:", item);
                    return; // Skip this item if SERVICE_TYPENAME is missing
                }
        
                // Initialize the group for the serviceType if not already done
                if (!uniqueTypes.has(serviceType)) {
                    uniqueTypes.add(serviceType);
                    grouped.push({
                        name: serviceType,
                        nodes: [] // Initialize an empty array for nodes
                    });
                }
        
                // Find the group for the serviceType
                var serviceGroup = grouped.find(function (group) {
                    return group.name === serviceType;
                });
        
                // Create a unique key based on SERVICE_TYPENAME and PARAMETER_ID
                var uniqueKey = serviceType + "_" + parameterId;
        
                // Now, add nodes based on PARAMETER_ID if it's not 0 and if not already added
                if (parameterId !== 0 && !addedOperations.has(uniqueKey)) {
                    var operation = "";
        
                    // Assign the operation based on PARAMETER_ID
                    switch (parameterId) {
                        case 1:
                            operation = "Create:";
                            break;
                        case 2:
                            operation = "Read:";
                            break;
                        case 3:
                            operation = "Update:";
                            break;
                        case 4:
                            operation = "Delete:";
                            break;
                        default:
                            console.log("Unknown PARAMETER_ID:", parameterId);
                            return; // Skip unknown operations
                    }
        
                    // Add operation to the group if it's not already added for this SERVICE_TYPENAME and PARAMETER_ID
                    if (serviceGroup && operation) {
                        serviceGroup.nodes.push({ name: operation });
                        addedOperations.set(uniqueKey, true); // Mark this combination as added
                    }
                }
            });
        
            return grouped;
        }

    });
});