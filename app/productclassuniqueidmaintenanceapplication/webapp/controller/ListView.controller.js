sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Panel",
    "sap/m/List",
    "sap/m/MessageToast",
    "sap/m/StandardListItem",
    "sap/m/MessageBox",
    "com/productclassuniqueidmaintenanceapplication/util/formatter" // Adjust path if necessary


],
    function (Controller, Fragment, Filter, FilterOperator, Panel, List, MessageToast, StandardListItem, MessageBox, formatter) {
        "use strict";
        var that;
        let oLastSelectedRadioButton = null; // Initialize a variable to keep track of the currently selected radio button
        this.lastSelectedRadioButtons = {};
        return Controller.extend("com.productclassuniqueidmaintenanceapplication.controller.ListView", {
            formatter: formatter,

            onInit: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel("cat3model");
                this.getView().setModel(oModel);
                this.bus = this.getOwnerComponent().getEventBus();
                this._isDataLoaded = false; // Flag to track data loading status
                this.selectedProductID = null;


                // Fetch the product data from the OData service
                oModel.read("/product", {
                    success: function (oData) {
                        // Check if there are any products returned
                        if (oData.results && oData.results.length > 0) {
                            // Set the first product as the default product
                            var defaultProduct = {
                                productName: oData.results[0].productName,  // First product name
                                productID: oData.results[0].productID,      // First product ID
                                productDate: formatter.formatDate(oData.results[0].productDate) // Format date
                            };

                            // Set the default product to the model
                            oModel.setProperty("/selectedProduct", defaultProduct);

                            // Set the value of the Input field to the product name
                            that.getView().byId("productNameField").setValue(defaultProduct.productName);

                            // Optionally, filter the table by this product ID
                            that._filterTableByProduct(defaultProduct.productID);
                            console.log("Product Statuses:", oData.results.map(product => product.status));
                        } else {
                            // Handle the case where no products are returned
                            console.warn("No products found.");
                        }
                    },
                    error: function (oError) {
                        console.error("Error fetching product data: ", oError);
                    }
                });
            },
            // onInit: function () {// -------------in oninit functioanlity by defult i had set one product to the table(without active and inactive status functioanlity)-------------------
            //     that = this;
            //     var oModel = this.getOwnerComponent().getModel("cat3model");
            //     this.getView().setModel(oModel);
            //     this.bus = this.getOwnerComponent().getEventBus();
            //     this._isDataLoaded = false; // Flag to track data loading status
            //     this.selectedProductID = null;

            //     // oModel.setProperty("/sId", null); // Initialize the sId property

            //     // Fetch the product data from the OData service
            //     oModel.read("/product", {
            //         success: function (oData) {
            //             // Check if there are any products returned
            //             if (oData.results && oData.results.length > 0) {
            //                 // Set the first product as the default product
            //                 var defaultProduct = {
            //                     productName: oData.results[0].productName,  // First product name
            //                     productID: oData.results[0].productID       // First product ID
            //                 };

            //                 // Set the default product to the model
            //                 oModel.setProperty("/selectedProduct", defaultProduct);

            //                 // Set the value of the Input field to the product name
            //                 that.getView().byId("productNameField").setValue(defaultProduct.productName);

            //                 // Optionally, you can also filter the table by this product ID
            //                 that._filterTableByProduct(defaultProduct.productID);
            //                 console.log("Product Statuses:", oData.results.map(product => product.status));
            //             } else {
            //                 // Handle the case where no products are returned
            //                 console.warn("No products found.");
            //             }
            //         },
            //         error: function (oError) {
            //             console.error("Error fetching product data: ", oError);
            //         }
            //     });
            // },

            // onInit: function () { // -------------in oninit functioanlity by defult i had set one product to the table(---with active and inactive status functioanlity----)-------------------
            //     // Define 'that' for referencing the controller context
            //     var that = this;

            //     // Get the OData model
            //     var oModel = this.getOwnerComponent().getModel("cat3model");
            //     this.getView().setModel(oModel);
            //     this.bus = this.getOwnerComponent().getEventBus();
            //     this._isDataLoaded = false; // Flag to track data loading status
            //     this.selectedProductID = null;

            //     // Fetch the product data from the OData service
            //     oModel.read("/product", {
            //         success: function (oData) {
            //             // Check if there are any products returned
            //             if (oData.results && oData.results.length > 0) {
            //                 // Set the first product as the default product
            //                 var defaultProduct = {
            //                     productName: oData.results[0].productName,  // First product name
            //                     productID: oData.results[0].productID       // First product ID
            //                 };

            //                 // Set the default product to the model
            //                 oModel.setProperty("/selectedProduct", defaultProduct);

            //                 // Set the value of the Input field to the product name
            //                 that.getView().byId("productNameField").setValue(defaultProduct.productName);

            //                 // Optionally, filter the table by this product ID
            //                 that._filterTableByProduct(defaultProduct.productID);

            //                 // Log the product statuses for debugging
            //                 console.log("Product Statuses:", oData.results.map(product => product.status));

            //                 // Here, you can also ensure the table is populated with the product data
            //                 oModel.setProperty("/product", oData.results); // Assuming you have the correct binding for the product entity
            //             } else {
            //                 // Handle the case where no products are returned
            //                 console.warn("No products found.");
            //             }
            //         },
            //         error: function (oError) {
            //             console.error("Error fetching product data: ", oError);
            //         }
            //     });
            // },










            _filterTableByProduct: function (productID) { // ----Filter the Table Based on the Selected Product----
                var oTable = this.getView().byId("productTable");
                var oBinding = oTable.getBinding("items");

                // Apply filter based on the product ID
                var aFilters = [new sap.ui.model.Filter("productID", sap.ui.model.FilterOperator.EQ, productID)];
                oBinding.filter(aFilters);
            },




            onUniqueIDSearch: function (oEvent) { //----------search filed with filtartion based on( product id)------
                // Get the value from the search field
                var sQuery = oEvent.getParameter("newValue");

                // Create an array of filters
                var aFilters = [];
                if (sQuery && sQuery.length > 0) {
                    // Check if the query is numeric for uniqueID filtering
                    if (!isNaN(sQuery)) {
                        // If the query is numeric, apply an equality filter for uniqueID (assuming it's an integer)
                        var oUniqueIDFilter = new Filter("uniqueID", FilterOperator.EQ, parseInt(sQuery, 10));
                        aFilters.push(oUniqueIDFilter);
                    } else {
                        // Create a filter for description (string-based filtering)
                        var oDescriptionFilter = new Filter("description", FilterOperator.Contains, sQuery);
                        aFilters.push(oDescriptionFilter);
                    }
                }

                // Get the table and its binding
                var oTable = this.byId("productTable");
                var oBinding = oTable.getBinding("items");

                // Apply the filter
                oBinding.filter(aFilters, "Application");
            },
            // onUniqueIDSearch: function (oEvent) {//-------search field without filtartion----------
            //     // Get the value from the search field
            //     var sQuery = oEvent.getParameter("newValue");

            //     // Create an array of filters
            //     var aFilters = [];
            //     if (sQuery && sQuery.length > 0) {
            //         // Create a filter for uniqueID
            //         var oUniqueIDFilter = new Filter("uniqueID", FilterOperator.Contains, sQuery);

            //         // Create a filter for description
            //         var oDescriptionFilter = new Filter("description", FilterOperator.Contains, sQuery);

            //         // Combine filters using OR logic
            //         var oCombinedFilter = new sap.ui.model.Filter({
            //             filters: [oUniqueIDFilter, oDescriptionFilter],
            //             and: false // 'false' means OR condition
            //         });

            //         aFilters.push(oCombinedFilter);
            //     }

            //     // Get the table and its binding
            //     var oTable = this.byId("productTable");
            //     var oBinding = oTable.getBinding("items");

            //     // Apply the filter
            //     oBinding.filter(aFilters, "Application");
            // },





            //    ---------value help input field filtering product based on productid------------
            // ----value help fragment-----------




            onValueHelpProduct: function () {//-----------value help fragmnet open functioality----------
                var that = this; // Store reference to the controller for use inside callbacks
                this.selectedProductID = null;

                // Create value help dialog if it doesn't exist
                if (!this._valueHelpDialog) {
                    this._valueHelpDialog = sap.ui.xmlfragment(
                        "com.productclassuniqueidmaintenanceapplication.fragments.productSelectFragmnet",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialog);
                }

                // Fetch product data using the OData model's read method
                var oModel = this.getView().getModel();
                oModel.read("/product", {
                    success: function (oData) {
                        // Filter out duplicate products based on productID
                        var oUniqueProductsMap = {};
                        oData.results.forEach(function (product) {
                            if (!oUniqueProductsMap[product.productID]) {
                                oUniqueProductsMap[product.productID] = product;
                            }
                        });

                        // Convert the unique product map back to an array
                        var aUniqueProducts = Object.values(oUniqueProductsMap);

                        // Set the unique products data to a local JSON model
                        var oUniqueProductModel = new sap.ui.model.json.JSONModel();
                        oUniqueProductModel.setData({ product: aUniqueProducts });

                        // Bind the unique product data to the dialog's list
                        that._valueHelpDialog.setModel(oUniqueProductModel, "uniqueProductModel");

                        // Open the dialog
                        that._valueHelpDialog.open();
                    },
                    error: function (oError) {
                        // Handle error (e.g., show a message to the user)
                        sap.m.MessageToast.show("Failed to fetch product data.");
                    }
                });
            },

            onSelectProduct: function (oEvent) { //   -------------onSelectProduct functionality for inside value help data selection----------------
                // Get the selected item from the event
                var oSelectedItem = oEvent.getSource();

                // Get the binding context of the selected item
                var oContext = oSelectedItem.getBindingContext("uniqueProductModel"); // Use uniqueProductModel context

                if (!oContext) {
                    console.error("No binding context found for the selected item");
                    return;
                }

                // Get the product data from the context
                var oProduct = oContext.getObject(); // This will get the entire object for the selected item

                // Check if the product object is valid
                if (oProduct) {
                    var sProductName = oProduct.productName;  // Product name
                    var sProductID = oProduct.productID;      // Product ID

                    // Set the product name to the input field
                    this.getView().byId("productNameField").setValue(sProductName);

                    // Store the selected product ID in a controller property for later access
                    this.selectedProductID = sProductID; // Storing directly in the controller

                    // Optionally store the selected product ID in the model for further processing
                    var oModel = this.getView().getModel("cat3model");
                    oModel.setProperty("/selectedProduct/productID", sProductID);

                    // Log for debugging
                    console.log("Selected Product ID:", this.selectedProductID);
                }

                // Call the existing method to filter the table (assuming this method exists)
                this._filterTableByProduct(sProductID);

                // Close the dialog after selection
                this._valueHelpDialog.close();
            },

            onValueHelpDialogClose: function () { // ---------------value help close---------------------------
                this._valueHelpDialog.close();
            },
            // ----value help fragmnet-----------(------------value help fucntionality without filtering product--------------)
            // onValueHelpProduct: function () {
            //     this.selectedProductID = null;
            //     // Create value help dialog if it doesn't exist
            //     if (!this._valueHelpDialog) {
            //         this._valueHelpDialog = sap.ui.xmlfragment("com.productclassuniqueidmaintenanceapplication.fragments.productSelectFragmnet", this);
            //         this.getView().addDependent(this._valueHelpDialog);


            //     }

            //     // Open the dialog
            //     this._valueHelpDialog.open();
            // },
            // onSelectProduct: function (oEvent) {
            //     // Get the selected item from the event
            //     var oSelectedItem = oEvent.getSource();  // Use getSource()

            //     // Get the binding context of the selected item
            //     var oContext = oSelectedItem.getBindingContext();
            //     if (!oContext) {
            //         console.error("No binding context found for the selected item");
            //         return;
            //     }

            //     // Get the product data from the context
            //     var oProduct = oContext.getObject(); // This will get the entire object for the selected item

            //     // Check if the product object is valid
            //     if (oProduct) {
            //         var sProductName = oProduct.productName;  // Product name
            //         var sProductID = oProduct.productID;      // Product ID

            //         // Set the product name to the input field
            //         this.getView().byId("productNameField").setValue(sProductName);

            //         // Store the selected product ID in a controller property for later access
            //         this.selectedProductID = sProductID; // Storing directly in the controller

            //         // Optionally store the selected product ID in the model for further processing
            //         var oModel = this.getView().getModel("cat3model");
            //         oModel.setProperty("/selectedProduct/productID", sProductID);

            //         // Log for debugging
            //         console.log("Selected Product ID:", this.selectedProductID);
            //     }

            //     // Call the existing method to filter the table
            //     this._filterTableByProduct(sProductID);

            //     // Close the dialog after selection
            //     this._valueHelpDialog.close();
            // },


            // onValueHelpDialogClose: function () {
            //     this._valueHelpDialog.close();
            // },



            // ----This function will be triggered when a row in the table is clicked using global model(Og model)-----onrowselect of list view







            // onRowSelected: function (oEvent) { //---------onRowSelected with active and inactive functionality-----------
            //     // Get the selected item from the event
            //     var oSelectedItem = oEvent.getSource();
            //     var oContext = oSelectedItem.getBindingContext();

            //     // Ensure the binding context is valid
            //     if (!oContext) {
            //         MessageBox.error("No product context found.");
            //         return;
            //     }

            //     // Get the unique ID and status of the selected product
            //     var suniqueID = oContext.getProperty("uniqueID"); // Assuming the binding path has "uniqueID"
            //     var status = oContext.getProperty("status"); // Adjust according to your model property

            //     // Check if the product is inactive
            //     if (status === "inactive") {
            //         MessageBox.warning("Cannot view details for inactive product: " + suniqueID + ".");
            //         // Prevent navigation if the product is inactive
            //         return;
            //     }

            //     // Publish the Product ID via EventBus if the product is active
            //     var oEventBus = this.getOwnerComponent().getEventBus();
            //     console.log("Publishing event with uniqueID: ", suniqueID);
            //     var oGModel = this.getOwnerComponent().getModel("globalModel");
            //     oGModel.setProperty("/uniqueID", suniqueID);

            //     oEventBus.publish("flexible", "setDetailPage", { uniqueID: suniqueID });
            // },
            onRowSelected: function (oEvent) {
                // Get the selected item from the event
                var oSelectedItem = oEvent.getSource();
                var oContext = oSelectedItem.getBindingContext();

                // Ensure the binding context is valid
                if (!oContext) {
                    MessageBox.error("No product context found.");
                    return;
                }

                // Get the unique ID and status of the selected product
                var suniqueID = oContext.getProperty("uniqueID"); // Assuming the binding path has "uniqueID"
                var status = oContext.getProperty("status"); // Adjust according to your model property

                // Check if the product is inactive
                if (status === "inactive") {
                    MessageBox.warning("Cannot view details for inactive product: " + suniqueID + ".");
                    // Prevent navigation if the product is inactive
                    return;
                }

                // Now fetch and filter the characteristics data based on the selected uniqueID
                this._fetchCharacteristicsData(suniqueID);
            },

            _fetchCharacteristicsData: function (suniqueID) {
                var oModel = this.getOwnerComponent().getModel("cat3model");
                var oGModel = this.getOwnerComponent().getModel("globalModel");

                // Read data from the OData service
                oModel.read("/productclass", {
                    success: function (oData) {
                        // Ensure the 'results' field exists and contains the data
                        if (!oData || !oData.results) {
                            MessageBox.error("No characteristics data found for the selected product.");
                            return;
                        }

                        // Filter results based on uniqueID
                        var filteredData = oData.results.filter(function (item) {
                            return item.uniqueID_uniqueID === suniqueID;  // Adjust if needed
                        });

                        if (filteredData.length === 0) {
                            MessageBox.warning("No characteristics data found for the selected uniqueID.");
                            return;
                        }

                        // Extract characteristic IDs from filtered data
                        var characteristicIDs = filteredData.map(function (item) {
                            return item.characteristicID_characteristicID;
                        });

                        console.log("Fetched characteristic IDs: ", characteristicIDs);

                        // Set uniqueID and characteristicIDs in globalModel
                        oGModel.setProperty("/uniqueID", suniqueID);  // Set uniqueID
                        oGModel.setProperty("/characteristicIDs", characteristicIDs);  // Set characteristicIDs

                        // Publish the event with uniqueID and characteristic IDs
                        var oEventBus = this.getOwnerComponent().getEventBus();
                        oEventBus.publish("flexible", "setDetailPage", {
                            uniqueID: suniqueID,
                            characteristicIDs: characteristicIDs
                        });
                    }.bind(this),
                    error: function (oError) {
                        MessageBox.error("Error fetching characteristics data: " + oError.message);
                    }
                });
            },






            // onRowSelected: function (oEvent) {//-----------listview table onrowselect fucntiolaity(using og model and without active and inactive status functionality)--------------
            //     var oSelectedItem = oEvent.getSource();
            //     var oContext = oSelectedItem.getBindingContext();
            //     var suniqueID = oContext.getProperty("uniqueID");  // Assuming the binding path has "productID"


            //     // Publish the Product ID via EventBus
            //     var oEventBus = this.getOwnerComponent().getEventBus();
            //     console.log("Publishing event with uniqueID: ", suniqueID);
            //     var oGModel = this.getOwnerComponent().getModel("globalModel");
            //     oGModel.setProperty("/uniqueID", suniqueID);
            //     oEventBus.publish("flexible", "setDetailPage", { uniqueID: suniqueID });
            // },

            // onRowSelected: function (oEvent) {------------(-------without using og model----------listview on rowselect)---------
            //     var oSelectedItem = oEvent.getSource();
            //     var oContext = oSelectedItem.getBindingContext();
            //     var sProductID = oContext.getProperty("productID");  // Assuming the binding path has "productID"

            //     // Log the selected Product ID for debugging
            //     console.log("Selected Product ID: ", sProductID);

            //     // Use setTimeout to publish the Product ID via EventBus
            //     var oEventBus = this.getOwnerComponent().getEventBus();
            //     setTimeout(function () {
            //         console.log("Publishing productID after delay: ", sProductID);
            //         oEventBus.publish("flexible", "setDetailPage", { productID: sProductID });
            //     }.bind(this), 1000); // Adjust the delay as necessary
            // },





            onCreate: function () { //-------------create button fucntionality in listview for creating product--------------
                // Get the product data from the table (assuming it's bound to a model)
                const oTable = this.byId("productTable"); // Use the ID of your table
                const oSelectedItem = oTable.getItems()[0]; // Get the first item in the table (assuming filtered data)

                // Get the binding context of the selected item (filtered product)
                const oContext = oSelectedItem.getBindingContext();
                const productID = oContext.getProperty("productID");   // Retrieve productID
                const productName = oContext.getProperty("productName"); // Retrieve productName

                // Open the create product dialog
                if (!this._pCreateProductDialog) {
                    this._pCreateProductDialog = Fragment.load({
                        id: 'createProductDialog',
                        name: "com.productclassuniqueidmaintenanceapplication.fragments.createproductandclassfragment",
                        controller: this
                    }).then(function (oDialog) {
                        this.getView().addDependent(oDialog);
                        return oDialog;
                    }.bind(this));
                }

                this._pCreateProductDialog.then(function (oDialog) {
                    // Set the product name and ID in the fragment input fields
                    const oInputProductName = Fragment.byId("createProductDialog", "inputProductName");
                    if (oInputProductName) {
                        oInputProductName.setValue(productName); // Autofill product name
                    }

                    const oInputProductID = Fragment.byId("createProductDialog", "inputProductID");
                    if (oInputProductID) {
                        oInputProductID.setValue(productID); // Autofill product ID if needed
                    }

                    oDialog.open();
                });
            },
            onCloseCreateProductDialog: function () { //------------closing the create button fragmnet after saveing the data ------------
                // Close the dialog
                this._pCreateProductDialog.then(function (oDialog) {
                    oDialog.close();

                    // Reset the input fields after closing
                    this._resetProductForm();

                    // Hide the characteristic form
                    var oCharacteristicVBox = Fragment.byId("createProductDialog", "characteristicFormVBox");
                    if (oCharacteristicVBox) {
                        oCharacteristicVBox.setVisible(false); // Hide the characteristic form
                    } else {
                        console.error("VBox with id 'characteristicFormVBox' is not found.");
                    }

                    // Reset the button text back to "Add Characteristic"
                    var oAddButton = Fragment.byId("createProductDialog", "addCharacteristicButton");
                    if (oAddButton) {
                        oAddButton.setText("Add Characteristic");
                        oAddButton.setIcon("sap-icon://add"); // Optionally reset the icon
                    }

                    // Clear the data in the characteristic table
                    var oCharacteristicTable = sap.ui.getCore().byId("characteristicTable");
                    if (oCharacteristicTable) {
                        // Get the model associated with the table
                        var oModel = oCharacteristicTable.getModel();
                        if (oModel instanceof sap.ui.model.json.JSONModel) {
                            // Clear the data bound to the table
                            oModel.setProperty("/CHARACTERISTICS_DATA", []); // Clear the data
                        } else {
                            console.error("The model associated with the characteristic table is not a JSONModel.");
                        }
                    } else {
                        console.error("Characteristic table with id 'characteristicTable' is not found.");
                    }

                    // Ensure busy state is reset
                    this.getView().setBusy(false);
                }.bind(this)); // Ensure 'this' is correctly bound
            },
            _resetProductForm: function () {//-----------reset create button frgamnet after closing
                // Reset input fields in the fragment
                // Fragment.byId("createProductDialog", "inputProductId").setValue("");
                Fragment.byId("createProductDialog", "inputProductName").setValue("");
                Fragment.byId("createProductDialog", "inputDescription").setValue("");
                Fragment.byId("createProductDialog", "inputStatus").setSelectedKey(""); // Reset status selection
                Fragment.byId("createProductDialog", "inputValidFrom").setValue("");
                Fragment.byId("createProductDialog", "inputValidTo").setValue("");

            },

            onCreateProductChar: function () {//-----------craete button frgamnet input field data saving in product entity by craeting new product with same produtid and diffrent unique id--------
                var oView = this.getView();
                var oModel = oView.getModel();

                // Get input values from the fragment
                // var sProductID = Fragment.byId("createProductDialog", "inputProductId").getValue();
                var sProductName = Fragment.byId("createProductDialog", "inputProductName").getValue();
                var sDescription = Fragment.byId("createProductDialog", "inputDescription").getValue();
                var sStatus = Fragment.byId("createProductDialog", "inputStatus").getSelectedKey();
                var sValidFrom = Fragment.byId("createProductDialog", "inputValidFrom").getValue();
                var sValidTo = Fragment.byId("createProductDialog", "inputValidTo").getValue();

                // Validate and create product logic
                if (!sProductName) {
                    MessageToast.show("Please fill in all required fields.");
                    return;
                }

                // Create product object
                var oProduct = {
                    // inputProductId: sProductID,
                    productName: sProductName,
                    description: sDescription,
                    status: sStatus,
                    validFrom: sValidFrom,
                    validTo: sValidTo
                };

                // Call the OData model to create the product
                oModel.create("/product", oProduct, {
                    success: function () {
                        MessageToast.show("Product created successfully.");
                        oModel.refresh(); // Refresh model to update the table
                        this.onCancelProductDialog(); // Close the dialog after saving
                    }.bind(this),
                    error: function (oError) {
                        // Handle error
                        var oErrorResponse = JSON.parse(oError.responseText);
                        MessageToast.show("Error creating product: " + oErrorResponse.error.message.value);
                        console.error("Error creating product:", oError);
                    }
                });
            },
            onButtonPress: function () {//---------onButtonPress functionality is chnageing the buttons from Add charactericts to save ------
                // Use Fragment.byId to reference the button inside the fragment
                var oAddButton = Fragment.byId("createProductDialog", "addCharacteristicButton");

                // Check if the button was found
                if (!oAddButton) {
                    console.error("Button with id 'addCharacteristicButton' is not found.");
                    return;
                }

                var sButtonText = oAddButton.getText();

                if (sButtonText === "Add Characteristic") {
                    // Perform Add Characteristic logic
                    this._showCharacteristicForm();

                    // Change the button text and icon to Save
                    oAddButton.setText("Save");
                    oAddButton.setIcon("sap-icon://save");

                } else if (sButtonText === "Save") {
                    // Perform Save logic
                    this._saveProductAndCharacteristics();

                }
            },
            _showCharacteristicForm: function () {// --------Function to show the characteristic form when clciking the + icon -------
                var oVBox = Fragment.byId("createProductDialog", "characteristicFormVBox");

                // Load the characteristic creation fragment if not already loaded
                if (!this._oCharacteristicCreateFragment) {
                    this._oCharacteristicCreateFragment = sap.ui.xmlfragment(
                        "com.productclassuniqueidmaintenanceapplication.fragments.charcreatefragmnet", this
                    );
                    oVBox.addItem(this._oCharacteristicCreateFragment);
                }

                // Make the VBox visible
                oVBox.setVisible(true);
            },

            _saveProductAndCharacteristics: function () { //------functionality for save button insid ethe create button frgamnet---to save the product data as well as charcatericst binding to the newly creating product with unique id in productclass entity---------
                var sProductID = this.selectedProductID;
                // Step 1: Get values from input fields
                // const productID = this.getView().byId("productIDInput").getValue();
                const productName = sap.ui.core.Fragment.byId("createProductDialog", "inputProductName").getValue();
                const description = sap.ui.core.Fragment.byId("createProductDialog", "inputDescription").getValue();
                const status = sap.ui.core.Fragment.byId("createProductDialog", "inputStatus").getSelectedKey();
                const validFrom = sap.ui.core.Fragment.byId("createProductDialog", "inputValidFrom").getValue();
                const validTo = sap.ui.core.Fragment.byId("createProductDialog", "inputValidTo").getValue();

                const newProductData = {
                    productID: sProductID,
                    productName: productName,
                    description: description,
                    status: status,
                    validFrom: validFrom,
                    validTo: validTo
                };

                this.addNewProduct(newProductData);
            },

            addNewProduct: function (newProductData) { //---add new product by genrating unique id each time-----
                const oModel = this.getView().getModel("cat3model"); // Get your OData model
                const sPath = "/product"; // Your entity set path

                // Step 2: Fetch existing products to determine the highest uniqueID
                oModel.read(sPath, {
                    success: (data) => {
                        // Step 3: Find the highest uniqueID
                        let maxUniqueID = 0;
                        data.results.forEach(product => {
                            const uniqueID = parseInt(product.uniqueID, 10); // Convert to number
                            if (uniqueID > maxUniqueID) {
                                maxUniqueID = uniqueID;
                            }
                        });

                        // Step 4: Increment the uniqueID for the new product
                        const newUniqueID = maxUniqueID + 1; // Increment and keep it as a number

                        // Create the new product object
                        const newProduct = {
                            uniqueID: newUniqueID, // This is now an integer
                            productID: newProductData.productID,
                            productName: newProductData.productName,
                            description: newProductData.description,
                            status: newProductData.status,
                            validFrom: newProductData.validFrom,
                            validTo: newProductData.validTo
                        };
                        console.log("New Product Data:", newProduct); // Log for debugging

                        // Step 5: Add the new product to the OData service
                        oModel.create(sPath, newProduct, {
                            success: (createdProduct) => {
                                // Handle success (e.g., refresh the product list or show a message)
                                sap.m.MessageToast.show("Product added successfully.");
                                // After successfully adding the product, save characteristics
                                this._saveCharacteristics(createdProduct.uniqueID);
                            },
                            error: (error) => {
                                // Handle error
                                console.error("Error adding product:", error);
                                sap.m.MessageToast.show("Error adding product.");
                            }
                        });
                    },
                    error: (error) => {
                        // Handle error in reading products
                        console.error("Error fetching products:", error);
                        sap.m.MessageToast.show("Error fetching products.");
                    }
                });
            },
            _saveCharacteristics: function (createdProductID) {//------binding the charcatericts to the productclass entity with newly genrated product uniqueid-----
                var oCharacteristicTable = sap.ui.getCore().byId("characteristicTable");
                var aItems = oCharacteristicTable.getItems(); // Get all items (rows) from the table

                // Use the main model (assuming it's already set)
                var oModel = this.getView().getModel("cat3model");

                aItems.forEach(function (oItem) {
                    var oCharacteristicData = oItem.getBindingContext().getObject(); // Directly get the object from the default binding context

                    // Access CLASS_ID and ID directly
                    var classID = oCharacteristicData.CLASS_ID; // Assuming CLASS_ID is part of the characteristic data
                    var charID = oCharacteristicData.ID; // Assuming ID is also part of the characteristic data

                    // Create an entry for productclass entity
                    var newProductClassEntry = {
                        uniqueID_uniqueID: createdProductID, // Bind with the created product's uniqueID
                        classID_classID: classID,
                        characteristicID_characteristicID: charID// Bind the classID from the characteristic
                        // characteristicID: charID // Bind the characteristic ID if needed
                    };

                    // Now create the entry in productclass entity set
                    oModel.create("/productclass", newProductClassEntry, {
                        success: function () {
                            sap.m.MessageToast.show("Class ID added to product successfully.");

                            // Close the dialog only after all characteristics have been processed
                            this.onCloseCreateProductDialog(); // Ensure 'this' is bound correctly
                        }.bind(this), // Bind 'this' to the success callback
                        error: function (error) {
                            console.error("Error while saving class ID:", error);
                            sap.m.MessageToast.show("Error saving class ID.");
                        }.bind(this) // Optional: Bind 'this' to the error callback
                    });
                }, this); // Bind 'this' to the forEach loop
            },

            // _saveCharacteristics: function (createdProductID) {
            //     var oCharacteristicTable = sap.ui.getCore().byId("characteristicTable");
            //     var aItems = oCharacteristicTable.getItems(); // Get all items (rows) from the table
            //     var oModel = this.getView().getModel("cat3model");

            //     // Create an empty array to store characteristics to save
            //     var aCharacteristicsToSave = [];

            //     // Read the data from the OData service
            //     oModel.read("/productclass", {
            //         success: function (oData) {
            //             console.log("Fetched oData:", oData);  // Log the fetched data for inspection

            //             if (Array.isArray(oData.results)) {
            //                 // Loop over the items in the table
            //                 aItems.forEach(function (oItem) {
            //                     var oCharacteristicData = oItem.getBindingContext().getObject(); // Get the data for each item
            //                     console.log("Processing characteristic data:", oCharacteristicData);  // Log characteristic data for inspection

            //                     // Filter characteristics based on uniqueID, classID, and characteristicID
            //                     var filteredData = oData.results.filter(function (item) {
            //                         return   item.classID_classID === oCharacteristicData.CLASS_ID &&
            //                                item.characteristicID_characteristicID === oCharacteristicData.ID;
            //                     });

            //                     console.log("Filtered data:", filteredData);  // Log filtered data for inspection

            //                     if (filteredData.length > 0) {
            //                         // Create the object to be saved in productclass
            //                         var newProductClassEntry = {
            //                             uniqueID_uniqueID: createdProductID, // Bind the created product's unique ID
            //                             classID_classID: oCharacteristicData.classID_classID, // Class ID from the characteristic
            //                             characteristicID_characteristicID: oCharacteristicData.characteristicID_characteristicID // Characteristic ID from the item
            //                         };

            //                         // Add this entry to the array of characteristics to save
            //                         aCharacteristicsToSave.push(newProductClassEntry);
            //                     }
            //                 });

            //                 // Proceed to save the characteristics if any were found
            //                 if (aCharacteristicsToSave.length > 0) {
            //                     aCharacteristicsToSave.forEach(function (newProductClassEntry) {
            //                         oModel.create("/productclass", newProductClassEntry, {
            //                             success: function () {
            //                                 sap.m.MessageToast.show("Class ID added to product successfully.");
            //                                 // Close the dialog after processing all characteristics
            //                                 this.onCloseCreateProductDialog();
            //                             }.bind(this),
            //                             error: function (error) {
            //                                 console.error("Error while saving class ID:", error);
            //                                 sap.m.MessageToast.show("Error saving class ID.");
            //                             }.bind(this)
            //                         });
            //                     });
            //                 } else {
            //                     sap.m.MessageToast.show("No characteristics found to add.");
            //                 }
            //             } else {
            //                 console.error("OData response does not contain a valid 'results' property or it's not an array.");
            //                 sap.m.MessageToast.show("Error fetching product class data.");
            //             }
            //         }.bind(this),
            //         error: function (error) {
            //             console.error("Error while reading productclass data:", error);
            //             sap.m.MessageToast.show("Error fetching product class data.");
            //         }
            //     });
            // },










            onAddCharacteristic: function () {//--------------------when i click the add icon insid ethe create button frgamnet panels frgamnet will open there creating the ppanels  dynamically----------
                // Check if the fragment is already loaded
                if (!this.oFragment) {
                    // Load the fragment and bind the controller to maintain context
                    this.oFragment = sap.ui.xmlfragment("com.productclassuniqueidmaintenanceapplication.fragments.classcharselectionfragment", this);
                    this.getView().addDependent(this.oFragment);

                    // Attach afterOpen event to load data after the dialog is opened
                    this.oFragment.attachAfterOpen(this.loadData.bind(this));
                }

                // Open the dialog
                this.oFragment.open();
            },
            loadData: function () {
                // Create OData model with your service URL
                var oModel = this.getOwnerComponent().getModel("cat3model");

                // Fetch the data using OData model
                oModel.read("/classcharselectioncalview", {
                    success: this.onDataLoaded.bind(this),  // Call onDataLoaded when data is fetched
                    error: function (oError) {
                        // Handle error
                        MessageToast.show("Error loading data");
                    }
                });
            },

            onDataLoaded: function (oData) {
                var oModel = this.getOwnerComponent().getModel("cat3model");

                if (!this.oFragment) {
                    console.error("Fragment is not initialized!");
                    return;
                }

                var oVBox = sap.ui.getCore().byId("myVBox");

                if (!oVBox) {
                    console.error("VBox not found in the fragment!");
                    return;
                }

                oVBox.removeAllItems();
                const aTransformedData = this._transformData(oData.results);

                if (!Array.isArray(aTransformedData)) {
                    console.error("Transformed data is not an array or is invalid.");
                    return;
                }

                aTransformedData.forEach((oClass) => {
                    const oPanel = new sap.m.Panel({
                        headerText: oClass.CLASSNAME,
                        expandable: true,
                        expanded: false,
                        expand: function (oEvent) {
                            const oPanel = oEvent.getSource();
                            const isExpanded = oEvent.getParameter("expand");

                            if (isExpanded && oPanel.getContent().length === 0) {
                                const oCharVBox = new sap.m.VBox({
                                    renderType: "Bare"
                                });

                                oClass.nodes.forEach((oCharacteristic) => {
                                    const oCharacteristicPanel = new sap.m.Panel({
                                        headerText: oCharacteristic.CHARACTERISTICNAME,
                                        expandable: true,
                                        expanded: false,
                                        expand: function (oCharEvent) {
                                            const oCharPanel = oCharEvent.getSource();
                                            const isCharExpanded = oCharEvent.getParameter("expand");

                                            if (isCharExpanded && oCharPanel.getContent().length === 0) {
                                                const oInnerVBox = new sap.m.VBox({
                                                    renderType: "Bare"
                                                });

                                                oCharacteristic.nodes.forEach((oValue) => {
                                                    const oValueRadioButton = new sap.m.RadioButton({
                                                        text: oValue.VALUE,
                                                        groupName: oClass.CLASSID, // Ensure unique groups
                                                        select: this.onSelect.bind(this),
                                                    });

                                                    oInnerVBox.addItem(oValueRadioButton);
                                                });

                                                oCharPanel.addContent(oInnerVBox);
                                            }
                                        }.bind(this)
                                    });

                                    oCharacteristicPanel.data("characteristicId", oCharacteristic.CHARACTERISTICID);
                                    oCharVBox.addItem(oCharacteristicPanel);


                                });
                                // Store the CLASSID in the panel's data
                                oPanel.data("classId", oClass.CLASSID);  // Store CLASSID here



                                oPanel.addContent(oCharVBox);
                            }
                        }.bind(this)
                    });

                    oVBox.addItem(oPanel);
                });

                this.oFragment.rerender();
            },

            // _transformData: function (aData) {
            //     const oGroupedData = {};

            //     aData.forEach((oItem) => {
            //         // Group by class
            //         if (!oGroupedData[oItem.CLASSID]) {
            //             oGroupedData[oItem.CLASSID] = {
            //                 CLASSID: oItem.CLASSID,
            //                 CLASSNAME: oItem.CLASSNAME,
            //                 nodes: []
            //             };
            //         }

            //         // Group by characteristic within the class
            //         const aCharacteristics = oGroupedData[oItem.CLASSID].nodes;
            //         let oCharacteristic = aCharacteristics.find(char => char.CHARACTERISTICID === oItem.CHARACTERISTICID);

            //         if (!oCharacteristic) {
            //             oCharacteristic = {
            //                 CHARACTERISTICID: oItem.CHARACTERISTICID,
            //                 CHARACTERISTICNAME: oItem.CHARACTERISTICNAME,
            //                 nodes: []
            //             };
            //             aCharacteristics.push(oCharacteristic);
            //         }

            //         // Add value to the characteristic
            //         oCharacteristic.nodes.push({
            //             VALUE: oItem.VALUE
            //         });
            //     });

            //     // Convert grouped data object into an array
            //     return Object.values(oGroupedData);
            // },

            _transformData: function (aData) {
                const oGroupedData = {};

                aData.forEach((oItem) => {
                    // Initialize the class group if it doesn't exist
                    if (!oGroupedData[oItem.CLASSID]) {
                        oGroupedData[oItem.CLASSID] = {
                            CLASSID: oItem.CLASSID,
                            CLASSNAME: oItem.CLASSNAME, // Use CLASSID as the name, modify if you have a separate class name property
                            nodes: []
                        };
                    }

                    // Reference to the characteristics array within the current class
                    const aCharacteristics = oGroupedData[oItem.CLASSID].nodes;

                    // Check if a panel already exists for this characteristic name within the current CLASSID
                    let oCharacteristic = aCharacteristics.find(char =>
                        char.CHARACTERISTICNAME === oItem.CHARACTERISTICNAME && char.CLASSID === oItem.CLASSID
                    );

                    // If no panel exists for this characteristic within this CLASSID, create one
                    if (!oCharacteristic) {
                        oCharacteristic = {
                            CLASSID: oItem.CLASSID, // Add CLASSID to the characteristic panel for verification
                            CHARACTERISTICID: oItem.CHARACTERISTICID,
                            CHARACTERISTICNAME: oItem.CHARACTERISTICNAME,
                            nodes: [] // Initialize as an array to store all values
                        };
                        aCharacteristics.push(oCharacteristic);
                    }

                    // Add the value to the characteristic's nodes (avoid duplicates if necessary)
                    if (!oCharacteristic.nodes.some(valueObj => valueObj.VALUE === oItem.value)) {
                        oCharacteristic.nodes.push({
                            VALUE: oItem.VALUE
                        });
                    }
                });

                // Convert the grouped data object into an array
                return Object.values(oGroupedData);
            },



            // onSelect: function (oEvent) {
            //     const oSelectedButton = oEvent.getSource();

            //     // Check if the clicked radio button is the last selected one
            //     if (oLastSelectedRadioButton === oSelectedButton) {
            //         // Deselect the radio button
            //         oSelectedButton.setSelected(false);
            //         oLastSelectedRadioButton = null; // Reset the last selected radio button
            //         MessageToast.show("Deselected: " + oSelectedButton.getText());
            //     } else {
            //         // Deselect the last selected radio button, if it exists
            //         if (oLastSelectedRadioButton) {
            //             oLastSelectedRadioButton.setSelected(false);
            //         }
            //         // Select the clicked radio button
            //         oSelectedButton.setSelected(true);
            //         oLastSelectedRadioButton = oSelectedButton; // Update the last selected radio button
            //         MessageToast.show("Selected: " + oSelectedButton.getText());
            //     }
            // },
            // Map to keep track of the last selected radio button per characteristic


            // onSelect: function (oEvent) {
            //     const oSelectedButton = oEvent.getSource();
            //     const characteristicId = oSelectedButton.getGroupName(); // Unique ID for each characteristic group

            //     // Check if the clicked radio button is the last selected one for this characteristic
            //     if (this.lastSelectedRadioButtons[characteristicId] === oSelectedButton) {
            //         // Deselect the radio button
            //         oSelectedButton.setSelected(false);
            //         this.lastSelectedRadioButtons[characteristicId] = null; // Reset last selected for this characteristic
            //         MessageToast.show("Deselected: " + oSelectedButton.getText());
            //     } else {
            //         // Deselect the last selected radio button for this characteristic, if it exists
            //         if (this.lastSelectedRadioButtons[characteristicId]) {
            //             this.lastSelectedRadioButtons[characteristicId].setSelected(false);
            //         }
            //         // Select the clicked radio button
            //         oSelectedButton.setSelected(true);
            //         this.lastSelectedRadioButtons[characteristicId] = oSelectedButton; // Update the last selected for this characteristic
            //         MessageToast.show("Selected: " + oSelectedButton.getText());
            //     }
            // },

            onSelect: function (oEvent) {
                const oSelectedButton = oEvent.getSource();
                const characteristicId = oSelectedButton.getGroupName(); // Unique ID for each characteristic group

                // Ensure lastSelectedRadioButtons is initialized
                if (!this.lastSelectedRadioButtons) {
                    this.lastSelectedRadioButtons = {};
                }

                // Check if the clicked radio button is the last selected one for this characteristic
                if (this.lastSelectedRadioButtons[characteristicId] === oSelectedButton) {
                    // Deselect the radio button
                    oSelectedButton.setSelected(false);
                    this.lastSelectedRadioButtons[characteristicId] = null; // Reset last selected for this characteristic
                    MessageToast.show("Deselected: " + oSelectedButton.getText());
                } else {
                    // Deselect the last selected radio button for this characteristic, if it exists
                    if (this.lastSelectedRadioButtons[characteristicId]) {
                        this.lastSelectedRadioButtons[characteristicId].setSelected(false);
                    }
                    // Select the clicked radio button
                    oSelectedButton.setSelected(true);
                    this.lastSelectedRadioButtons[characteristicId] = oSelectedButton; // Update the last selected for this characteristic
                    MessageToast.show("Selected: " + oSelectedButton.getText());
                }
            },





            onCloseClassCharValDialog: function () { // ------classcharvalue frgament close functionality-------------
                this.oFragment.close();
            },
            onSubmitClassCharVal: function () { // ----------classcharvalue fragment submit button---------------------
                var oVBox = sap.ui.getCore().byId("myVBox"); // Adjust the ID as necessary
                if (!oVBox) {
                    console.error("VBox not found!");
                    return;
                }

                const aPanelData = []; // Reset the data array
                let hasSelection = false; // Flag to check if any selection is made

                // Iterate through each panel (representing a class)
                oVBox.getItems().forEach((oPanel) => {
                    const selectedClassName = oPanel.getHeaderText(); // Get the class name
                    const classId = oPanel.data("classId"); // Retrieve CLASSID
                    const panelData = {
                        CLASSNAME: selectedClassName,
                        CLASSID: classId, // Include CLASSID in panel data
                        CHARACTERISTICS_DATA: []
                    };

                    const oInnerVBox = oPanel.getContent()[0]; // Get the inner VBox that holds characteristics

                    if (!oInnerVBox || !oInnerVBox.getItems || oInnerVBox.getItems().length === 0) {
                        return; // Skip this panel if no characteristics are found
                    }

                    // Iterate through each characteristic panel
                    oInnerVBox.getItems().forEach((oCharacteristicPanel) => {
                        const characteristicName = oCharacteristicPanel.getHeaderText();
                        const characteristicId = oCharacteristicPanel.data("characteristicId"); // Retrieve characteristicId

                        console.log("Characteristic ID:", characteristicId); // Log the characteristicId

                        const selectedValues = [];

                        // Iterate through the content of the characteristic panel (e.g., radio buttons)
                        oCharacteristicPanel.getContent().forEach((oControl) => {
                            if (oControl instanceof sap.m.VBox) {
                                oControl.getItems().forEach((oSubControl) => {
                                    if (oSubControl instanceof sap.m.RadioButton) {
                                        // If a radio button is selected, add its text to selectedValues
                                        if (oSubControl.getSelected()) {
                                            selectedValues.push(oSubControl.getText());
                                            hasSelection = true; // Set the flag if a selection is made
                                        }
                                    }
                                });
                            }
                        });

                        // If any values were selected for the characteristic, add it to the panel data
                        if (selectedValues.length > 0) {
                            panelData.CHARACTERISTICS_DATA.push({
                                ID: characteristicId, // Include the characteristicId here
                                NAME: characteristicName,
                                SELECTED_VALUES: selectedValues,
                                CLASS_ID: classId // Include CLASSID here
                            });
                        }
                    });

                    // Only push the panel data if something is selected
                    if (panelData.CHARACTERISTICS_DATA.length > 0) {
                        aPanelData.push(panelData);
                    }
                });

                // If no characteristics or values are selected, show a message and stop processing
                if (!hasSelection) {
                    sap.m.MessageToast.show("Please select at least one class and its values.");
                    return;
                }

                // Now bind the selected data to the table in the fragment
                var oCharacteristicTable = sap.ui.getCore().byId("characteristicTable");
                if (oCharacteristicTable) {
                    // Check if the table has a JSONModel attached, if not, create one
                    var oModel = oCharacteristicTable.getModel();
                    if (!(oModel instanceof sap.ui.model.json.JSONModel)) {
                        oModel = new sap.ui.model.json.JSONModel(); // Create a new JSONModel
                        oCharacteristicTable.setModel(oModel);
                    }

                    // Get existing data from the model, or initialize to an empty array
                    var existingData = oModel.getData().CHARACTERISTICS_DATA || [];

                    // Create a set of existing characteristic IDs for quick lookup
                    const existingCharacteristicIds = new Set(existingData.map(item => item.ID));

                    // Filter new data to avoid duplicates based on characteristic ID
                    const newCharacteristics = [];
                    const duplicateNames = []; // Array to hold names of characteristics that already exist

                    aPanelData.forEach(panel => {
                        panel.CHARACTERISTICS_DATA.forEach(characteristic => {
                            if (!existingCharacteristicIds.has(characteristic.ID)) {
                                newCharacteristics.push(characteristic);
                            } else {
                                duplicateNames.push(characteristic.NAME); // Add to duplicate names
                            }
                        });
                    });

                    // Show message if no new characteristics are added
                    if (newCharacteristics.length === 0 && duplicateNames.length > 0) {
                        const message = ` "${duplicateNames.join(', ')}" already exist`;
                        sap.m.MessageToast.show(message);
                    } else {
                        // Append the new selected data to the existing data
                        var updatedData = existingData.concat(newCharacteristics);

                        // Update the model data with the combined (existing + new) values
                        oModel.setData({
                            CHARACTERISTICS_DATA: updatedData
                        });
                    }
                }

                this.oFragment.close();
                console.log("Selected Class Data:", aPanelData);
            },




            // onEditProductListView: function (oEvent) { //------------update fucntionality-----------------
            //     // Get the selected product data from the table row
            //     var oSelectedItem = oEvent.getSource().getParent().getBindingContext().getObject();
            //      // Get the unique ID of the selected product
            //          var uniqueID = oSelectedItem.uniqueID;

            //     // Check if the dialog is already created; if not, create it
            //     if (!this._oUpdateDialog) {
            //         this._oUpdateDialog = sap.ui.xmlfragment("com.productclassuniqueidmaintenanceapplication.fragments.editProductFragment", this);
            //         this.getView().addDependent(this._oUpdateDialog);
            //     }

            //     // Populate the dialog inputs with the selected product data
            //     sap.ui.getCore().byId("uniqueIDInputUpdate").setValue(oSelectedItem.uniqueID);
            //     sap.ui.getCore().byId("productIDInputUpdate").setValue(oSelectedItem.productID);
            //     sap.ui.getCore().byId("inputProductNameUpdate").setValue(oSelectedItem.productName);
            //     sap.ui.getCore().byId("descriptionInputUpdate").setValue(oSelectedItem.description);
            //     sap.ui.getCore().byId("statusSelectUpdate").setSelectedKey(oSelectedItem.status);
            //     // Use the formatter to format dates
            //     sap.ui.getCore().byId("validFromInputUpdate").setValue(formatter.formatDate(oSelectedItem.validFrom));
            //     sap.ui.getCore().byId("validToInputUpdate").setValue(formatter.formatDate(oSelectedItem.validTo));

            //     // Open the update dialog
            //     this._oUpdateDialog.open();
            // },

            // onSaveUpdatedProduct: function () {
            //     // Get the updated values from the fragment inputs
            //     var oUpdatedProduct = {
            //         uniqueID: sap.ui.getCore().byId("uniqueIDInputUpdate").getValue(),
            //         productID: sap.ui.getCore().byId("productIDInputUpdate").getValue(),
            //         productName: sap.ui.getCore().byId("inputProductNameUpdate").getValue(),
            //         description: sap.ui.getCore().byId("descriptionInputUpdate").getValue(),
            //         status: sap.ui.getCore().byId("statusSelectUpdate").getSelectedKey(),

            //         // Call formatter for date conversion
            //         validFrom: formatter.formatDate(sap.ui.getCore().byId("validFromInputUpdate").getValue()),
            //         validTo: formatter.formatDate(sap.ui.getCore().byId("validToInputUpdate").getValue())
            //     };

            //     // Perform the update operation via OData or any service here
            //     var oModel = this.getView().getModel();
            //     oModel.update("/product(" + oUpdatedProduct.uniqueID + ")", oUpdatedProduct, {
            //         success: function () {
            //             MessageToast.show("Product updated successfully");
            //         },
            //         error: function (oError) {
            //             MessageToast.show("Error while updating the product: " + oError.message);
            //         }
            //     });

            //     // Close the dialog after saving
            //     this._oUpdateDialog.close();
            // },

            // onCloseUpdateProductDialog: function () {  // Function to close the update dialog without saving
            //     this._oUpdateDialog.close();
            // },

            onEditProductListView: function (oEvent) {
                // Get the selected product data from the table row
                const oSelectedItem = oEvent.getSource().getParent().getBindingContext().getObject();
                const uniqueID = oSelectedItem.uniqueID;
            
                // Create the dialog if not already created
                if (!this._oUpdateDialog) {
                    this._oUpdateDialog = sap.ui.xmlfragment("com.productclassuniqueidmaintenanceapplication.fragments.editProductFragment", this);
                    this.getView().addDependent(this._oUpdateDialog);
                }
            
                // Populate the dialog inputs with the selected product data
                sap.ui.getCore().byId("uniqueIDInputUpdate").setValue(oSelectedItem.uniqueID);
                sap.ui.getCore().byId("productIDInputUpdate").setValue(oSelectedItem.productID);
                sap.ui.getCore().byId("inputProductNameUpdate").setValue(oSelectedItem.productName);
                sap.ui.getCore().byId("descriptionInputUpdate").setValue(oSelectedItem.description);
                sap.ui.getCore().byId("statusSelectUpdate").setSelectedKey(oSelectedItem.status);
                sap.ui.getCore().byId("validFromInputUpdate").setValue(formatter.formatDate(oSelectedItem.validFrom));
                sap.ui.getCore().byId("validToInputUpdate").setValue(formatter.formatDate(oSelectedItem.validTo));
            
                // Step 1: Fetch data from `productclass` to retrieve classID and characteristicID for the selected uniqueID
                const oModel = this.getView().getModel("cat3model");
                oModel.read("/productclass", {
                    success: (oData) => {
                        // Extract characteristic IDs and corresponding class IDs for the selected uniqueID
                        const characteristicDataMap = {};
                        oData.results.forEach(item => {
                            if (item.uniqueID_uniqueID === uniqueID) {
                                characteristicDataMap[item.characteristicID_characteristicID] = item.classID_classID;
                            }
                        });
            
                        const characteristicIDs = Object.keys(characteristicDataMap);
            
                        // Step 2: Fetch all data from `productclassunicalview`
                        oModel.read("/productclassunicalview", {
                            success: (oData) => {
                                // Step 3: Filter data based on uniqueID and characteristicID only
                                const filteredData = oData.results
                                    .filter(item => item.UNIQUEID === uniqueID && characteristicIDs.includes(item.CHARACTERISTICID))
                                    .map(item => ({
                                        ...item,
                                        CLASSID: characteristicDataMap[item.CHARACTERISTICID] // Add classID from characteristicDataMap
                                    }));
            
                                // Step 4: Bind the filtered data to the table in the dialog
                                const oTable = sap.ui.getCore().byId("characteristicsEditTable");
                                const oJSONModel = new sap.ui.model.json.JSONModel({ FILTERED_DATA: filteredData });
                                oTable.setModel(oJSONModel);
                            },
                            error: (oError) => {
                                MessageToast.show("Error while fetching product class unical view data: " + oError.message);
                            }
                        });
            
                        // Open the update dialog
                        this._oUpdateDialog.open();
                    },
                    error: (oError) => {
                        MessageToast.show("Error while fetching characteristic data: " + oError.message);
                    }
                });
            },
            

            // onSaveUpdatedProduct: function () {
            //     const oUpdatedProduct = {
            //         uniqueID: sap.ui.getCore().byId("uniqueIDInputUpdate").getValue(),
            //         productID: sap.ui.getCore().byId("productIDInputUpdate").getValue(),
            //         productName: sap.ui.getCore().byId("inputProductNameUpdate").getValue(),
            //         description: sap.ui.getCore().byId("descriptionInputUpdate").getValue(),
            //         status: sap.ui.getCore().byId("statusSelectUpdate").getSelectedKey(),
            //         validFrom: formatter.formatDate(sap.ui.getCore().byId("validFromInputUpdate").getValue()),
            //         validTo: formatter.formatDate(sap.ui.getCore().byId("validToInputUpdate").getValue())
            //     };

            //     const oModel = this.getView().getModel();
            //     oModel.update("/product(" + oUpdatedProduct.uniqueID + ")", oUpdatedProduct, {
            //         success: () => {
            //             MessageToast.show("Product updated successfully");
            //         },
            //         error: (oError) => {
            //             MessageToast.show("Error while updating the product: " + oError.message);
            //         }
            //     });

            //     this._oUpdateDialog.close();
            // },
            // Success callback for adding the product
            onSaveUpdatedProduct: function () {
                // Gather the updated data for the product
                var oUpdatedProduct = {
                    uniqueID: sap.ui.getCore().byId("uniqueIDInputUpdate").getValue(),
                    productID: sap.ui.getCore().byId("productIDInputUpdate").getValue(),
                    productName: sap.ui.getCore().byId("inputProductNameUpdate").getValue(),
                    description: sap.ui.getCore().byId("descriptionInputUpdate").getValue(),
                    status: sap.ui.getCore().byId("statusSelectUpdate").getSelectedKey(),
                    validFrom: formatter.formatDate(sap.ui.getCore().byId("validFromInputUpdate").getValue()),
                    validTo: formatter.formatDate(sap.ui.getCore().byId("validToInputUpdate").getValue())
                };
            
                // Get the model (assuming it's already set)
                var oModel = this.getView().getModel();
            
                // Define the path to the existing product entity using its uniqueID
                var sPath = "/product(" + oUpdatedProduct.uniqueID + ")";
            
                // Update the product in the OData service
                oModel.update(sPath, oUpdatedProduct, {
                    success: (updatedProduct) => {
                        // Handle success (e.g., show a success message)
                        sap.m.MessageToast.show("Product updated successfully.");
            
                        // After successfully updating the product, save characteristics
                        this._saveCharacteristicsUpdate(oUpdatedProduct.uniqueID);
                    },
                    error: (oError) => {
                        // Handle error
                        sap.m.MessageToast.show("Error while updating the product: " + oError.message);
                    }
                });
            },
            

            _saveCharacteristicsUpdate: function (updatedProductID) {
                // Access the model bound to the characteristics table
                var oTable = sap.ui.getCore().byId("characteristicsEditTable");
                var oModel = oTable.getModel();
                var aCharacteristicData = oModel.getProperty("/FILTERED_DATA"); // Retrieve FILTERED_DATA directly
            
                // Use the model for productclass (assuming it's already set in the main view)
                var oProductClassModel = this.getView().getModel("cat3model");
            
                // Read all records from the productclass entity
                oProductClassModel.read("/productclass", {
                    success: function (oData) {
                        // Loop through all items in the aCharacteristicData array
                        aCharacteristicData.forEach(function (oCharacteristic) {
                            var classID = oCharacteristic.CLASSID; // Assuming CLASSID is part of FILTERED_DATA
                            var charID = oCharacteristic.CHARACTERISTICID; // Assuming CHARACTERISTICID is part of FILTERED_DATA
                           
                            // Check if a record with matching uniqueID, classID, and charID exists
                            var bRecordExists = oData.results.some(function (existingRecord) {
                                return existingRecord.uniqueID_uniqueID === updatedProductID &&
                                       existingRecord.classID_classID === classID &&
                                       existingRecord.characteristicID_characteristicID === charID;
                                       
                            });
            
                            // If the record does not exist, create it
                            if (!bRecordExists) {
                                // Create a new productclass entry
                                var newProductClassEntry = {
                                    uniqueID_uniqueID: updatedProductID, // Bind with the updated product's uniqueID
                                    classID_classID: classID, // Bind with the class ID
                                    characteristicID_characteristicID: charID // Bind with the characteristic ID
                                };
            
                                // Create the entry in the productclass entity set
                                oProductClassModel.create("/productclass", newProductClassEntry, {
                                    success: function () {
                                        sap.m.MessageToast.show("Characteristic added to product successfully.");
                                    },
                                    error: function (error) {
                                        console.error("Error while saving characteristic:", error);
                                        sap.m.MessageToast.show("Error saving characteristic.");
                                    }
                                });
                            } else {
                                // Log or show a message if the record already exists
                                console.log("Record with the same uniqueID, classID, and characteristicID already exists.");
                                sap.m.MessageToast.show("Record already exists, skipping.");
                            }
                        });
                    },
                    error: function (error) {
                        console.error("Error while reading productclass:", error);
                        sap.m.MessageToast.show("Error while checking existing characteristic.");
                    }
                });
            },
            
            onCloseUpdateProductDialog: function () {
                this._oUpdateDialog.close();
            },
            
            

          



            onDeleteProductListView: function (oEvent) { //---------delete fucntionality-----------------
                // Get the context from the button that was pressed
                var oButton = oEvent.getSource(); // Get the button that triggered the event
                var oContext = oButton.getBindingContext(); // Get the binding context of the button

                // Check if context is available
                if (oContext) {
                    var sUniqueID = oContext.getProperty("uniqueID"); // Get the unique ID from the context

                    this._deleteProductAndClassByUniqueID(sUniqueID);
                } else {
                    MessageToast.show("No product selected for deletion.");
                }
            },
            // Function to delete product and product class entries using uniqueID
            // Function to delete product and product class entries using uniqueID
            // _deleteProductAndClassByUniqueID: function (sUniqueID) {
            //     var oModel = this.getView().getModel("cat3model");

            //     // Confirm deletion action
            //     MessageBox.confirm("Are you sure you want to delete the product and product class entry with Unique ID: " + sUniqueID + "?", {
            //         title: "Confirm Deletion",
            //         onClose: function (oAction) {
            //             if (oAction === MessageBox.Action.OK) {
            //                 // Delete from product entity using uniqueID
            //                 oModel.remove("/product(uniqueID=" + sUniqueID + ")", {
            //                     success: function () {
            //                         // After successfully deleting the product, read the productclass entity without any filters
            //                         oModel.read("/productclass", {
            //                             success: function (oData) {
            //                                 if (oData.results && oData.results.length > 0) {
            //                                     // Apply custom filtering logic to find matching records
            //                                     var oFilteredRecord = oData.results.find(function (record) {
            //                                         return record.uniqueID_uniqueID === sUniqueID;
            //                                     });

            //                                     if (oFilteredRecord) {
            //                                         var sClassID = oFilteredRecord.classID_classID;  // Extract classID from filtered record

            //                                         // Now delete the productclass using both uniqueID and classID
            //                                         oModel.remove("/productclass(uniqueID_uniqueID=" + sUniqueID + ",classID_classID='" + sClassID + "')", {
            //                                             success: function () {
            //                                                 MessageToast.show("Product and product class entries deleted successfully");
            //                                                 oModel.refresh();
            //                                             },
            //                                             error: function (oError) {
            //                                                 MessageToast.show("Error while deleting the product class entry: " + oError.message);
            //                                             }
            //                                         });
            //                                     } else {
            //                                         MessageToast.show("No matching product class found to delete");
            //                                     }
            //                                 } else {
            //                                     MessageToast.show("No product class records found");
            //                                 }
            //                             },
            //                             error: function (oError) {
            //                                 MessageToast.show("Error fetching the product class data: " + oError.message);
            //                             }
            //                         });
            //                     },
            //                     error: function (oError) {
            //                         MessageToast.show("Error while deleting the product entry: " + oError.message);
            //                     }
            //                 });
            //             }
            //         }
            //     });
            // },

            _deleteProductAndClassByUniqueID: function (sUniqueID) {
                var oModel = this.getView().getModel("cat3model");

                // Confirm deletion action
                MessageBox.confirm("Are you sure you want to delete the product and product class entry with Unique ID: " + sUniqueID + "?", {
                    title: "Confirm Deletion",
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.OK) {
                            // Delete from product entity using uniqueID
                            oModel.remove("/product(uniqueID=" + sUniqueID + ")", {
                                success: function () {
                                    // After deleting the product, read the productclass entity to get all keys
                                    oModel.read("/productclass", {
                                        success: function (oData) {
                                            if (oData.results && oData.results.length > 0) {
                                                // Find the matching product class record by uniqueID
                                                var oFilteredRecord = oData.results.find(function (record) {
                                                    return record.uniqueID_uniqueID === sUniqueID;
                                                });

                                                if (oFilteredRecord) {
                                                    var sClassID = oFilteredRecord.classID_classID;
                                                    var sCharacteristicID = oFilteredRecord.characteristicID_characteristicID; // Retrieve characteristicID

                                                    // Delete the productclass entry using all keys
                                                    var sPath = "/productclass(uniqueID_uniqueID=" + sUniqueID +
                                                        ",classID_classID='" + sClassID + "'" +
                                                        ",characteristicID_characteristicID='" + sCharacteristicID + "')";

                                                    oModel.remove(sPath, {
                                                        success: function () {
                                                            MessageToast.show("Product and product class entries deleted successfully");
                                                            oModel.refresh();
                                                        },
                                                        error: function (oError) {
                                                            MessageToast.show("Error while deleting the product class entry: " + oError.message);
                                                        }
                                                    });
                                                } else {
                                                    MessageToast.show("No matching product class found to delete");
                                                }
                                            } else {
                                                MessageToast.show("No product class records found");
                                            }
                                        },
                                        error: function (oError) {
                                            MessageToast.show("Error fetching the product class data: " + oError.message);
                                        }
                                    });
                                },
                                error: function (oError) {
                                    MessageToast.show("Error while deleting the product entry: " + oError.message);
                                }
                            });
                        }
                    }
                });
            },

            // _deleteProductByUniqueID: function (sUniqueID) {
            //     var oModel = this.getView().getModel();

            //     // Show a confirmation dialog before deletion with the unique ID
            //     MessageBox.confirm("Are you sure you want to delete the product with Unique ID: " + sUniqueID + "?", {
            //         title: "Confirm Deletion",
            //         onClose: function (oAction) {
            //             if (oAction === MessageBox.Action.OK) {
            //                 // Perform the delete operation
            //                 oModel.remove("/product(" + sUniqueID + ")", {
            //                     success: function () {
            //                         MessageToast.show("Product deleted successfully");
            //                         // Optionally refresh the product list or model
            //                         oModel.refresh();
            //                     },
            //                     error: function (oError) {
            //                         MessageToast.show("Error while deleting the product: " + oError.message);
            //                     }
            //                 });
            //             }
            //         }
            //     });
            // },









            onSwitchChange: function (oEvent) { //-----------status functionality----------------
                var oSwitch = oEvent.getSource(); // Get the Switch control that triggered the event

                // Get the binding context of the switch to access the uniqueID
                var oBindingContext = oSwitch.getBindingContext(); // Uses default model

                // Ensure the binding context is valid
                if (!oBindingContext) {
                    MessageBox.error("No product context found.");
                    return;
                }

                // Retrieve the uniqueID from the binding context
                var uniqueID = oBindingContext.getProperty("uniqueID"); // Ensure this matches the actual property name in your model

                // Get the OData model
                var oModel = this.getOwnerComponent().getModel("cat3model");

                // Fetch the current status and toggle it
                var currentStatus = oBindingContext.getProperty("status");
                var newStatus = (currentStatus === "active") ? "inactive" : "active"; // Toggle status

                // Create the payload for the update
                var payload = {
                    status: newStatus
                };

                // Construct the path to the specific product entity using uniqueID
                var sPath = "/product(" + uniqueID + ")"; // Adjust this path according to your OData service structure

                // Update the status in the OData model
                oModel.update(sPath, payload, {
                    success: function () {
                        // Show a success message based on the new status including the unique ID
                        if (newStatus === "active") {
                            MessageBox.success(" Product with Unique ID " + uniqueID + " is now active.");
                        } else {
                            MessageBox.success(" Product with Unique ID " + uniqueID + " is now inactive.");
                        }
                    },
                    error: function () {
                        MessageBox.error("Failed to update status for Product with Unique ID " + uniqueID + ".");
                    }
                });
            },



            onEditAddCharacteristic: function () {//--------------------when i click the add icon insid ethe create button frgamnet panels frgamnet will open there creating the ppanels  dynamically----------
                // Check if the fragment is already loaded
                if (!this.oFragmentUpdate) {
                    // Load the fragment and bind the controller to maintain context
                    this.oFragmentUpdate = sap.ui.xmlfragment("com.productclassuniqueidmaintenanceapplication.fragments.updatecharslectionpanel", this);
                    this.getView().addDependent(this.oFragmentUpdate);

                    // Attach afterOpen event to load data after the dialog is opened
                    this.oFragmentUpdate.attachAfterOpen(this.loadDataUpdate.bind(this));
                }

                // Open the dialog
                this.oFragmentUpdate.open();
            },
            loadDataUpdate: function () {
                // Create OData model with your service URL
                var oModel = this.getOwnerComponent().getModel("cat3model");

                // Fetch the data using OData model
                oModel.read("/classcharselectioncalview", {
                    success: this.onDataLoadedUpdate.bind(this),  // Call onDataLoaded when data is fetched
                    error: function (oError) {
                        // Handle error
                        MessageToast.show("Error loading data");
                    }
                });
            },

            onDataLoadedUpdate: function (oData) {
                var oModel = this.getOwnerComponent().getModel("cat3model");

                if (!this.oFragmentUpdate) {
                    console.error("Fragment is not initialized!");
                    return;
                }

                var oVBox = sap.ui.getCore().byId("myVBoxUpdate");

                if (!oVBox) {
                    console.error("VBox not found in the fragment!");
                    return;
                }

                oVBox.removeAllItems();
                const aTransformedData = this._transformDataUpdate(oData.results);

                if (!Array.isArray(aTransformedData)) {
                    console.error("Transformed data is not an array or is invalid.");
                    return;
                }

                aTransformedData.forEach((oClass) => {
                    const oPanel = new sap.m.Panel({
                        headerText: oClass.CLASSNAME,
                        expandable: true,
                        expanded: false,
                        expand: function (oEvent) {
                            const oPanel = oEvent.getSource();
                            const isExpanded = oEvent.getParameter("expand");

                            if (isExpanded && oPanel.getContent().length === 0) {
                                const oCharVBox = new sap.m.VBox({
                                    renderType: "Bare"
                                });

                                oClass.nodes.forEach((oCharacteristic) => {
                                    const oCharacteristicPanel = new sap.m.Panel({
                                        headerText: oCharacteristic.CHARACTERISTICNAME,
                                        expandable: true,
                                        expanded: false,
                                        expand: function (oCharEvent) {
                                            const oCharPanel = oCharEvent.getSource();
                                            const isCharExpanded = oCharEvent.getParameter("expand");

                                            if (isCharExpanded && oCharPanel.getContent().length === 0) {
                                                const oInnerVBox = new sap.m.VBox({
                                                    renderType: "Bare"
                                                });

                                                oCharacteristic.nodes.forEach((oValue) => {
                                                    const oValueRadioButton = new sap.m.RadioButton({
                                                        text: oValue.VALUE,
                                                        groupName: oClass.CLASSID, // Ensure unique groups
                                                        select: this.onSelect.bind(this),
                                                    });

                                                    oInnerVBox.addItem(oValueRadioButton);
                                                });

                                                oCharPanel.addContent(oInnerVBox);
                                            }
                                        }.bind(this)
                                    });

                                    oCharacteristicPanel.data("characteristicId", oCharacteristic.CHARACTERISTICID);
                                    oCharVBox.addItem(oCharacteristicPanel);


                                });
                                // Store the CLASSID in the panel's data
                                oPanel.data("classId", oClass.CLASSID);  // Store CLASSID here



                                oPanel.addContent(oCharVBox);
                            }
                        }.bind(this)
                    });

                    oVBox.addItem(oPanel);
                });

                this.oFragmentUpdate.rerender();
            },
            _transformDataUpdate: function (aData) {
                const oGroupedData = {};

                aData.forEach((oItem) => {
                    // Initialize the class group if it doesn't exist
                    if (!oGroupedData[oItem.CLASSID]) {
                        oGroupedData[oItem.CLASSID] = {
                            CLASSID: oItem.CLASSID,
                            CLASSNAME: oItem.CLASSNAME, // Use CLASSID as the name, modify if you have a separate class name property
                            nodes: []
                        };
                    }

                    // Reference to the characteristics array within the current class
                    const aCharacteristics = oGroupedData[oItem.CLASSID].nodes;

                    // Check if a panel already exists for this characteristic name within the current CLASSID
                    let oCharacteristic = aCharacteristics.find(char =>
                        char.CHARACTERISTICNAME === oItem.CHARACTERISTICNAME && char.CLASSID === oItem.CLASSID
                    );

                    // If no panel exists for this characteristic within this CLASSID, create one
                    if (!oCharacteristic) {
                        oCharacteristic = {
                            CLASSID: oItem.CLASSID, // Add CLASSID to the characteristic panel for verification
                            CHARACTERISTICID: oItem.CHARACTERISTICID,
                            CHARACTERISTICNAME: oItem.CHARACTERISTICNAME,
                            nodes: [] // Initialize as an array to store all values
                        };
                        aCharacteristics.push(oCharacteristic);
                    }

                    // Add the value to the characteristic's nodes (avoid duplicates if necessary)
                    if (!oCharacteristic.nodes.some(valueObj => valueObj.VALUE === oItem.value)) {
                        oCharacteristic.nodes.push({
                            VALUE: oItem.VALUE
                        });
                    }
                });

                // Convert the grouped data object into an array
                return Object.values(oGroupedData);
            },
            onSubmitClassCharValUpdate: function () {
                // Find the VBox containing panels
                var oVBox = sap.ui.getCore().byId("myVBoxUpdate");
                if (!oVBox) {
                    console.error("VBox not found!");
                    return;
                }
            
                const aPanelData = []; // Array to store all selected data
                let hasSelection = false; // Flag to check if any selection is made
            
                // Iterate through each panel representing a class
                oVBox.getItems().forEach((oPanel) => {
                    const selectedClassName = oPanel.getHeaderText(); // Get class name
                    const classId = oPanel.data("classId"); // Retrieve CLASSID
                    const panelData = {
                        CLASSNAME: selectedClassName,
                        CLASSID: classId,
                        CHARACTERISTICS_DATA: []
                    };
            
                    const oInnerVBox = oPanel.getContent()[0]; // Inner VBox for characteristics
            
                    if (!oInnerVBox || !oInnerVBox.getItems || oInnerVBox.getItems().length === 0) {
                        return; // Skip if no characteristics
                    }
            
                    // Iterate through each characteristic panel
                    oInnerVBox.getItems().forEach((oCharacteristicPanel) => {
                        const characteristicName = oCharacteristicPanel.getHeaderText();
                        const characteristicId = oCharacteristicPanel.data("characteristicId");
            
                        const selectedValues = [];
            
                        // Get selected radio button values
                        oCharacteristicPanel.getContent().forEach((oControl) => {
                            if (oControl instanceof sap.m.VBox) {
                                oControl.getItems().forEach((oSubControl) => {
                                    if (oSubControl instanceof sap.m.RadioButton && oSubControl.getSelected()) {
                                        selectedValues.push(oSubControl.getText());
                                        hasSelection = true; // Set flag if a selection is made
                                    }
                                });
                            }
                        });
            
                        // If values are selected, add to panel data
                        if (selectedValues.length > 0) {
                            panelData.CHARACTERISTICS_DATA.push({
                                CHARACTERISTICID: characteristicId,
                                NAME: characteristicName,
                                SELECTED_VALUES: selectedValues,
                                CLASS_ID: classId // Store CLASS_ID
                            });
                        }
                    });
            
                    // Only push panel data if there is selected data
                    if (panelData.CHARACTERISTICS_DATA.length > 0) {
                        aPanelData.push(panelData);
                    }
                });
            
                // Show message if no selection is made
                if (!hasSelection) {
                    sap.m.MessageToast.show("Please select at least one class and its values.");
                    return;
                }
            
                // Retrieve the characteristics table and its rows
                var characteristicsEditTable = sap.ui.getCore().byId("characteristicsEditTable");
                if (characteristicsEditTable) {
                    const tableRows = characteristicsEditTable.getItems();
            
                    const newCharacteristics = [];
                    const duplicateEntriesBefore = []; // Duplicates before adding the new record
                    const duplicateEntriesAfter = [];  // Duplicates after adding the new record
            
                    // Get the existing data from the table model
                    const existingData = characteristicsEditTable.getModel().getData().FILTERED_DATA || [];
            
                    // Loop through each characteristic in aPanelData and check for duplicates in the existing table data
                    aPanelData.forEach(panel => {
                        panel.CHARACTERISTICS_DATA.forEach(characteristic => {
                            // Check if the same characteristic ID and selected value already exists in the table rows (before adding)
                            const duplicate = existingData.some(row => {
                                return row.CHARACTERISTICID === characteristic.CHARACTERISTICID &&
                                    row.VALUE === characteristic.SELECTED_VALUES.join(', '); // Compare both ID and value
                            });
            
                            if (duplicate) {
                                duplicateEntriesBefore.push(characteristic.NAME); // Add name to duplicates if found
                            } else {
                                newCharacteristics.push({
                                    CHARACTERISTICNAME: characteristic.NAME,
                                    CHARACTERISTICID: characteristic.CHARACTERISTICID,
                                    VALUE: characteristic.SELECTED_VALUES.join(', '), // Store the selected values as a comma-separated string
                                    CLASSID: characteristic.CLASS_ID // Store CLASS_ID here
                                });
                            }
                        });
                    });
            
                    // If duplicates are found before adding, show a message to the user
                    if (duplicateEntriesBefore.length > 0) {
                        const messageBefore = `"${duplicateEntriesBefore.join(', ')}" with the selected values already exist.`;
                        sap.m.MessageToast.show(messageBefore);
                    }
            
                    // Add only new characteristics to the model if there are any
                    if (newCharacteristics.length > 0) {
                        const updatedData = existingData.concat(newCharacteristics); // Merge new data with existing data
                        characteristicsEditTable.getModel().setData({
                            FILTERED_DATA: updatedData
                        });
            
                        // After adding, check again for duplicates to ensure nothing gets added twice
                        const newTableData = characteristicsEditTable.getModel().getData().FILTERED_DATA;
            
                        const allUniqueData = [];
                        newTableData.forEach(item => {
                            // Check if this item already exists in the allUniqueData array based on ID and value
                            const duplicateCheck = allUniqueData.some(existingItem =>
                                existingItem.CHARACTERISTICID === item.CHARACTERISTICID &&
                                existingItem.VALUE === item.VALUE
                            );
            
                            if (!duplicateCheck) {
                                allUniqueData.push(item); // Add if not a duplicate
                            }
                        });
            
                        // Finally, update the model to only include unique records
                        characteristicsEditTable.getModel().setData({
                            FILTERED_DATA: allUniqueData
                        });
            
                        // If duplicates are found after adding, show a message to the user
                        if (allUniqueData.length !== newTableData.length) {
                            const messageAfter = "Duplicate records found after addition. They were removed.";
                            sap.m.MessageToast.show(messageAfter);
                        }
                    }
                }
            
                // Close the dialog and log the selected data
                this.oFragmentUpdate.close();
                console.log("Selected Class Data:", aPanelData);
            }
            

















        });
    });
