sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Panel",
    "sap/m/List",
    "sap/m/MessageToast",
    "sap/m/StandardListItem",
    "sap/m/MessageBox"
],
    function (Controller, Fragment, Filter, FilterOperator, Panel, List, MessageToast, StandardListItem,MessageBox) {
        "use strict";
        var that;
        let oLastSelectedRadioButton = null; // Initialize a variable to keep track of the currently selected radio button

        return Controller.extend("com.productclassuniqueidmaintenanceapplication.controller.ListView", {

            onInit: function () {// -------------in oninit functioanlity by defult i had set one product to the table-------------------
                that = this;
                var oModel = this.getOwnerComponent().getModel("cat3model");
                this.getView().setModel(oModel);
                this.bus = this.getOwnerComponent().getEventBus();
                this._isDataLoaded = false; // Flag to track data loading status
                this.selectedProductID = null;

                // oModel.setProperty("/sId", null); // Initialize the sId property

                // Fetch the product data from the OData service
                oModel.read("/product", {
                    success: function (oData) {
                        // Check if there are any products returned
                        if (oData.results && oData.results.length > 0) {
                            // Set the first product as the default product
                            var defaultProduct = {
                                productName: oData.results[0].productName,  // First product name
                                productID: oData.results[0].productID       // First product ID
                            };

                            // Set the default product to the model
                            oModel.setProperty("/selectedProduct", defaultProduct);

                            // Set the value of the Input field to the product name
                            that.getView().byId("productNameField").setValue(defaultProduct.productName);

                            // Optionally, you can also filter the table by this product ID
                            that._filterTableByProduct(defaultProduct.productID);
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







            onRowSelected: function (oEvent) {//-----------listview table onrowselect fucntiolaity--------------
                var oSelectedItem = oEvent.getSource();
                var oContext = oSelectedItem.getBindingContext();
                var suniqueID = oContext.getProperty("uniqueID");  // Assuming the binding path has "productID"


                // Publish the Product ID via EventBus
                var oEventBus = this.getOwnerComponent().getEventBus();
                console.log("Publishing event with uniqueID: ", suniqueID);
                var oGModel = this.getOwnerComponent().getModel("globalModel");
                oGModel.setProperty("/uniqueID", suniqueID);
                oEventBus.publish("flexible", "setDetailPage", { uniqueID: suniqueID });
            },

            // onRowSelected: function (oEvent) {------------(-------without using og model----------listview on rowselect)
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
                        classID_classID: classID, // Bind the classID from the characteristic
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

            _transformData: function (aData) {
                const oGroupedData = {};

                aData.forEach((oItem) => {
                    // Group by class
                    if (!oGroupedData[oItem.CLASSID]) {
                        oGroupedData[oItem.CLASSID] = {
                            CLASSID: oItem.CLASSID,
                            CLASSNAME: oItem.CLASSNAME,
                            nodes: []
                        };
                    }

                    // Group by characteristic within the class
                    const aCharacteristics = oGroupedData[oItem.CLASSID].nodes;
                    let oCharacteristic = aCharacteristics.find(char => char.CHARACTERISTICID === oItem.CHARACTERISTICID);

                    if (!oCharacteristic) {
                        oCharacteristic = {
                            CHARACTERISTICID: oItem.CHARACTERISTICID,
                            CHARACTERISTICNAME: oItem.CHARACTERISTICNAME,
                            nodes: []
                        };
                        aCharacteristics.push(oCharacteristic);
                    }

                    // Add value to the characteristic
                    oCharacteristic.nodes.push({
                        VALUE: oItem.VALUE
                    });
                });

                // Convert grouped data object into an array
                return Object.values(oGroupedData);
            },

            onSelect: function (oEvent) {
                const oSelectedButton = oEvent.getSource();

                // Check if the clicked radio button is the last selected one
                if (oLastSelectedRadioButton === oSelectedButton) {
                    // Deselect the radio button
                    oSelectedButton.setSelected(false);
                    oLastSelectedRadioButton = null; // Reset the last selected radio button
                    MessageToast.show("Deselected: " + oSelectedButton.getText());
                } else {
                    // Deselect the last selected radio button, if it exists
                    if (oLastSelectedRadioButton) {
                        oLastSelectedRadioButton.setSelected(false);
                    }
                    // Select the clicked radio button
                    oSelectedButton.setSelected(true);
                    oLastSelectedRadioButton = oSelectedButton; // Update the last selected radio button
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



            
            onEditProductListView: function (oEvent) { //------------update fucntionality-----------------
                // Get the selected product data from the table row
                var oSelectedItem = oEvent.getSource().getParent().getBindingContext().getObject();

                // Check if the dialog is already created; if not, create it
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
                sap.ui.getCore().byId("validFromInputUpdate").setValue(oSelectedItem.validFrom);
                sap.ui.getCore().byId("validToInputUpdate").setValue(oSelectedItem.validTo);

                // Open the update dialog
                this._oUpdateDialog.open();
            },

            onSaveUpdatedProduct: function () {
                // Get the updated values from the fragment inputs
                var oUpdatedProduct = {
                    uniqueID: sap.ui.getCore().byId("uniqueIDInputUpdate").getValue(),
                    productID: sap.ui.getCore().byId("productIDInputUpdate").getValue(),
                    productName: sap.ui.getCore().byId("inputProductNameUpdate").getValue(),
                    description: sap.ui.getCore().byId("descriptionInputUpdate").getValue(),
                    status: sap.ui.getCore().byId("statusSelectUpdate").getSelectedKey(),

                    // Parse and format the dates correctly (YYYY-MM-DD)
                    validFrom: this._formatDate(sap.ui.getCore().byId("validFromInputUpdate").getValue()),
                    validTo: this._formatDate(sap.ui.getCore().byId("validToInputUpdate").getValue())
                };

                // Perform the update operation via OData or any service here
                var oModel = this.getView().getModel();
                oModel.update("/product(" + oUpdatedProduct.uniqueID + ")", oUpdatedProduct, {
                    success: function () {
                        MessageToast.show("Product updated successfully");
                    },
                    error: function (oError) {
                        MessageToast.show("Error while updating the product: " + oError.message);
                    }
                });

                // Close the dialog after saving
                this._oUpdateDialog.close();
            },
            _formatDate: function (sDate) {// Helper function to format date in YYYY-MM-DD
                if (!sDate) {
                    return null;  // Handle null or empty date cases
                }
                // Convert string to Date object
                var oDate = new Date(sDate);

                // Ensure it is in YYYY-MM-DD format
                var iYear = oDate.getFullYear();
                var iMonth = (oDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
                var iDay = oDate.getDate().toString().padStart(2, '0');

                return iYear + '-' + iMonth + '-' + iDay;
            },
            onCloseUpdateProductDialog: function () {  // Function to close the update dialog without saving
                this._oUpdateDialog.close();
            },



            

            
            onDeleteProductListView: function (oEvent) { //---------delete fucntionality-----------------
                // Get the context from the button that was pressed
                var oButton = oEvent.getSource(); // Get the button that triggered the event
                var oContext = oButton.getBindingContext(); // Get the binding context of the button
            
                // Check if context is available
                if (oContext) {
                    var sUniqueID = oContext.getProperty("uniqueID"); // Get the unique ID from the context
                    this._deleteProductByUniqueID(sUniqueID);
                } else {
                    MessageToast.show("No product selected for deletion.");
                }
            },
            
            _deleteProductByUniqueID: function (sUniqueID) {
                var oModel = this.getView().getModel();
            
                // Show a confirmation dialog before deletion with the unique ID
                MessageBox.confirm("Are you sure you want to delete the product with Unique ID: " + sUniqueID + "?", {
                    title: "Confirm Deletion",
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.OK) {
                            // Perform the delete operation
                            oModel.remove("/product(" + sUniqueID + ")", {
                                success: function () {
                                    MessageToast.show("Product deleted successfully");
                                    // Optionally refresh the product list or model
                                    oModel.refresh();
                                },
                                error: function (oError) {
                                    MessageToast.show("Error while deleting the product: " + oError.message);
                                }
                            });
                        }
                    }
                });
            }
            




        });
    });
