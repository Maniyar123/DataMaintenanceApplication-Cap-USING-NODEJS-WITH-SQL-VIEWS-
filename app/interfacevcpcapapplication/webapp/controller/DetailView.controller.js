sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/Panel",
    "sap/m/VBox",
    "sap/m/Input",
    "sap/ui/layout/form/SimpleForm"
], function (Controller, Panel, VBox, Input, SimpleForm) {
    "use strict";

    return Controller.extend("com.interfacevcpcapapplication.controller.DetailView", {
        onInit: function () {
            this.bus = this.getOwnerComponent().getEventBus();
            this.bus.subscribe("flexible", "setDetailPage", this.onListItemPress, this);
        },

        // Triggered when an item is clicked on the list page
        onListItemPress: function () {
            const oModel = this.getOwnerComponent().getModel("vcpmodel"); // Default OData model

            // Fetch data from the 'SERVICETYPE' entity
            oModel.read("/SERVICETYPE", {
                success: (oData) => {
                    console.log("Fetched SERVICETYPE data:", oData); // Debugging the response

                    // Use "results" instead of "value"
                    if (oData.results && oData.results.length > 0) {
                        // Dynamically create panels based on service_TypeName
                        this._createPanels(oData.results);
                    } else {
                        console.warn("No data found in SERVICETYPE results");
                    }
                },
                error: (oError) => {
                    console.error("Failed to fetch SERVICETYPE data", oError);
                }
            });
        },

        // Dynamically create panels for each service_TypeName
        _createPanels: function (aServiceTypes) {
            const oVBox = this.byId("vboxContainer"); // Parent container
            oVBox.destroyItems(); // Clear previous panels

            // Loop through the service types and create a panel for each
            aServiceTypes.forEach((oServiceType) => {
                const sServiceTypeName = oServiceType.service_TypeName;

                // Create a panel
                const oPanel = new Panel({
                    headerText: sServiceTypeName,
                    expandable: true,
                    expanded: false, // Initially collapsed
                    content: [
                        // Placeholder VBox for CRUD inputs, initially empty
                        new VBox({
                            items: []
                        })
                    ],
                    expand: this._onPanelExpand.bind(this, sServiceTypeName)
                });

                // Add the panel to the parent VBox
                oVBox.addItem(oPanel);
            });
        },

        // Triggered when a panel is expanded
        _onPanelExpand: function (sServiceTypeName, oEvent) {
            const oPanel = oEvent.getSource();
            const oVBox = oPanel.getContent()[0]; // Access the VBox inside the panel

            // Check if inputs are already added
            if (oVBox.getItems().length === 0) {
                console.log(`Adding CRUD inputs for ${sServiceTypeName}`); // Debugging

                // Add CRUD inputs (Create, Read, Update, Delete)
                ["Create", "Read", "Update", "Delete"].forEach((sAction) => {
                    const oInput = new Input({
                        placeholder: `${sAction} ${sServiceTypeName}`
                    });
                    oVBox.addItem(oInput);
                });
            }
        },

        onExit: function () {
            this.bus.unsubscribe("flexible", "setDetailPage", this.onListItemPress, this);
        }
    });
});
