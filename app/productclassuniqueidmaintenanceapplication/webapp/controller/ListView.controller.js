sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    function (Controller, Fragment, Filter, FilterOperator) {
        "use strict";
        var that;
        return Controller.extend("com.productclassuniqueidmaintenanceapplication.controller.ListView", {
            onInit: function () {
                that = this;
                var oModel = this.getOwnerComponent().getModel("cat3model");
                this.getView().setModel(oModel);
                this.bus = this.getOwnerComponent().getEventBus();
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
                var oSelectedItem = oEvent.getSource();  // Use getSource() instead of getParameter("listItem")

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

                    // Optionally store the selected product ID in a model for further processing
                    var oModel = this.getView().getModel();
                    oModel.setProperty("/selectedProduct/productID", sProductID);
                }
                // Call the existing method to filter the table
                this._filterTableByProduct(sProductID);
                // Close the dialog after selection
                this._valueHelpDialog.close();
            },
            onValueHelpDialogClose:function(){
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

            onAddCharacteristicForm: function () {
                // Retrieve the VBox where the fragment will be added
                var oVBox = Fragment.byId("createProductDialog", "characteristicFormVBox");

                // Ensure the VBox is found
                if (!oVBox) {
                    console.error("VBox with id 'characteristicFormVBox' is not found.");
                    return;
                }

                // Load the characteristic creation fragment dynamically
                if (!this._oCharacteristicCreateFragment) {
                    this._oCharacteristicCreateFragment = sap.ui.xmlfragment("com.productclassuniqueidmaintenanceapplication.fragments.charcreatefragmnet", this);

                    // Add the fragment content to the VBox using addItem() instead of addContent()
                    oVBox.addItem(this._oCharacteristicCreateFragment);
                }

                // Change the button text from "Add Characteristic" to "Save"
                var oAddButton = Fragment.byId("createProductDialog", "addCharacteristicButton"); // Assuming the button has this ID
                if (oAddButton) {
                    oAddButton.setText("Save");
                    oAddButton.setIcon("sap-icon://save"); // Optionally change the icon to a save icon
                } else {
                    console.error("Button with id 'addCharacteristicButton' is not found.");
                }

                // Make the VBox visible to show the form
                oVBox.setVisible(true);
            },

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



            onAddCharacteristic: function () {
                // Load the CheckBox fragment if not already loaded
                if (!this._checkboxDialog) {
                    this._checkboxDialog = Fragment.load({
                        id: 'checkboxDialog',
                        name: "com.productclassuniqueidmaintenanceapplication.fragments.classcharselectionfragment",
                        controller: this
                    }).then(function (oDialog) {
                        this.getView().addDependent(oDialog);
                        return oDialog;
                    }.bind(this));
                }

                // Open the CheckBox dialog and fetch hierarchical data
                this._checkboxDialog.then(function (oDialog) {
                    var oModel = this.getView().getModel("cat3model");

                    // Fetch the data from the OData entity set
                    oModel.read("/classcharselectioncalview", {
                        success: function (oData) {
                            var aHierarchicalData = oData.results;

                            // Process hierarchical data into class, characteristics, and values
                            var hierarchicalData = [];
                            var classMap = {};

                            // Loop through the fetched data and organize it into hierarchical structure
                            aHierarchicalData.forEach(row => {
                                if (!classMap[row.CLASSID]) {
                                    classMap[row.CLASSID] = {
                                        className: row.CLASSNAME,
                                        characteristics: []
                                    };
                                    hierarchicalData.push(classMap[row.CLASSID]);
                                }

                                const classObj = classMap[row.CLASSID];

                                // Find or create the characteristic under the class
                                let characteristic = classObj.characteristics.find(c => c.characteristicName === row.CHARACTERISTICNAME);

                                if (!characteristic) {
                                    characteristic = {
                                        characteristicName: row.CHARACTERISTICNAME,
                                        values: row.VALUE ? [row.VALUE] : []
                                    };
                                    classObj.characteristics.push(characteristic);
                                } else if (row.VALUE) {
                                    characteristic.values.push(row.VALUE);
                                }
                            });

                            // Set the hierarchical data to the model for the TreeTable
                            var oHierarchicalDataModel = new sap.ui.model.json.JSONModel(hierarchicalData);
                            var oTreeTable = Fragment.byId("checkboxDialog", "hierarchicalDataTreeTable");
                            oTreeTable.setModel(oHierarchicalDataModel, "hierarchicalDataModel");

                            // Open the dialog
                            oDialog.open();
                        }.bind(this),
                        error: function (error) {
                            sap.m.MessageToast.show("Error fetching hierarchical data");
                            console.error("Error fetching hierarchical data:", error);
                        }
                    });
                }.bind(this)).catch(function (oError) {
                    console.error("Error loading fragment: ", oError);
                });
            },

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











        });
    });
