sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Panel",
    "sap/m/List",
    "sap/m/MessageToast",
    "sap/m/StandardListItem"
],
    function (Controller, Fragment, Filter, FilterOperator, Panel, List, MessageToast, StandardListItem) {
        "use strict";
        var that;
        let oLastSelectedRadioButton = null; // Initialize a variable to keep track of the currently selected radio button

        return Controller.extend("com.productclassuniqueidmaintenanceapplication.controller.ListView", {
            onInit: function () {
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
            // ----Filter the Table Based on the Selected Product----
            _filterTableByProduct: function (productID) {
                var oTable = this.getView().byId("productTable");
                var oBinding = oTable.getBinding("items");

                // Apply filter based on the product ID
                var aFilters = [new sap.ui.model.Filter("productID", sap.ui.model.FilterOperator.EQ, productID)];
                oBinding.filter(aFilters);
            },

            // ----value help fragmnet-----------
            onValueHelpProduct: function () {
                this.selectedProductID = null;
                // Create value help dialog if it doesn't exist
                if (!this._valueHelpDialog) {
                    this._valueHelpDialog = sap.ui.xmlfragment("com.productclassuniqueidmaintenanceapplication.fragments.productSelectFragmnet", this);
                    this.getView().addDependent(this._valueHelpDialog);


                }

                // Open the dialog
                this._valueHelpDialog.open();
            },
           
            onSelectProduct: function (oEvent) {
                // Get the selected item from the event
                var oSelectedItem = oEvent.getSource();  // Use getSource()

                // Get the binding context of the selected item
                var oContext = oSelectedItem.getBindingContext();
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

                // Call the existing method to filter the table
                this._filterTableByProduct(sProductID);

                // Close the dialog after selection
                this._valueHelpDialog.close();
            },


            onValueHelpDialogClose: function () {
                this._valueHelpDialog.close();
            },



            // This function will be triggered when a row in the table is clicked using global model(Og model)
            onRowSelected: function (oEvent) {
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

            // onRowSelected: function (oEvent) {
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
            onCreate: function () {
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
            }
            ,



            // onCloseCreateProductDialog: function () {
            //     // Close the dialog
            //     this._pCreateProductDialog.then(function (oDialog) {
            //         oDialog.close();
            //         // Reset the input fields after closing
            //         this._resetProductForm();

            //         // Hide the characteristic form
            //         var oCharacteristicVBox = Fragment.byId("createProductDialog", "characteristicFormVBox");
            //         if (oCharacteristicVBox) {
            //             oCharacteristicVBox.setVisible(false); // Hide the characteristic form
            //         } else {
            //             console.error("VBox with id 'characteristicFormVBox' is not found.");
            //         }

            //         // Reset the button text back to "Add Characteristic"
            //         var oAddButton = Fragment.byId("createProductDialog", "addCharacteristicButton");
            //         if (oAddButton) {
            //             oAddButton.setText("Add Characteristic");
            //             oAddButton.setIcon("sap-icon://add"); // Optionally reset the icon
            //         }



            //         // Ensure busy state is reset
            //         this.getView().setBusy(false);
            //     }.bind(this)); // Ensure 'this' is correctly bound
            // },


            onCloseCreateProductDialog: function () {
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








            _resetProductForm: function () {
                // Reset input fields in the fragment
                // Fragment.byId("createProductDialog", "inputProductId").setValue("");
                Fragment.byId("createProductDialog", "inputProductName").setValue("");
                Fragment.byId("createProductDialog", "inputDescription").setValue("");
                Fragment.byId("createProductDialog", "inputStatus").setSelectedKey(""); // Reset status selection
                Fragment.byId("createProductDialog", "inputValidFrom").setValue("");
                Fragment.byId("createProductDialog", "inputValidTo").setValue("");

            },

            onCreateProductChar: function () {
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

            // onAddCharacteristicForm: function () {
            //     // Retrieve the VBox where the fragment will be added
            //     var oVBox = Fragment.byId("createProductDialog", "characteristicFormVBox");

            //     // Ensure the VBox is found
            //     if (!oVBox) {
            //         console.error("VBox with id 'characteristicFormVBox' is not found.");
            //         return;
            //     }

            //     // Load the characteristic creation fragment dynamically
            //     if (!this._oCharacteristicCreateFragment) {

            //         this._oCharacteristicCreateFragment = sap.ui.xmlfragment("com.productclassuniqueidmaintenanceapplication.fragments.charcreatefragmnet", this);

            //         // Add the fragment content to the VBox using addItem() instead of addContent()
            //         oVBox.addItem(this._oCharacteristicCreateFragment);
            //     }

            //     // Change the button text from "Add Characteristic" to "Save"
            //     var oAddButton = Fragment.byId("createProductDialog", "addCharacteristicButton"); // Assuming the button has this ID
            //     if (oAddButton) {
            //         oAddButton.setText("Save");
            //         oAddButton.setIcon("sap-icon://save"); // Optionally change the icon to a save icon

            //     } else {
            //         console.error("Button with id 'addCharacteristicButton' is not found.");
            //     }

            //     // Make the VBox visible to show the form
            //     oVBox.setVisible(true);
            // },


            onButtonPress: function () {
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

            // Function to show the characteristic form
            _showCharacteristicForm: function () {
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

            // Function to save the product and characteristic data
            // _saveProductAndCharacteristics: function () {

            //     var sProductID = this.selectedProductID;



            //     // Collect product data from fragment
            //     var sProductName = sap.ui.core.Fragment.byId("createProductDialog", "inputProductName").getValue();
            //     var sDescription = sap.ui.core.Fragment.byId("createProductDialog", "inputDescription").getValue();
            //     var sStatus = sap.ui.core.Fragment.byId("createProductDialog", "inputStatus").getSelectedKey();
            //     var sValidFrom = sap.ui.core.Fragment.byId("createProductDialog", "inputValidFrom").getValue();
            //     var sValidTo = sap.ui.core.Fragment.byId("createProductDialog", "inputValidTo").getValue();

            //     // Create the product data object
            //     var oProductData = {
            //         productID: sProductID, // Get the product ID from the value help
            //         productName: sProductName,
            //         description: sDescription,
            //         status: sStatus,
            //         validFrom: sValidFrom,
            //         validTo: sValidTo
            //     };

            //     // Save product data to the OData service
            //     this._saveProduct(oProductData);
            // },
            _saveProductAndCharacteristics: function () {
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

            addNewProduct: function (newProductData) {
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
            _saveCharacteristics: function (createdProductID) {
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
            
            // Function to add a new product


            // _saveProduct: function (oProductData) {
            //     var oModel = this.getView().getModel("cat3model"); // Assuming you're using ODataModel
            //     oModel.create("/product", oProductData, {
            //         success: function (oData) {
            //             sap.m.MessageToast.show("Product saved successfully!");

            //             // Here, oData should contain the auto-generated UUID (uniqueID)
            //             var sUniqueID = oData.uniqueID; // Extract the auto-generated UUID

            //             // Now save the characteristics linked to this product UUID
            //             this._saveCharacteristics(sUniqueID); // Pass the uniqueID to saveCharacteristics
            //         }.bind(this),
            //         error: function () {
            //             sap.m.MessageToast.show("Error saving product.");
            //         }
            //     });
            // },

            // _saveProduct: function (oProductData) {
            //     var oModel = this.getView().getModel("cat3model"); // Assuming you're using ODataModel

            //     // Automatically generate a UUID for uniqueID
            //     oProductData.uniqueID = this._generateUUID(); // You can implement a UUID generator or use a library

            //     // Now create the product with the new unique ID
            //     oModel.create("/product", oProductData, {
            //         success: function (oData) {
            //             sap.m.MessageToast.show("Product saved successfully!");
            //             // Optionally, save characteristics linked to this product
            //             this._saveCharacteristics(oProductData.uniqueID); // Use the uniqueID for characteristic linkage
            //         }.bind(this),
            //         error: function () {
            //             sap.m.MessageToast.show("Error saving product.");
            //         }
            //     });
            // },




            // _saveCharacteristics: function () {
            //     var oCharacteristicTable = sap.ui.getCore().byId("characteristicTable");
            //     var aItems = oCharacteristicTable.getItems();

            //     var oModel = this.getView().getModel("cat3model");

            //     // Loop through table items and collect characteristics data
            //     aItems.forEach(function (oItem) {
            //         var oContext = oItem.getBindingContext();
            //         var oCharacteristicData = oContext.getObject();

            //         // Create a new entry for each characteristic, linking it to the product's uniqueID
            //         var oNewCharacteristicData = {
            //             characteristicID: oCharacteristicData.ID,
            //             characteristicName: oCharacteristicData.Name,
            //             classID_classID: oCharacteristicData.CLASS_ID,  // Assuming classID is already selected
            //              // value: oCharacteristicData.SELECTED_VALUES,
            //              // Flatten the value: send the first selected value or a concatenated string
            //              value: oCharacteristicData.SELECTED_VALUES.length > 0 ? oCharacteristicData.SELECTED_VALUES[0] : null,
            //              // productID: sProductID // Link the characteristic to the product using the uniqueID
            //         };

            //         // Save the characteristic to the OData service
            //         oModel.create("/characteristic", oNewCharacteristicData, {
            //             success: function () {
            //                 sap.m.MessageToast.show("Characteristic saved successfully!");
            //             },
            //             error: function () {
            //                 sap.m.MessageToast.show("Error saving characteristic.");
            //             }
            //         });
            //     });
            // },
            // _saveCharacteristics: function (classID) {
            //     var oCharacteristicTable = sap.ui.getCore().byId("characteristicTable");
            //     var aItems = oCharacteristicTable.getItems();

            //     var oModel = this.getView().getModel("cat3model");

            //     // Step 1: Fetch existing characteristics for the specified class
            //     oModel.read("/characteristic?$filter=classID_classID eq '" + classID + "'", {
            //         success: function (data) {
            //             // Store existing characteristics in a set for quick lookup
            //             var existingCharacteristicIDs = new Set(data.results.map(item => item.characteristicID));

            //             // Step 2: Loop through table items and collect characteristics data
            //             aItems.forEach(function (oItem) {
            //                 var oContext = oItem.getBindingContext();
            //                 var oCharacteristicData = oContext.getObject();

            //                 // Prepare new characteristic data
            //                 var oNewCharacteristicData = {
            //                     characteristicID: oCharacteristicData.ID,
            //                     characteristicName: oCharacteristicData.Name,
            //                     classID_classID: classID,  // Use classID for linking
            //                     value: oCharacteristicData.SELECTED_VALUES.length > 0 ? oCharacteristicData.SELECTED_VALUES[0] : null,
            //                 };

            //                 // Step 3: Check if the characteristic already exists for the class
            //                 if (!existingCharacteristicIDs.has(oNewCharacteristicData.characteristicID)) {
            //                     // If it doesn't exist, create the new characteristic
            //                     oModel.create("/characteristic", oNewCharacteristicData, {
            //                         success: function () {
            //                             sap.m.MessageToast.show("Characteristic saved successfully!");
            //                         },
            //                         error: function () {
            //                             sap.m.MessageToast.show("Error saving characteristic.");
            //                         }
            //                     });
            //                 } else {
            //                     // If it already exists, show a message
            //                     sap.m.MessageToast.show("Characteristic already exists for this class: " + oNewCharacteristicData.characteristicID);
            //                 }
            //             });
            //         },
            //         error: function () {
            //             sap.m.MessageToast.show("Error fetching existing characteristics for the class.");
            //         }
            //     });
            // },


            // onAddCharacteristic: function () {
            //     // Load the CheckBox fragment if not already loaded
            //     if (!this._checkboxDialog) {
            //         this._checkboxDialog = Fragment.load({
            //             id: 'checkboxDialog',
            //             name: "com.productclassuniqueidmaintenanceapplication.fragments.classcharselectionfragment",
            //             controller: this
            //         }).then(function (oDialog) {
            //             this.getView().addDependent(oDialog);
            //             return oDialog;
            //         }.bind(this));
            //     }

            //     // Open the CheckBox dialog and fetch hierarchical data
            //     this._checkboxDialog.then(function (oDialog) {
            //         var oModel = this.getView().getModel("cat3model");

            //         // Fetch the data from the OData entity set
            //         oModel.read("/classcharselectioncalview", {
            //             success: function (oData) {
            //                 var aHierarchicalData = oData.results; // Accessing the correct data structure

            //                 // Process hierarchical data into class, characteristics, and values
            //                 var hierarchicalData = [];
            //                 var classMap = {};

            //                 // Loop through the fetched data and organize it into hierarchical structure
            //                 aHierarchicalData.forEach(row => {
            //                     // Check if the class already exists in the map
            //                     if (!classMap[row.CLASSID]) {
            //                         classMap[row.CLASSID] = {
            //                             className: row.CLASSNAME,
            //                             classId: row.CLASSID,
            //                             characteristics: []
            //                         };
            //                         hierarchicalData.push(classMap[row.CLASSID]);
            //                     }

            //                     const classObj = classMap[row.CLASSID];

            //                     // Find or create the characteristic under the class
            //                     let characteristic = classObj.characteristics.find(c => c.characteristicId === row.CHARACTERISTICID);

            //                     if (!characteristic) {
            //                         characteristic = {
            //                             characteristicName: row.CHARACTERISTICNAME,
            //                             characteristicId: row.CHARACTERISTICID,
            //                             values: row.VALUE ? [row.VALUE] : []
            //                         };
            //                         classObj.characteristics.push(characteristic);
            //                     } else if (row.VALUE) {
            //                         characteristic.values.push(row.VALUE);
            //                     }
            //                 });

            //                 // Convert processed data into the format needed for the TreeTable
            //                 var aFilteredHierarchicalData = hierarchicalData.map(function (classObj) {
            //                     return {
            //                         className: classObj.className,
            //                         characteristics: classObj.characteristics.map(function (charObj) {
            //                             return {
            //                                 characteristicName: charObj.characteristicName,
            //                                 values: charObj.values.join(", ")
            //                             };
            //                         })
            //                     };
            //                 });

            //                 // Set the filtered hierarchical data to the model for the TreeTable
            //                 var oFilteredHierarchicalDataModel = new sap.ui.model.json.JSONModel(aFilteredHierarchicalData);
            //                 var oTreeTable = Fragment.byId("checkboxDialog", "hierarchicalDataTreeTable");
            //                 oTreeTable.setModel(oFilteredHierarchicalDataModel, "hierarchicalDataModel");

            //                 // Open the dialog
            //                 oDialog.open();
            //             }.bind(this),
            //             error: function (error) {
            //                 sap.m.MessageToast.show("Error fetching hierarchical data");
            //                 console.error("Error fetching hierarchical data:", error);
            //             }
            //         });
            //     }.bind(this)).catch(function (oError) {
            //         console.error("Error loading fragment: ", oError);
            //     });
            // },

            // onAddCharacteristic: function () {
            //     // Create and open the dialog if it does not exist
            //     if (!this._oCheckBoxDialog) {
            //         this._oCheckBoxDialog = sap.ui.xmlfragment("com.productclassuniqueidmaintenanceapplication.fragments.classcharselectionfragment", this);
            //         this.getView().addDependent(this._oCheckBoxDialog);
            //     }
            //     this._oCheckBoxDialog.open();
            // },



            // onAddCharacteristic: function () {
            //     // Load the CheckBox fragment if not already loaded
            //     if (!this._checkboxDialog) {
            //         this._checkboxDialog = Fragment.load({
            //             id: 'checkboxDialog',
            //             name: "com.productclassuniqueidmaintenanceapplication.fragments.classcharselectionfragment",
            //             controller: this
            //         }).then(function (oDialog) {
            //             this.getView().addDependent(oDialog);
            //             return oDialog;
            //         }.bind(this));
            //     }

            //     // Open the CheckBox dialog and fetch hierarchical data
            //     this._checkboxDialog.then(function (oDialog) {
            //         var oModel = this.getView().getModel("cat3model");

            //         // Fetch the data from the OData entity set
            //         oModel.read("/classcharselectioncalview", {
            //             success: function (oData) {
            //                 var aHierarchicalData = oData.results;

            //                 // Process hierarchical data into class, characteristics, and values
            //                 var hierarchicalData = [];
            //                 var classMap = {};

            //                 // Loop through the fetched data and organize it into hierarchical structure
            //                 aHierarchicalData.forEach(row => {
            //                     if (!classMap[row.CLASSID]) {
            //                         classMap[row.CLASSID] = {
            //                             className: row.CLASSNAME,
            //                             characteristics: []
            //                         };
            //                         hierarchicalData.push(classMap[row.CLASSID]);
            //                     }

            //                     const classObj = classMap[row.CLASSID];

            //                     // Find or create the characteristic under the class
            //                     let characteristic = classObj.characteristics.find(c => c.characteristicName === row.CHARACTERISTICNAME);

            //                     if (!characteristic) {
            //                         characteristic = {
            //                             characteristicName: row.CHARACTERISTICNAME,
            //                             values: row.VALUE ? [row.VALUE] : []
            //                         };
            //                         classObj.characteristics.push(characteristic);
            //                     } else if (row.VALUE) {
            //                         characteristic.values.push(row.VALUE);
            //                     }
            //                 });

            //                 // Set the hierarchical data to the model for the TreeTable
            //                 var oHierarchicalDataModel = new sap.ui.model.json.JSONModel(hierarchicalData);
            //                 var oTreeTable = Fragment.byId("checkboxDialog", "hierarchicalDataTreeTable");
            //                 oTreeTable.setModel(oHierarchicalDataModel, "hierarchicalDataModel");

            //                 // Open the dialog
            //                 oDialog.open();
            //             }.bind(this),
            //             error: function (error) {
            //                 sap.m.MessageToast.show("Error fetching hierarchical data");
            //                 console.error("Error fetching hierarchical data:", error);
            //             }
            //         });
            //     }.bind(this)).catch(function (oError) {
            //         console.error("Error loading fragment: ", oError);
            //     });
            // },

            // ------search field-------------
            onUniqueIDSearch: function (oEvent) {
                // Get the value from the search field
                var sQuery = oEvent.getParameter("newValue");

                // Create an array of filters
                var aFilters = [];
                if (sQuery && sQuery.length > 0) {
                    // Create a filter for uniqueID
                    var oUniqueIDFilter = new Filter("uniqueID", FilterOperator.Contains, sQuery);

                    // Create a filter for description
                    var oDescriptionFilter = new Filter("description", FilterOperator.Contains, sQuery);

                    // Combine filters using OR logic
                    var oCombinedFilter = new sap.ui.model.Filter({
                        filters: [oUniqueIDFilter, oDescriptionFilter],
                        and: false // 'false' means OR condition
                    });

                    aFilters.push(oCombinedFilter);
                }

                // Get the table and its binding
                var oTable = this.byId("productTable");
                var oBinding = oTable.getBinding("items");

                // Apply the filter
                oBinding.filter(aFilters, "Application");
            },



            // // Load data method
            // loadData: function () {
            //     // Create OData model with your service URL
            //     var oModel = this.getOwnerComponent().getModel("cat3model");

            //     // Fetch the data using OData model
            //     oModel.read("/classcharselectioncalview", {
            //         success: this.onDataLoaded.bind(this),  // Call onDataLoaded when data is fetched
            //         error: function (oError) {
            //             // Handle error
            //             MessageToast.show("Error loading data");
            //         }
            //     });
            // },

            // // onDataLoaded: function (oData) {
            // //     // Ensure the fragment is initialized before accessing it
            // //     if (!this.oFragment) {
            // //         console.error("Fragment is not initialized!");
            // //         return;
            // //     }
            // //     console.log(this.oFragment);

            // //     // Access the VBox using its ID
            // //     var oVBox = sap.ui.getCore().byId("myVBox"); // Adjust the ID as necessary

            // //     if (!oVBox) {
            // //         console.error("VBox not found in the fragment!");
            // //         return;
            // //     }

            // //     // Clear existing content to avoid duplicates
            // //     oVBox.removeAllItems();

            // //     // Group and transform the data into the desired structure
            // //     const aTransformedData = this._transformData(oData.results);

            // //     // Dynamically create panels based on the transformed data
            // //     aTransformedData.forEach((oClass) => {
            // //         // Create a new panel for each class
            // //         const oPanel = new sap.m.Panel({
            // //             headerText: oClass.CLASSNAME,
            // //             expandable: true,
            // //             expanded: false, // Initially collapsed
            // //             expand: function (oEvent) {
            // //                 const oPanel = oEvent.getSource();
            // //                 const isExpanded = oEvent.getParameter("expand");

            // //                 // Check if the panel has already been populated with content
            // //                 if (isExpanded && oPanel.getContent().length === 0) {
            // //                     // Create a container for characteristic panels
            // //                     const oCharVBox = new sap.m.VBox({
            // //                         renderType: "Bare"
            // //                     });

            // //                     // Add a panel for each characteristic inside the class
            // //                     oClass.nodes.forEach((oCharacteristic) => {
            // //                         const oCharacteristicPanel = new sap.m.Panel({
            // //                             headerText: oCharacteristic.CHARACTERISTICNAME,
            // //                             expandable: true,
            // //                             expanded: false, // Initially collapsed
            // //                             expand: function (oCharEvent) {
            // //                                 const oCharPanel = oCharEvent.getSource();
            // //                                 const isCharExpanded = oCharEvent.getParameter("expand");

            // //                                 // Only add values when the panel is expanded and no content exists yet
            // //                                 if (isCharExpanded && oCharPanel.getContent().length === 0) {
            // //                                     // Create a container for the value radio buttons
            // //                                     const oInnerVBox = new sap.m.VBox({
            // //                                         renderType: "Bare"
            // //                                     });

            // //                                     // Add radio buttons for each value of the characteristic
            // //                                     oCharacteristic.nodes.forEach((oValue) => {
            // //                                         const oValueRadioButton = new sap.m.RadioButton({
            // //                                             text: oValue.VALUE,
            // //                                             groupName: oClass.CLASSID, // Ensure unique groups
            // //                                             select: this.onSelect.bind(this)
            // //                                         });

            // //                                         // Add value radio button to the inner VBox
            // //                                         oInnerVBox.addItem(oValueRadioButton);
            // //                                     });

            // //                                     // Add the inner VBox to the characteristic panel
            // //                                     oCharPanel.addContent(oInnerVBox);
            // //                                 }
            // //                             }.bind(this)
            // //                         });

            // //                         // Add the characteristic panel to the characteristic VBox
            // //                         oCharVBox.addItem(oCharacteristicPanel);
            // //                     });

            // //                     // Add the characteristic VBox to the class panel
            // //                     oPanel.addContent(oCharVBox);
            // //                 }
            // //             }.bind(this)
            // //         });

            // //         // Add the class panel to the VBox
            // //         oVBox.addItem(oPanel);
            // //     });

            // //     // Optionally refresh the dialog to show new content
            // //     this.oFragment.rerender();
            // // },

            // onDataLoaded: function (oData) {
            //     var oModel = this.getOwnerComponent().getModel("cat3model");

            //     // Ensure the fragment is initialized before accessing it
            //     if (!this.oFragment) {
            //         console.error("Fragment is not initialized!");
            //         return;
            //     }

            //     // Access the VBox using its ID
            //     var oVBox = sap.ui.getCore().byId("myVBox"); // Adjust the ID as necessary

            //     if (!oVBox) {
            //         console.error("VBox not found in the fragment!");
            //         return;
            //     }

            //     // Clear existing content to avoid duplicates
            //     oVBox.removeAllItems();

            //     // Group and transform the data into the desired structure
            //     const aTransformedData = this._transformData(oData.results);

            //     // Check if transformed data is valid
            //     if (!Array.isArray(aTransformedData)) {
            //         console.error("Transformed data is not an array or is invalid.");
            //         return;
            //     }

            //     // Dynamically create panels based on the transformed data
            //     aTransformedData.forEach((oClass) => {
            //         // Create a new panel for each class
            //         const oPanel = new sap.m.Panel({
            //             headerText: oClass.CLASSNAME,
            //             expandable: true,
            //             expanded: false, // Initially collapsed
            //             expand: function (oEvent) {
            //                 const oPanel = oEvent.getSource();
            //                 const isExpanded = oEvent.getParameter("expand");

            //                 // Check if the panel has already been populated with content
            //                 if (isExpanded && oPanel.getContent().length === 0) {
            //                     // Create a container for characteristic panels
            //                     const oCharVBox = new sap.m.VBox({
            //                         renderType: "Bare"
            //                     });

            //                     // Add a panel for each characteristic inside the class
            //                     oClass.nodes.forEach((oCharacteristic) => {
            //                         // Create a new characteristic panel
            //                         const oCharacteristicPanel = new sap.m.Panel({
            //                             headerText: oCharacteristic.CHARACTERISTICNAME,
            //                             expandable: true,
            //                             expanded: false, // Initially collapsed
            //                             expand: function (oCharEvent) {
            //                                 const oCharPanel = oCharEvent.getSource();
            //                                 const isCharExpanded = oCharEvent.getParameter("expand");

            //                                 // Only add values when the panel is expanded and no content exists yet
            //                                 if (isCharExpanded && oCharPanel.getContent().length === 0) {
            //                                     // Create a container for the value radio buttons
            //                                     const oInnerVBox = new sap.m.VBox({
            //                                         renderType: "Bare"
            //                                     });

            //                                     // Add radio buttons for each value of the characteristic
            //                                     oCharacteristic.nodes.forEach((oValue) => {
            //                                         const oValueRadioButton = new sap.m.RadioButton({
            //                                             text: oValue.VALUE,
            //                                             groupName: oClass.CLASSID, // Ensure unique groups
            //                                             select: this.onSelect.bind(this)
            //                                         });

            //                                         // Add value radio button to the inner VBox
            //                                         oInnerVBox.addItem(oValueRadioButton);
            //                                     });

            //                                     // Add the inner VBox to the characteristic panel
            //                                     oCharPanel.addContent(oInnerVBox);
            //                                 }
            //                             }.bind(this)
            //                         });

            //                         // Set the characteristicId as a data attribute
            //                         const characteristicID = oCharacteristic.CHARACTERISTICID;
            //                         if (characteristicID) {
            //                             oCharacteristicPanel.data("characteristicId", characteristicID); // Set the characteristicId
            //                             oCharacteristicPanel.setBindingContext(new sap.ui.model.Context(oModel, "/classcharselectioncalview/" + characteristicID));
            //                         }

            //                         // Log to ensure binding context is set
            //                         console.log("Characteristic Panel Binding Context:", oCharacteristicPanel.getBindingContext());
            //                         console.log("Characteristic ID:", oCharacteristicPanel.data("characteristicId")); // Log the characteristicId

            //                         // Add the characteristic panel to the characteristic VBox
            //                         oCharVBox.addItem(oCharacteristicPanel);
            //                     });

            //                     // Add the characteristic VBox to the class panel
            //                     oPanel.addContent(oCharVBox);
            //                 }
            //             }.bind(this)
            //         });

            //         // Add the class panel to the VBox
            //         oVBox.addItem(oPanel);
            //     });

            //     // Optionally refresh the dialog to show new content
            //     this.oFragment.rerender();
            // },

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

            // onSelect: function (oEvent) {
            //     const sSelectedValue = oEvent.getSource().getText();
            //     MessageToast.show("Selected: " + sSelectedValue);
            // },



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





            onAddCharacteristic: function () {
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
            // onAddCharacteristic: function () {
            //     // Check if the fragment is already loaded
            //     if (!this.oFragment) {
            //         // Load the fragment and bind the controller to maintain context
            //         this.oFragment = sap.ui.xmlfragment("com.productclassuniqueidmaintenanceapplication.fragments.classcharselectionfragment", this);
            //         this.getView().addDependent(this.oFragment);

            //         // Attach afterOpen event to load data after the dialog is opened
            //         this.oFragment.attachAfterOpen(this.loadData.bind(this));
            //     }

            //     // Open the dialog
            //     this.oFragment.open();

            //     // Get the existing characteristics from the model
            //     var oTable = sap.ui.getCore().byId("characteristicTable");
            //     var oModel = oTable.getModel();

            //     if (!(oModel instanceof sap.ui.model.json.JSONModel)) {
            //         sap.m.MessageToast.show("Table model not found.");
            //         return;
            //     }

            //     // Get existing characteristics from the model
            //     var existingData = oModel.getData().CHARACTERISTICS_DATA || [];

            //     // Load the new data (this can come from an external source, user input, etc.)
            //     // In this example, let's assume `newData` is an array of characteristics that you're adding
            //     var newData = [ /* new characteristics data here */];

            //     // Filter out duplicates based on ID
            //     var characteristicIds = new Set(existingData.map(characteristic => characteristic.ID)); // Collect IDs of existing characteristics

            //     newData.forEach((newCharacteristic) => {
            //         if (!characteristicIds.has(newCharacteristic.ID)) {
            //             // If the characteristic ID does not exist, add it to the existing data
            //             existingData.push(newCharacteristic);
            //             characteristicIds.add(newCharacteristic.ID); // Add the new ID to the set
            //         }
            //     });

            //     // Update the model with the combined data (existing + new, no duplicates)
            //     oModel.setData({
            //         CHARACTERISTICS: existingData
            //     });

            //     console.log("Updated characteristics:", existingData);
            // },

            // ------classcharvalue frgament close functionality-------------

            onCloseClassCharValDialog: function () {
                this.oFragment.close();
            },

            // ----------classcharvalue fragment submit button---------------------



            // onSubmitClassCharVal: function () {
            //     var oVBox = sap.ui.getCore().byId("myVBox"); // Adjust the ID as necessary

            //     if (!oVBox) {
            //         console.error("VBox not found!");
            //         return;
            //     }

            //     const aPanelData = [];

            //     oVBox.getItems().forEach((oPanel) => {
            //         const panelData = {
            //             CLASSNAME: oPanel.getHeaderText(),
            //             CHARACTERISTICS: []
            //         };

            //         const oInnerVBox = oPanel.getContent()[0]; // Get the inner VBox that holds characteristics

            //         oInnerVBox.getItems().forEach((oCharacteristicPanel) => {
            //             const characteristicName = oCharacteristicPanel.getHeaderText();
            //             const selectedValues = [];

            //             // Iterate through the contents of the characteristic panel
            //             oCharacteristicPanel.getContent().forEach((oControl) => {
            //                 // If the control is a VBox, iterate through its items
            //                 if (oControl instanceof sap.m.VBox) {
            //                     oControl.getItems().forEach((oSubControl) => {
            //                         if (oSubControl instanceof sap.m.RadioButton) {
            //                             console.log("Radio Button Text:", oSubControl.getText());
            //                             console.log("Is Selected:", oSubControl.getSelected());

            //                             // If the radio button is selected, push its text
            //                             if (oSubControl.getSelected()) {
            //                                 selectedValues.push(oSubControl.getText());
            //                             }
            //                         }
            //                     });
            //                 }
            //             });

            //             // Log selected values for each characteristic
            //             console.log("Selected Values for", characteristicName, ":", selectedValues);

            //             panelData.CHARACTERISTICS.push({
            //                 NAME: characteristicName,
            //                 SELECTED_VALUES: selectedValues
            //             });
            //         });

            //         aPanelData.push(panelData);
            //     });

            //     console.log("Complete Panel Data:", aPanelData);
            //     return aPanelData; // Return or use the selected values as needed
            // },
            // onSubmitClassCharVal: function () {
            //     var oVBox = sap.ui.getCore().byId("myVBox"); // Adjust the ID as necessary
            //     if (!oVBox) {
            //         console.error("VBox not found!");
            //         return;
            //     }

            //     const aPanelData = []; // Reset the data array
            //     let hasSelection = false; // Flag to check if any selection is made

            //     // Iterate through each panel (representing a class)
            //     oVBox.getItems().forEach((oPanel) => {
            //         const selectedClassName = oPanel.getHeaderText(); // Get the class name
            //         const panelData = {
            //             CLASSNAME: selectedClassName,
            //             CHARACTERISTICS_DATA: []
            //         };

            //         const oInnerVBox = oPanel.getContent()[0]; // Get the inner VBox that holds characteristics

            //         if (!oInnerVBox || !oInnerVBox.getItems || oInnerVBox.getItems().length === 0) {
            //             return; // Skip this panel if no characteristics are found
            //         }

            //         // Iterate through each characteristic panel
            //         oInnerVBox.getItems().forEach((oCharacteristicPanel) => {
            //             const characteristicName = oCharacteristicPanel.getHeaderText();

            //             const selectedValues = [];

            //             // Iterate through the content of the characteristic panel (e.g., radio buttons)
            //             oCharacteristicPanel.getContent().forEach((oControl) => {
            //                 if (oControl instanceof sap.m.VBox) {
            //                     oControl.getItems().forEach((oSubControl) => {
            //                         if (oSubControl instanceof sap.m.RadioButton) {
            //                             // If a radio button is selected, add its text to selectedValues
            //                             if (oSubControl.getSelected()) {
            //                                 selectedValues.push(oSubControl.getText());
            //                                 hasSelection = true; // Set the flag if a selection is made
            //                             }
            //                         }
            //                     });
            //                 }
            //             });

            //             // If any values were selected for the characteristic, add it to the panel data
            //             if (selectedValues.length > 0) {
            //                 panelData.CHARACTERISTICS_DATA.push({
            //                     NAME: characteristicName,
            //                     SELECTED_VALUES: selectedValues
            //                 });
            //             }
            //         });

            //         // Only push the panel data if something is selected
            //         if (panelData.CHARACTERISTICS_DATA.length > 0) {
            //             aPanelData.push(panelData);
            //         }
            //     });

            //     // If no characteristics or values are selected, show a message and stop processing
            //     if (!hasSelection) {
            //         sap.m.MessageToast.show("Please select at least one class and its values.");
            //         return;
            //     }

            //     // Now bind the selected data to the table in the fragment
            //     var oCharacteristicTable = sap.ui.getCore().byId("characteristicTable");
            //     if (oCharacteristicTable) {
            //         // Check if the table has a JSONModel attached, if not, create one
            //         var oModel = oCharacteristicTable.getModel();
            //         if (!(oModel instanceof sap.ui.model.json.JSONModel)) {
            //             oModel = new sap.ui.model.json.JSONModel(); // Create a new JSONModel
            //             oCharacteristicTable.setModel(oModel);
            //         }

            //         // Get existing data from the model, or initialize to an empty array
            //         var existingData = oModel.getData().CHARACTERISTICS_DATA || [];

            //         // Append the new selected data to the existing data
            //         var newData = existingData.concat(aPanelData.flatMap((panel) => panel.CHARACTERISTICS_DATA));

            //         // Update the model data with the combined (existing + new) values
            //         oModel.setData({
            //             CHARACTERISTICS_DATA: newData
            //         });
            //     }

            //     this.oFragment.close();
            //     console.log("Selected Class Data:", aPanelData);
            // }, 
            // onSubmitClassCharVal: function () {
            //     var oVBox = sap.ui.getCore().byId("myVBox"); // Adjust the ID as necessary
            //     if (!oVBox) {
            //         console.error("VBox not found!");
            //         return;
            //     }

            //     const aPanelData = []; // Reset the data array
            //     let hasSelection = false; // Flag to check if any selection is made

            //     // Iterate through each panel (representing a class)
            //     oVBox.getItems().forEach((oPanel) => {
            //         const selectedClassName = oPanel.getHeaderText(); // Get the class name
            //         const panelData = {
            //             CLASSNAME: selectedClassName,
            //             CHARACTERISTICS_DATA: []
            //         };

            //         const oInnerVBox = oPanel.getContent()[0]; // Get the inner VBox that holds characteristics

            //         if (!oInnerVBox || !oInnerVBox.getItems || oInnerVBox.getItems().length === 0) {
            //             return; // Skip this panel if no characteristics are found
            //         }

            //         // Iterate through each characteristic panel
            //         oInnerVBox.getItems().forEach((oCharacteristicPanel) => {
            //             const characteristicName = oCharacteristicPanel.getHeaderText();
            //             const characteristicId = oCharacteristicPanel.data("characteristicId"); // Retrieve characteristicId

            //             console.log("Characteristic ID:", characteristicId); // Log the characteristicId

            //             const selectedValues = [];

            //             // Iterate through the content of the characteristic panel (e.g., radio buttons)
            //             oCharacteristicPanel.getContent().forEach((oControl) => {
            //                 if (oControl instanceof sap.m.VBox) {
            //                     oControl.getItems().forEach((oSubControl) => {
            //                         if (oSubControl instanceof sap.m.RadioButton) {
            //                             // If a radio button is selected, add its text to selectedValues
            //                             if (oSubControl.getSelected()) {
            //                                 selectedValues.push(oSubControl.getText());
            //                                 hasSelection = true; // Set the flag if a selection is made
            //                             }
            //                         }
            //                     });
            //                 }
            //             });

            //             // If any values were selected for the characteristic, add it to the panel data
            //             if (selectedValues.length > 0) {
            //                 panelData.CHARACTERISTICS_DATA.push({
            //                     ID: characteristicId, // Include the characteristicId here
            //                     NAME: characteristicName,
            //                     SELECTED_VALUES: selectedValues
            //                 });
            //             }
            //         });

            //         // Only push the panel data if something is selected
            //         if (panelData.CHARACTERISTICS_DATA.length > 0) {
            //             aPanelData.push(panelData);
            //         }
            //     });

            //     // If no characteristics or values are selected, show a message and stop processing
            //     if (!hasSelection) {
            //         sap.m.MessageToast.show("Please select at least one class and its values.");
            //         return;
            //     }

            //     // Now bind the selected data to the table in the fragment
            //     var oCharacteristicTable = sap.ui.getCore().byId("characteristicTable");
            //     if (oCharacteristicTable) {
            //         // Check if the table has a JSONModel attached, if not, create one
            //         var oModel = oCharacteristicTable.getModel();
            //         if (!(oModel instanceof sap.ui.model.json.JSONModel)) {
            //             oModel = new sap.ui.model.json.JSONModel(); // Create a new JSONModel
            //             oCharacteristicTable.setModel(oModel);
            //         }

            //         // Get existing data from the model, or initialize to an empty array
            //         var existingData = oModel.getData().CHARACTERISTICS_DATA || [];

            //         // Append the new selected data to the existing data
            //         var newData = existingData.concat(aPanelData.flatMap((panel) => panel.CHARACTERISTICS_DATA));

            //         // Update the model data with the combined (existing + new) values
            //         oModel.setData({
            //             CHARACTERISTICS_DATA: newData
            //         });
            //     }

            //     this.oFragment.close();
            //     console.log("Selected Class Data:", aPanelData);
            // },


            onSubmitClassCharVal: function () {
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























        });
    });
