sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/routing/History",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",

], function (Controller, MessageToast, History, Fragment,MessageBox) {
    "use strict";
    var that;
    return Controller.extend("com.productclassdatamaintenanceapplication.controller.AddProductView", {
        onInit: function () {
            that = this;
            var oModel = this.getOwnerComponent().getModel("productclassmodel");
            this.getView().setModel(oModel);
           
            //    ----for classedit----
            this._oTable = this.byId("classTable");
            this._oEditContainer = this.byId("editClassContainer");


            //    ---for product edit-----
            this._oProductTable = this.byId("productsTable");
            this._oEditProductContainer = this.byId("editProductContainer");

            // ----for charecetrics edit-----
            this._oCharacteristicTable = this.byId("characteristicsTable");
            this._oEditCharacteristicContainer = this.byId("editCharacteristicContainer");

            // ---for characterict value edit---------

            this._oCharacteristicValueTable = this.byId("characteristicsValueTable");
            this._oEditCharacteristicValueContainer = this.byId("editCharacteristicValueContainer");




            //    that._loadCharacteristicValues(); //read method of charecetrictsvalue----
            //    that._loadProductClass(); //read method of productclass----
        },

        // Method to load characteristic values into a separate model




        //         _loadCharacteristicValues: function () {
        //              var oModel = this.getOwnerComponent().getModel("productclassmodel");

        //                oModel.read("/CHARACTERISTICSVALUE", {
        //                success: function (oData) {
        //             // Extract only the CHARACTERISTICSVALUE data
        //             var aCharacteristicValues = oData.results.filter(function(item) {
        //                 return item.characteristicID_characteristicID; // Ensure it has a characteristic ID
        //             });

        //             // Create a new JSON model with the filtered data
        //             var oCharacteristicValuesModel = new sap.ui.model.json.JSONModel({ value: aCharacteristicValues });

        //             // Set the new model to the view with a specific name
        //             this.getView().setModel(oCharacteristicValuesModel, "CHARACTERISTICSVALUE");
        //         }.bind(this),
        //         error: function (oError) {
        //             console.error("Error fetching Characteristic Values:", oError.message);
        //         }
        //     });
        // },
        //        // Method to load product class  into a separate model
        //         _loadProductClass: function () {
        //             var oModel = this.getOwnerComponent().getModel("productclassmodel");

        //               oModel.read("/PRODUCTCLASS", {
        //               success: function (oData) {
        //            // Extract only the PRODUCTCLASS data
        //            var aProductClass = oData.results.filter(function(item) {
        //                return item.productID_productID; // Ensure it has a product ID
        //            });

        //            // Create a new JSON model with the filtered data
        //            var oProductClassModel = new sap.ui.model.json.JSONModel({ value: aProductClass });

        //            // Set the new model to the view with a specific name
        //            this.getView().setModel(oProductClassModel, "PRODUCTCLASS");
        //        }.bind(this),
        //        error: function (oError) {
        //            console.error("Error fetching Characteristic Values:", oError.message);
        //        }
        //    });
        // },




        //  ------------------ start of create operations-----------------------------

      
      
      
      
      
        onSaveClasses: function () { //-----------create class and fragment (with fragment)------------------
            var oView = this.getView();
            var oModel = oView.getModel();
            // var sClassID = oView.byId("classIdInput").getValue();
            // var sClassName = oView.byId("classNameInput").getValue();
            // Use Fragment.byId to get input fields inside the fragment
                var sClassID = Fragment.byId("ClassInputFragment", "classIdInput").getValue();
                var sClassName = Fragment.byId("ClassInputFragment", "classNameInput").getValue();

            if (!sClassID || !sClassName) {
                MessageToast.show("Please enter Class ID and Class Name");
                return;
            }

            // Check for existing classes
            oModel.read("/CLASS", {
                success: function (oData) {
                    var aExistingClasses = oData.results || [];
                    var bDuplicateID = aExistingClasses.some(function (oClass) {
                        return oClass.classID === sClassID;
                    });

                    if (bDuplicateID) {
                        MessageToast.show("Class ID already exists. Please choose a different ID.");
                        return;
                    }

                    // Create the new class
                    var oClass = {
                        classID: sClassID,
                        className: sClassName
                    };

                    oModel.create("/CLASS", oClass, {
                        success: function () {
                            MessageToast.show("Class created successfully");
                            oModel.refresh(); // Refresh model to update the table

                            // Close the fragment dialog
                            this._pDialog.then(function (oDialog) {
                                oDialog.close();


                                // Reset the input fields after closing
                                this._resetClassForm();
                            }.bind(this));
                        }.bind(this),
                        error: function (oError) {
                            // Handle OData error
                            var oErrorResponse = JSON.parse(oError.responseText);
                            var sErrorMessage = oErrorResponse.error.message.value;

                            if (sErrorMessage === "Entity already exists") {
                                MessageToast.show("Class ID already exists. Please choose a different ID.");
                            } else {
                                MessageToast.show("Error creating Class. Check the console for details.");
                            }
                            console.error("Error creating Class:", oError);
                        }
                    });
                }.bind(this), // Ensure 'this' is correctly bound
                error: function (oError) {
                    // Handle error in fetching existing classes
                    MessageToast.show("Error fetching existing classes data");
                    console.error("Error fetching existing classes data:", oError);
                }
            });
        },

        //-------- Create Class open fragment-------
        onCreateClass: function () {
            if (!this._pDialog) {
                this._pDialog = Fragment.load({
                    id: 'ClassInputFragment',
                    name: "com.productclassdatamaintenanceapplication.fragments.ClassInputFragment",
                    controller: this
                }).then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    return oDialog;
                }.bind(this));
            }
            this._pDialog.then(function (oDialog) {
                oDialog.open();
            });
        },
        //  --------craete class close fragnment-------
        onCancelClassDialog: function () {
            // Close the dialog
            this._pDialog.then(function (oDialog) {
                oDialog.close();
                // Reset the input fields after closing
                this._resetClassForm();
                // Ensure busy state is reset
                this.getView().setBusy(false);
            }.bind(this)); // Ensure 'this' is correctly bound
        },

        _resetClassForm: function () { //----------reset class dialog----------
            // var oView = this.getView();
            // oView.byId("classIdInput").setValue("");
            // oView.byId("classNameInput").setValue("");
            // Use Fragment.byId to reset the form inputs inside the fragment
            Fragment.byId("ClassInputFragment", "classIdInput").setValue("");
            Fragment.byId("ClassInputFragment", "classNameInput").setValue("");
        },
         // ----------------Create Class  without fragmnet----------------------------

        // onSaveClasses: function () {
        //     var oView = this.getView();
        //     var oModel = oView.getModel();
        //     var sClassID = oView.byId("classIdInput").getValue();
        //     var sClassName = oView.byId("classNameInput").getValue();

        //     if (!sClassID || !sClassName) {
        //         MessageToast.show("Please enter Class ID and Class Name");
        //         return;
        //     }

        //     var oClass = {
        //         classID: sClassID,
        //         className: sClassName
        //     };

        //     oModel.create("/CLASS", oClass, {
        //         success: function () {
        //             MessageToast.show("Class created successfully");
        //             oModel.refresh(); // Refresh model to update the table

        //         },
        //         error: function () {
        //             MessageToast.show("Error creating Class");
        //         }
        //     });
        // },

        // ----------create class with fragmnet-------------------------

        // onSaveClasses: function () {
        //     var oView = this.getView();
        //     var oModel = oView.getModel();
        //     var sClassID = oView.byId("classIdInput").getValue();
        //     var sClassName = oView.byId("classNameInput").getValue();

        //     if (!sClassID || !sClassName) {
        //         MessageToast.show("Please enter Class ID and Class Name");
        //         return;
        //     }

        //     var oClass = {
        //         classID: sClassID,
        //         className: sClassName
        //     };

        //     oModel.create("/CLASS", oClass, {
        //         success: function () {
        //             MessageToast.show("Class created successfully");
        //             oModel.refresh(); // Refresh model to update the table

        //             // Close the fragment dialog
        //             this._pDialog.then(function (oDialog) {
        //                 oDialog.close();
        //                 // Reset the input fields after closing
        //                 this._resetClassForm();
        //             }.bind(this)); // Ensure 'this' is correctly bound
        //         }.bind(this), // Bind 'this' to the success callback
        //         error: function () {
        //             MessageToast.show("Error creating Class");
        //         }
        //     });
        // },







        // -----------ending of create class and frgamnet---------------


       




        

        onSaveProducts: function () {   //// -------------craete product with fragmnet-------------
            var oView = this.getView();
            var oModel = oView.getModel();
            // var sProductID = oView.byId("productIdInput").getValue();
            // var sProductName = oView.byId("productNameInput").getValue();
            // var sType = oView.byId("productTypeInput").getValue();
                var sProductID = Fragment.byId("ProductInputFragment", "productIdInput").getValue();
                var sProductName = Fragment.byId("ProductInputFragment", "productNameInput").getValue();
                var sType = Fragment.byId("ProductInputFragment", "productTypeInput").getValue();

            if (!sProductID || !sProductName || !sType) {
                MessageToast.show("Please enter Product ID, Product Name and Type");
                return;
            }

            // Check for existing products
            oModel.read("/PRODUCT", {
                success: function (oData) {
                    var aExistingProducts = oData.results || [];
                    var bDuplicateID = aExistingProducts.some(function (oProduct) {
                        return oProduct.productID === sProductID;
                    });

                    if (bDuplicateID) {
                        MessageToast.show("Product ID already exists. Please choose a different ID.");
                        return;
                    }

                    // Create the new product
                    var oProduct = {
                        productID: sProductID,
                        productName: sProductName,
                        type: sType
                    };

                    oModel.create("/PRODUCT", oProduct, {
                        success: function () {
                            MessageToast.show("Product created successfully");
                            oModel.refresh(); // Refresh model to update the table

                            // Close the fragment dialog
                            this._oProductFragment.then(function (oDialog) {
                                oDialog.close();
                                this._resetProductForm();
                            }.bind(this));
                        }.bind(this),
                        error: function (oError) {
                            MessageToast.show("Error creating Product. Check the console for details.");
                            console.error("Error creating Product:", oError);
                        }
                    });
                }.bind(this),
                error: function (oError) {
                    MessageToast.show("Error fetching existing products data");
                    console.error("Error fetching existing products data:", oError);
                }
            });
        },
        //  --------create product fragment open---------------
        onCreateProduct: function () {
            if (!this._oProductFragment) {
                this._oProductFragment = Fragment.load({
                    id: 'ProductInputFragment',
                    name: "com.productclassdatamaintenanceapplication.fragments.ProductInputFragment",
                    controller: this
                }).then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    return oDialog;
                }.bind(this));
            }
            this._oProductFragment.then(function (oDialog) {
                oDialog.open();
            });
        },
        // ---------craete product fragmnet close------------
        onCancelProductDialog: function () {
            this._oProductFragment.then(function (oDialog) {
                oDialog.close();
                this._resetProductForm();
                this.getView().setBusy(false);
            }.bind(this));
        },
        // -----create product reset dialog----------
        _resetProductForm: function () {
            // var oView = this.getView();
            // oView.byId("productIdInput").setValue("");
            // oView.byId("productNameInput").setValue("");
            // oView.byId("productTypeInput").setValue("");

           Fragment.byId("ProductInputFragment", "productIdInput").setValue("");
           Fragment.byId("ProductInputFragment", "productNameInput").setValue("");
           Fragment.byId("ProductInputFragment", "productTypeInput").setValue("");

        },

        //-------- Create Product without fragmnet--------

        // onSaveProducts: function () {
        //     var oView = this.getView();
        //     var oModel = oView.getModel();
        //     var sProductID = oView.byId("productIdInput").getValue();
        //     var sProductName = oView.byId("productNameInput").getValue();
        //     var sType = oView.byId("productTypeInput").getValue();

        //     if (!sProductID || !sProductName || !sType) {
        //         MessageToast.show("Please enter Product ID, Product Name and Type");
        //         return;
        //     }

        //     var oProduct = {
        //         productID: sProductID,
        //         productName: sProductName,
        //         type: sType
        //     };

        //     oModel.create("/PRODUCT", oProduct, {
        //         success: function () {
        //             MessageToast.show("Product created successfully");
        //             oModel.refresh(); // Refresh model to update the table
        //         },
        //         error: function () {
        //             MessageToast.show("Error creating Product");
        //         }
        //     });
        // },

        // ------------------end of create product and fragmnet-------------------------








        onSaveCharacteristics: function () {       //------- charectiristics create and fragment (charecetricts craete with fragment)-----------------
            var oView = this.getView();
            var oModel = oView.getModel();
            // var sCharacteristicID = oView.byId("characteristicIdInput").getValue();
            // var sClassID = oView.byId("characteristicClassIdInput").getValue();
            // var sCharacteristicName = oView.byId("characteristicNameInput").getValue();

                var sCharacteristicID = Fragment.byId("charecetricsInputDialog", "characteristicIdInput").getValue();
                var sClassID = Fragment.byId("charecetricsInputDialog", "characteristicClassIdInput").getValue();
                var sCharacteristicName = Fragment.byId("charecetricsInputDialog", "characteristicNameInput").getValue();

            if (!sCharacteristicID || !sCharacteristicName || !sClassID) {
                MessageToast.show("Please enter valid Characteristic ID, Class ID, and Characteristic Name");
                return;
            }

            // Check for existing characteristics
            oModel.read("/CHARACTERISTICS", {
                success: function (oData) {
                    var aExistingCharacteristics = oData.results || [];
                    var bDuplicateID = aExistingCharacteristics.some(function (oCharacteristic) {
                        return oCharacteristic.characteristicID === sCharacteristicID;
                    });

                    if (bDuplicateID) {
                        MessageToast.show("Characteristic ID already exists. Please choose a different ID.");
                        return;
                    }

                    // Create the new characteristic
                    var oCharacteristic = {
                        characteristicID: sCharacteristicID,
                        classID_classID: sClassID,
                        characteristicName: sCharacteristicName
                    };

                    oModel.create("/CHARACTERISTICS", oCharacteristic, {
                        success: function () {
                            MessageToast.show("Characteristic created successfully");
                            oModel.refresh();

                            // Close the fragment dialog
                            this._oCharacteristicFragment.then(function (oDialog) {
                                oDialog.close();
                                this._resetCharacteristicForm();
                            }.bind(this));
                        }.bind(this),
                        error: function (oError) {
                            MessageToast.show("Error creating Characteristic. Check the console for details.");
                            console.error("Error creating Characteristic:", oError);
                        }
                    });
                }.bind(this),
                error: function (oError) {
                    MessageToast.show("Error fetching existing characteristics data");
                    console.error("Error fetching existing characteristics data:", oError);
                }
            });
        },

        onCreateCharacteristic: function () {            //   ----------chracteristics fragment open-----------
            if (!this._oCharacteristicFragment) {
                this._oCharacteristicFragment = Fragment.load({
                    id: 'charecetricsInputDialog',
                    name: "com.productclassdatamaintenanceapplication.fragments.CharecteristicsInputFragmnet",
                    controller: this
                }).then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    oDialog.open();
                    return oDialog;
                }.bind(this));
            }
            this._oCharacteristicFragment.then(function (oDialog) {
                oDialog.open();
            });
        },

        onCancelChareectcisDialog: function () {
            // Close the dialog
            this._oCharacteristicFragment.then(function (oDialog) {
                oDialog.close();
                // Reset the input fields after closing
                this._resetCharacteristicForm();
                // Ensure busy state is reset
                this.getView().setBusy(false);
            }.bind(this)); // Ensure 'this' is correctly bound
        },

        _resetCharacteristicForm: function () {  //--------reset charecteristics dialog-------------
            // var oView = this.getView();
            // oView.byId("characteristicIdInput").setValue("");
            // oView.byId("characteristicClassIdInput").setValue("");
            // oView.byId("characteristicNameInput").setValue("");

            Fragment.byId("charecetricsInputDialog", "characteristicIdInput").setValue("");
            Fragment.byId("charecetricsInputDialog", "characteristicClassIdInput").setValue("");
            Fragment.byId("charecetricsInputDialog", "characteristicNameInput").setValue("");
        },

        // ------------- Create Characteristic without fragment-------------------
        //         onSaveCharacteristics: function () {
        //             var oView = this.getView();
        //             var oModel = oView.getModel();
        //             var sCharacteristicID = oView.byId("characteristicIdInput").getValue();
        //             var sClassID = oView.byId("characteristicClassIdInput").getValue();
        //             var sCharacteristicName = oView.byId("characteristicNameInput").getValue();

        //             // Convert IDs to integers
        //             var iCharacteristicID = parseInt(sCharacteristicID, 10);
        //             var iClassID = parseInt(sClassID, 10);

        //             // // Debugging logs
        //             // console.log("Characteristic ID (integer):", iCharacteristicID);
        //             // console.log("Class ID (integer):", iClassID);
        //             // console.log("Characteristic Name:", sCharacteristicName);

        //             if (isNaN(iCharacteristicID) || isNaN(iClassID) || !sCharacteristicName) {
        //                 sap.m.MessageToast.show("Please enter valid Characteristic ID, Class ID, and Characteristic Name");
        //                 return;
        //             }

        //             // Create the payload based on the expected backend structure
        //             var oCharacteristic = {
        //                 characteristicID: iCharacteristicID,
        //                 classID_classID: iClassID,
        //                 characteristicName: sCharacteristicName
        //             };

        //             // console.log("Data being sent:", oCharacteristic); // Log data being sent

        //             oModel.create("/CHARACTERISTICS", oCharacteristic, {
        //                 success: function () {
        //                     sap.m.MessageToast.show("Characteristic created successfully");
        //                     oModel.refresh(); // Refresh model to update the table
        //                 },
        //                 error: function (oError) {
        //                     console.error("Error creating Characteristic:", oError); // Log error
        //                     sap.m.MessageToast.show("Error creating Characteristic");
        //                 }
        //             });
        //         },









        onSaveCharacteristicValues: function () { //------------create charecteristics value and fragmnet----------------
            var oView = this.getView();
            var oModel = oView.getModel();
        //    var sCharacteristicValueID = oView.byId("characteristicValueIdInput").getValue();
        //     var sValue = oView.byId("characteristicValueInput").getValue();
        //     var sValueDescription = oView.byId("characteristicValueDesInput").getValue();
        //     var sCharacteristicID = oView.byId("characteristicsIdInput").getValue();

                var sCharacteristicValueID = Fragment.byId("characterictsValueInputDialog", "characteristicValueIdInput").getValue();
                var sValue = Fragment.byId("characterictsValueInputDialog", "characteristicValueInput").getValue();
                var sValueDescription = Fragment.byId("characterictsValueInputDialog", "characteristicValueDesInput").getValue();
                var sCharacteristicID = Fragment.byId("characterictsValueInputDialog", "characteristicsIdInput").getValue();

            if (!sCharacteristicValueID || !sValue ||! sValueDescription ||!sCharacteristicID) {
                MessageToast.show("Please enter Value ID and Name");
                return;
            }

            // Check for existing values
            oModel.read("/CHARACTERISTICSVALUE", {
                success: function (oData) {
                    var aExistingValues = oData.results || [];
                    var bDuplicateID = aExistingValues.some(function (oValue) {
                        return oValue.characteristicValueID === sCharacteristicValueID;
                    });

                    if (bDuplicateID) {
                        MessageToast.show("Value ID already exists. Please choose a different ID.");
                        return;
                    }

                    // Create the new value
                    var oValue = {
                        characteristicValueID: parseInt(sCharacteristicValueID, 10), // Convert to integer if necessary
                        value: sValue,
                        valueDescription: sValueDescription,
                        characteristicID_characteristicID:parseInt(sCharacteristicID, 10)
                    };

                    oModel.create("/CHARACTERISTICSVALUE", oValue, {
                        success: function () {
                            MessageToast.show("Value created successfully");
                            oModel.refresh();

                            // Close the fragment dialog
                            this._oValueFragment.then(function (oDialog) {
                                oDialog.close();
                                this._resetValueForm();
                            }.bind(this));
                        }.bind(this),
                        error: function (oError) {
                            MessageToast.show("Error creating Value. Check the console for details.");
                            console.error("Error creating Value:", oError);
                        }
                    });
                }.bind(this),
                error: function (oError) {
                    MessageToast.show("Error fetching existing values data");
                    console.error("Error fetching existing values data:", oError);
                }
            });
        },

        onCreateCharacteristicValue: function () { //----------create characteristics value fragment open----------
            if (!this._oValueFragment) {
                this._oValueFragment = Fragment.load({
                    id: 'characterictsValueInputDialog',
                    name: "com.productclassdatamaintenanceapplication.fragments.CharecterictsValueInputFragment",
                    controller: this
                }).then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    return oDialog;
                }.bind(this));
            }
            this._oValueFragment.then(function (oDialog) {
                oDialog.open();
            });
        },

        onCancelChareectcisValueDialog: function () { //----------create charectericts value fragment close------
            this._oValueFragment.then(function (oDialog) {
                oDialog.close();
                this._resetValueForm();
                this.getView().setBusy(false);
            }.bind(this));
        },

        _resetValueForm: function () { //---------reset charectericts value dialog-----------
            // var oView = this.getView();
            // oView.byId("characteristicValueIdInput").setValue("");
            // oView.byId("characteristicValueInput").setValue("");
            // oView.byId("characteristicValueDesInput").setValue("");
            // oView.byId("characteristicsIdInput").setValue("");
             Fragment.byId("characterictsValueInputDialog", "characteristicValueIdInput").setValue("");
                Fragment.byId("characterictsValueInputDialog", "characteristicValueInput").setValue("");
              Fragment.byId("characterictsValueInputDialog", "characteristicValueDesInput").setValue("");
                Fragment.byId("characterictsValueInputDialog", "characteristicsIdInput").setValue("");
            

        },

        //-------------Create Characteristic Value without fragment--------

        //             onSaveCharacteristicValues: function () {
        //             var oView = this.getView();
        //             var oModel = oView.getModel();

        //     // Fetch values from the input fields
        //     var sCharacteristicValueID = oView.byId("characteristicValueIdInput").getValue();
        //     var sValue = oView.byId("characteristicValueInput").getValue();
        //     var sValueDescription = oView.byId("characteristicValueDesInput").getValue();
        //     var sCharacteristicID = oView.byId("characteristicsIdInput").getValue();
        //     // Validate the input values
        //     if (!sCharacteristicValueID || !sValue || !sValueDescription ||!sCharacteristicID) {
        //         sap.m.MessageToast.show("Please enter Characteristic ID, Value, Characteristic Value ID and Value Description");
        //         return;
        //     }

        //     // Construct the data object with correct property names
        //     var oCharacteristicValue = {
        //         characteristicValueID: parseInt(sCharacteristicValueID, 10), // Convert to integer if necessary
        //         value: sValue,
        //         valueDescription: sValueDescription,
        //         characteristicID_characteristicID:parseInt(sCharacteristicID, 10)

        //     };

        //     // Use the correct entity set path
        //     oModel.create("/CHARACTERISTICSVALUE", oCharacteristicValue, {
        //         success: function () {
        //             sap.m.MessageToast.show("Characteristic Value created successfully");
        //             oModel.refresh(); // Refresh model to update the table
        //         },
        //         error: function (oError) {
        //             console.error("Error creating Characteristic Value:", oError);
        //             sap.m.MessageToast.show("Error creating Characteristic Value");
        //         }
        //     });
        // },








        onSaveProductClassIds: function () { //-----------create product class and fragmnet (create product class with fragment)----------
            var oView = this.getView();
            var oModel = oView.getModel();
        //    var sProductClassID = oView.byId("productsClassIdInput").getValue();
        //     var sClassID = oView.byId("classProductIdInput").getValue();
        //     var sProductID = oView.byId("productClassIdInput").getValue();
                var sProductClassID = Fragment.byId("productClassInputDialog", "productsClassIdInput").getValue();
                var sClassID = Fragment.byId("productClassInputDialog", "classProductIdInput").getValue();
                var sProductID = Fragment.byId("productClassInputDialog", "productClassIdInput").getValue();
                
        
            if (!sProductClassID || !sClassID ||!sProductID ) {
                MessageToast.show("Please enter Product Class ID and Name");
                return;
            }
        
            // Check for existing Product Classes
            oModel.read("/PRODUCTCLASS", {
                success: function (oData) {
                    var aExistingProductClasses = oData.results || [];
                    var bDuplicateID = aExistingProductClasses.some(function (oProductClass) {
                        return oProductClass.productClassID === sProductClassID;
                    });
        
                    if (bDuplicateID) {
                        MessageToast.show("Product Class ID already exists. Please choose a different ID.");
                        return;
                    }
        
                    // Create the new Product Class
                    var oProductClass = {
                        productClassID: parseInt(sProductClassID, 10),
                        classID_classID: parseInt(sClassID, 10) ,
                        productID_productID: parseInt(sProductID, 10) 
                    };
        
                    oModel.create("/PRODUCTCLASS", oProductClass, {
                        success: function () {
                            MessageToast.show("Product Class created successfully");
                            oModel.refresh(); // Refresh model to update the table
        
                            // Close the fragment dialog
                            this._oProductClassFragment.then(function (oDialog) {
                                oDialog.close();
                                this._resetProductClassForm();
                            }.bind(this));
                        }.bind(this),
                        error: function (oError) {
                            MessageToast.show("Error creating Product Class. Check the console for details.");
                            console.error("Error creating Product Class:", oError);
                        }
                    });
                }.bind(this),
                error: function (oError) {
                    MessageToast.show("Error fetching existing Product Classes data");
                    console.error("Error fetching existing Product Classes data:", oError);
                }
            });
        },
        
        onCreateProductClass: function () { //--------product class fragemnt open----------
            if (!this._oProductClassFragment) {
                this._oProductClassFragment = Fragment.load({
                    id: 'productClassInputDialog',
                    name: "com.productclassdatamaintenanceapplication.fragments.ProductClassInputFragment",
                    controller: this
                }).then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    return oDialog;
                }.bind(this));
            }
            this._oProductClassFragment.then(function (oDialog) {
                oDialog.open();
            });
        },
        
        onCancelProductClassDialog: function () { //-----product class fragment close-----
            this._oProductClassFragment.then(function (oDialog) {
                oDialog.close();
                this._resetProductClassForm();
                this.getView().setBusy(false);
            }.bind(this));
        },
        
        _resetProductClassForm: function () {     //-----reset productclass dialog-----------
            // var oView = this.getView();
            // oView.byId("productsClassIdInput").setValue("");
            // oView.byId("classProductIdInput").setValue("");
            // oView.byId("productClassIdInput").setValue("");
               Fragment.byId("productClassInputDialog", "productsClassIdInput").setValue("");
                Fragment.byId("productClassInputDialog", "classProductIdInput").setValue("");
                Fragment.byId("productClassInputDialog", "productClassIdInput").setValue("");
        },

        //---------------------- Create Product Class without fragmnet-------------


        //        onSaveProductClassIds: function () {
        //         var oView = this.getView();
        //         var oModel = oView.getModel();

        //     // Retrieve values from input fields
        //     var sProductClassID = oView.byId("productsClassIdInput").getValue();
        //     var sClassID = oView.byId("classProductIdInput").getValue();
        //     var sProductID = oView.byId("productClassIdInput").getValue();

        //     // Validate inputs
        //     if (!sProductClassID||!sProductID || !sClassID) {
        //         sap.m.MessageToast.show("Please enter Product Class ID ,Product ID and Class ID");
        //         return;
        //     }

        //     // Construct object with correct property names
        //     var oProductClass = {
        //         productClassID: parseInt(sProductClassID, 10),
        //         classID_classID: parseInt(sClassID, 10) ,
        //         productID_productID: parseInt(sProductID, 10)     
        //     };

        //     // Perform OData create operation
        //     oModel.create("/PRODUCTCLASS", oProductClass, {
        //         success: function () {
        //             sap.m.MessageToast.show("Product Class created successfully");
        //             oModel.refresh(); // Refresh model to update the table
        //         },
        //         error: function (oError) {
        //             console.error("Error creating Product Class:", oError);
        //             sap.m.MessageToast.show("Error creating Product Class");
        //         }
        //     });
        // },





        // ---------------sstart of delete functionality---------------------

        onDeleteClass: function(oEvent) {
            var oSource = oEvent.getSource();
            var oContext = oSource.getBindingContext();
            var classID = oContext.getProperty("classID");
        
            var oModel = this.getView().getModel('productclassmodel');
            
            // Enable batch processing
            oModel.setUseBatch(true);
            oModel.setDeferredGroups(["deletionGroup"]);
        
            sap.m.MessageBox.confirm("Are you sure you want to delete Class ID: " + classID + "?", {
                title: "Confirm Deletion",
                onClose: function(oAction) {
                    if (oAction === sap.m.MessageBox.Action.OK) {
                        
                        // Fetch CHARACTERISTICS entities
                        oModel.read("/CHARACTERISTICS", {
                            success: function(oData) {
                                if (!oData || !oData.results) {
                                    console.error("No data returned from CHARACTERISTICS service.");
                                    return;
                                }
        
                                var aCharacteristics = oData.results.filter(function(item) {
                                    return item.classID_classID === classID;
                                });
        
                                var aCharacteristicIDs = aCharacteristics.map(function(item) {
                                    return item.characteristicID;
                                });
        
                                // Fetch CHARACTERISTIC_VALUE entities
                                oModel.read("/CHARACTERISTICSVALUE", {
                                    success: function(oData) {
                                        if (!oData || !oData.results) {
                                            console.error("No data returned from CHARACTERISTIC_VALUE service.");
                                            return;
                                        }
        
                                        var aCharacteristicValues = oData.results.filter(function(item) {
                                            return aCharacteristicIDs.includes(item.characteristicID_characteristicID);
                                        });
        
                                        // Add delete operations for CHARACTERISTIC_VALUE to batch
                                        aCharacteristicValues.forEach(function(item) {
                                            oModel.remove("/CHARACTERISTICSVALUE(" + item.characteristicValueID + ")", {
                                                groupId: "deletionGroup"
                                            });
                                        });
        
                                        // Add delete operations for CHARACTERISTICS to batch
                                        aCharacteristics.forEach(function(item) {
                                            oModel.remove("/CHARACTERISTICS(" + item.characteristicID + ")", {
                                                groupId: "deletionGroup"
                                            });
                                        });
        
                                        // Fetch PRODUCTCLASS entities
                                        oModel.read("/PRODUCTCLASS", {
                                            success: function(oData) {
                                                if (!oData || !oData.results) {
                                                    console.error("No data returned from PRODUCTCLASS service.");
                                                    return;
                                                }
        
                                                var aProductClasses = oData.results.filter(function(item) {
                                                    return item.classID_classID === classID;
                                                });
        
                                                var aProductIDs = aProductClasses.map(function(item) {
                                                    return item.productID_productID;
                                                });
        
                                                // Add delete operations for PRODUCTCLASS to batch
                                                aProductClasses.forEach(function(item) {
                                                    oModel.remove("/PRODUCTCLASS(" + item.productClassID + ")", {
                                                        groupId: "deletionGroup"
                                                    });
                                                });
        
                                                // Fetch PRODUCT entities
                                                oModel.read("/PRODUCT", {
                                                    success: function(oData) {
                                                        if (!oData || !oData.results) {
                                                            console.error("No data returned from PRODUCT service.");
                                                            return;
                                                        }
        
                                                        var aProducts = oData.results.filter(function(item) {
                                                            return aProductIDs.includes(item.productID);
                                                        });
        
                                                        // Add delete operations for PRODUCT to batch
                                                        aProducts.forEach(function(item) {
                                                            oModel.remove("/PRODUCT(" + item.productID + ")", {
                                                                groupId: "deletionGroup"
                                                            });
                                                        });
        
                                                        // After deleting all related records, delete the Class entity
                                                        oModel.remove("/CLASS(" + classID + ")", {
                                                            groupId: "deletionGroup"
                                                        });
        
                                                        // Submit the batch request
                                                        oModel.submitChanges({
                                                            groupId: "deletionGroup",
                                                            success: function(oData) {
                                                                console.log("Batch delete successful:", oData);
                                                                sap.m.MessageToast.show("Records and class deleted successfully.");
                                                                oModel.refresh(true);
                                                            },
                                                            error: function(oError) {
                                                                console.error("Batch delete failed:", oError);
                                                                sap.m.MessageToast.show("Failed to delete some records.");
                                                            }
                                                        });
                                                    },
                                                    error: function() {
                                                        sap.m.MessageToast.show("Failed to fetch PRODUCT entities.");
                                                    }
                                                });
                                            },
                                            error: function() {
                                                sap.m.MessageToast.show("Failed to fetch PRODUCTCLASS entities.");
                                            }
                                        });
                                    },
                                    error: function() {
                                        sap.m.MessageToast.show("Failed to fetch CHARACTERISTIC_VALUE entities.");
                                    }
                                });
                            },
                            error: function() {
                                sap.m.MessageToast.show("Failed to fetch CHARACTERISTICS entities.");
                            }
                        });
                    }
                }.bind(this)
            });
        }
        
        
        ,
        
        
        
        
        
        
        
        
        
        

       
        // onDeleteClass: function (oEvent) {   //  ---delete functionality for class-----------
        //     var oButton = oEvent.getSource();
        //     var oTable = oButton.getParent().getParent(); // Assuming the delete button is inside a row in the table
        //     var oItem = oTable.getBindingContext().getObject(); // Get the item bound to the row
        //     var oModel = this.getOwnerComponent().getModel("productclassmodel");
        //     var sPath = "/CLASS(" + oItem.classID + ")"; // Adjust to your entity's path

        //     sap.m.MessageBox.confirm("Are you sure you want to delete this class?", {
        //         actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
        //         onClose: function (sAction) {
        //             if (sAction === sap.m.MessageBox.Action.OK) {
        //                 oModel.remove(sPath, {
        //                     success: function () {
        //                         sap.m.MessageToast.show("Class deleted successfully!");
        //                         // this.loadData(); // Reload data
        //                         oModel.refresh(true);
        //                     }.bind(this),
        //                     error: function (error) {
        //                         sap.m.MessageBox.error("Error while deleting class: " + error.message);
        //                     }
        //                 });
        //             }
        //         }.bind(this)
        //     });
        // },


        // ------delete functionality for product--------

        onDeleteProduct: function (oEvent) {
            var oButton = oEvent.getSource();
            var oTable = oButton.getParent().getParent(); // Assuming the delete button is inside a row in the table
            var oItem = oTable.getBindingContext().getObject(); // Get the item bound to the row
            var oModel = this.getOwnerComponent().getModel("productclassmodel");
            var sPath = "/PRODUCT(" + oItem.productID + ")"; // Adjust to your entity's path

            sap.m.MessageBox.confirm("Are you sure you want to delete this Product?", {
                actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                onClose: function (sAction) {
                    if (sAction === sap.m.MessageBox.Action.OK) {
                        oModel.remove(sPath, {
                            success: function () {
                                sap.m.MessageToast.show("Product deleted successfully!");
                                // this.loadData(); // Reload data
                                oModel.refresh(true);
                            }.bind(this),
                            error: function (error) {
                                sap.m.MessageBox.error("Error while deleting product: " + error.message);
                            }
                        });
                    }
                }.bind(this)
            });

        },

        // -------delete fucntionality for characteristic----

        onDeleteCharacteristic: function (oEvent) {
            var oButton = oEvent.getSource();
            var oTable = oButton.getParent().getParent(); // Adjust based on your table structure
            var oItem = oTable.getBindingContext().getObject(); // Get the characteristic object
            var oModel = this.getOwnerComponent().getModel("productclassmodel");
            var sPath = "/CHARACTERISTICS(" + oItem.characteristicID + ")";

            sap.m.MessageBox.confirm("Are you sure you want to delete this characteristic?", {
                actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                onClose: function (sAction) {
                    if (sAction === sap.m.MessageBox.Action.OK) {
                        oModel.remove(sPath, {
                            success: function () {
                                sap.m.MessageToast.show("Characteristic deleted successfully!");
                                // this.loadData(); // Reload data
                                oModel.refresh(true);
                            }.bind(this),
                            error: function (error) {
                                sap.m.MessageBox.error("Error while deleting characteristic: " + error.message);
                            }
                        });
                    }
                }.bind(this)
            });
        },



        // ------delte fucntionality for characteristic value------
        onDeleteCharacteristicValue: function (oEvent) {
            var oButton = oEvent.getSource();
            var oTable = oButton.getParent().getParent(); // Adjust based on your table structure
            var oItem = oTable.getBindingContext().getObject(); // Get the characteristic object
            var oModel = this.getOwnerComponent().getModel("productclassmodel");
            var sPath = "/CHARACTERISTICSVALUE(" + oItem.characteristicValueID + ")";

            sap.m.MessageBox.confirm("Are you sure you want to delete this characteristicvalue?", {
                actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                onClose: function (sAction) {
                    if (sAction === sap.m.MessageBox.Action.OK) {
                        oModel.remove(sPath, {
                            success: function () {
                                sap.m.MessageToast.show("Characteristicvalue deleted successfully!");
                                // this.loadData(); // Reload data
                                oModel.refresh(true);
                            }.bind(this),
                            error: function (error) {
                                sap.m.MessageBox.error("Error while deleting characteristicvalue: " + error.message);
                            }
                        });
                    }
                }.bind(this)
            });
        },


        // ------delete fucntionality for product class-----
        onDeleteProductClass: function (oEvent) {
            var oButton = oEvent.getSource();
            var oTable = oButton.getParent().getParent(); // Adjust based on your table structure
            var oItem = oTable.getBindingContext().getObject(); // Get the characteristic object
            var oModel = this.getOwnerComponent().getModel("productclassmodel");
            var sPath = "/PRODUCTCLASS(" + oItem.productClassID + ")";

            sap.m.MessageBox.confirm("Are you sure you want to delete this productclass?", {
                actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                onClose: function (sAction) {
                    if (sAction === sap.m.MessageBox.Action.OK) {
                        oModel.remove(sPath, {
                            success: function () {
                                sap.m.MessageToast.show("productclass deleted successfully!");
                                // this.loadData(); // Reload data
                                oModel.refresh(true);
                            }.bind(this),
                            error: function (error) {
                                sap.m.MessageBox.error("Error while deleting productclass: " + error.message);
                            }
                        });
                    }
                }.bind(this)
            });
        },

        // ----------delete funtionality end-------------












        // -----------update fuunctionality start------------

        // -------class update fucnctionality--------------
         
       
        onEditClass: function (oEvent) { //------class edit (with fragemnt)
            var oView = this.getView();
            var oModel = oView.getModel();
            var oContext = oEvent.getSource().getBindingContext(); // Get the selected row's context
            
            var sClassID = oContext.getProperty("classID");
            
            oModel.read("/CLASS(" + sClassID + ")", {
                success: function (oData) {
                    if (!this._classUpdateDialog) {
                        this._classUpdateDialog = Fragment.load({
                            id: 'classEditDialog',
                            name: "com.productclassdatamaintenanceapplication.updateFragments.ClassUpdateFragment",
                            controller: this
                        }).then(function (oDialog) {
                            this._classUpdateDialog = Promise.resolve(oDialog); 
                            oView.addDependent(oDialog);
                            oDialog.open();
                            this._setDialogData(oDialog, oData); // Set data when dialog is first loaded
                        }.bind(this));
                    } else {
                        this._classUpdateDialog.then(function (oDialog) {
                            this._setDialogData(oDialog, oData);
                            oDialog.open(); // Open the dialog for update
                        }.bind(this));
                    }
                }.bind(this),
                error: function (oError) {
                    MessageToast.show("Error fetching Class data");
                    console.error("Error fetching Class data:", oError);
                }
            });
        },
        
        _setDialogData: function (oDialog, oData) {
            Fragment.byId("classEditDialog", "classIdEditInput").setValue(oData.classID);
            Fragment.byId("classEditDialog", "classNameEditInput").setValue(oData.className);
            Fragment.byId("classEditDialog", "classIdEditInput").setEnabled(false);
        },

        onUpdateClass: function () {
            var oDialog = this._classUpdateDialog;
        
            if (!oDialog) {
                MessageToast.show("Dialog is not available.");
                return;
            }
        
            oDialog.then(function (dialog) {
                var sClassID =  Fragment.byId("classEditDialog", "classIdEditInput").getValue();
                var sClassName = Fragment.byId("classEditDialog", "classNameEditInput").getValue();
        
                if (!sClassID || !sClassName) {
                    MessageToast.show("Please enter all required fields.");
                    return;
                }
        
                var oUpdatedClass = {
                    classID: parseInt(sClassID, 10),
                    className: sClassName
                };
        
                var oModel = this.getView().getModel();
        
                oModel.update("/CLASS(" + sClassID + ")", oUpdatedClass, {
                    success: function () {
                        MessageToast.show("Class updated successfully");
                        oModel.refresh();
                        dialog.close();
                        
                        // this._classUpdateDialog.destroy();
                    }.bind(this),
                    error: function (oError) {
                        MessageToast.show("Error updating Class. Check the console for details.");
                        console.error("Error updating Class:", oError);
                    }
                });
            }.bind(this));
        },
        
        onCancelClassUpdateDialog: function () {
            var oDialog = this._classUpdateDialog;
        
            if (!oDialog) {
                MessageToast.show("Dialog is not available.");
                return;
            }
        
            oDialog.then(function (dialog) {
                dialog.close();
                // this._classUpdateDialog.destroy(); 
            }.bind(this));
        },

        // onEditClass: function (oEvent) { //---------editclass (without fragmnet)---------
        //     // Get the selected item
        //     var oSelectedItem = oEvent.getSource().getParent().getParent();
        //     var oContext = oSelectedItem.getBindingContext();

        //     // Get data from selected item
        //     var oData = oContext.getObject();

        //     // Set data to input fields
        //     this.byId("editClassIdInput").setValue(oData.classID);
        //     this.byId("editClassNameInput").setValue(oData.className);

        //     // Switch to edit mode
        //     this._oTable.setVisible(false);
        //     this._oEditContainer.setVisible(true);
        // },

        // onSaveClass: function () {
        //     var sClassId = this.byId("editClassIdInput").getValue();
        //     var sClassName = this.byId("editClassNameInput").getValue();

        //     // Assuming you have a reference to your ODataModel
        //     var oModel = this.getView().getModel();

        //     // Create a payload with the updated data
        //     var oPayload = {
        //         classID: sClassId,
        //         className: sClassName
        //     };

        //     // Update data in the OData service
        //     oModel.update("/CLASS(" + sClassId + ")", oPayload, {
        //         success: function () {
        //             MessageToast.show("Class updated successfully.");
        //             this._exitEditMode();
        //         }.bind(this),
        //         error: function () {
        //             MessageToast.show("Error updating class.");
        //         }
        //     });
        // },

        // onCancelEdit: function () {
        //     this._exitClassEditMode();
        // },

        // _exitClassEditMode: function () {
        //     this._oTable.setVisible(true);
        //     this._oEditContainer.setVisible(false);
        // },







        onEditProduct: function (oEvent) { //---product edit (with fragment)
            var oView = this.getView();
            var oModel = oView.getModel();
            var oContext = oEvent.getSource().getBindingContext(); // Get the selected row's context
            
            var sProductID = oContext.getProperty("productID");
            
            oModel.read("/PRODUCT(" + sProductID + ")", {
                success: function (oData) {
                    if (!this._productUpdateDialog) {
                        this._productUpdateDialog = Fragment.load({
                            id: 'productEditDialog',
                            name: "com.productclassdatamaintenanceapplication.updateFragments.productUpdateFragment",
                            controller: this
                        }).then(function (oDialog) {
                            this._productUpdateDialog = Promise.resolve(oDialog); 
                            oView.addDependent(oDialog);
                            oDialog.open();
                            this._setProductDialogData(oDialog, oData); // Set data when dialog is first loaded
                        }.bind(this));
                    } else {
                        this._productUpdateDialog.then(function (oDialog) {
                            this._setProductDialogData(oDialog, oData);
                            oDialog.open(); // Open the dialog for update
                        }.bind(this));
                    }
                }.bind(this),
                error: function (oError) {
                    MessageToast.show("Error fetching Product data");
                    console.error("Error fetching Product data:", oError);
                }
            });
        },
        
        _setProductDialogData: function (oDialog, oData) {
            Fragment.byId("productEditDialog", "productIdUpdateInput").setValue(oData.productID);
            Fragment.byId("productEditDialog", "productNameUpdateInput").setValue(oData.productName);
            Fragment.byId("productEditDialog", "productTypeUpdateInput").setValue(oData.type);
            Fragment.byId("productEditDialog", "productIdUpdateInput").setEnabled(false); // Disable ID field for editing
        },
        
        onSaveUpdateProducts: function () {
            var oDialog = this._productUpdateDialog;
        
            if (!oDialog) {
                MessageToast.show("Dialog is not available.");
                return;
            }
        
            oDialog.then(function (dialog) {
                var sProductID = Fragment.byId("productEditDialog", "productIdUpdateInput").getValue();
                var sProductName = Fragment.byId("productEditDialog", "productNameUpdateInput").getValue();
                var sProductType = Fragment.byId("productEditDialog", "productTypeUpdateInput").getValue();
        
                if (!sProductID || !sProductName || !sProductType) {
                    MessageToast.show("Please enter all required fields.");
                    return;
                }
        
                var oUpdatedProduct = {
                    productID: parseInt(sProductID, 10),
                    productName: sProductName,
                    type: sProductType
                };
        
                var oModel = this.getView().getModel();
        
                oModel.update("/PRODUCT(" + sProductID + ")", oUpdatedProduct, {
                    success: function () {
                        MessageToast.show("Product updated successfully");
                        oModel.refresh();
                        dialog.close();
                    }.bind(this),
                    error: function (oError) {
                        MessageToast.show("Error updating Product. Check the console for details.");
                        console.error("Error updating Product:", oError);
                    }
                });
            }.bind(this));
        },
        
        onCancelUpdateProductDialog: function () {
            var oDialog = this._productUpdateDialog;
        
            if (!oDialog) {
                MessageToast.show("Dialog is not available.");
                return;
            }
        
            oDialog.then(function (dialog) {
                dialog.close();
            }.bind(this));
        },
    
        // onEditProduct: function (oEvent) { //-----product edit (without fragemnt)
        //     // Get the selected item
        //     var oSelectedItem = oEvent.getSource().getParent().getParent();
        //     var oContext = oSelectedItem.getBindingContext();

        //     // Get data from selected item
        //     var oData = oContext.getObject();

        //     // Set data to input fields
        //     this.byId("editProductIdInput").setText(oData.productID); // ID is not editable
        //     this.byId("editProductNameInput").setValue(oData.productName);
        //     this.byId("editTypeInput").setValue(oData.type);

        //     // Switch to edit mode
        //     // this.byId("productTable").setVisible(false);
        //     // this.byId("editProductContainer").setVisible(true);
        //     this._oProductTable.setVisible(false);
        //     this._oEditProductContainer.setVisible(true);

        //     // Store context for later use
        //     this._oEditContext = oContext;
        // },

        // onSaveProduct: function () {
        //     var sProductName = this.byId("editProductNameInput").getValue();
        //     var sProductType = this.byId("editTypeInput").getValue();
        //     var sProductId = this.byId("editProductIdInput").getText(); // ID is read-only

        //     // Create a payload with the updated data
        //     var oPayload = {
        //         productName: sProductName,
        //         type: sProductType
        //     };

        //     // Assuming you have a reference to your ODataModel
        //     var oModel = this.getView().getModel();

        //     // Update data in the OData service
        //     oModel.update("/PRODUCT(" + sProductId + ")", oPayload, {
        //         success: function () {
        //             MessageToast.show("Product updated successfully.");
        //             this._exitEditMode("product");
        //         }.bind(this),
        //         error: function () {
        //             MessageToast.show("Error updating product.");
        //         }
        //     });
        // },

        // onCancelEditProduct: function () {
        //     this._exitProEditMode();
        // },

        // _exitProEditMode: function () {
        //     // this.byId(sEntity + "Table").setVisible(true);
        //     // this.byId("edit" + sEntity.charAt(0).toUpperCase() + sEntity.slice(1) + "Container").setVisible(false);
        //     this._oProductTable.setVisible(true);
        //     this._oEditProductContainer.setVisible(false);
        // },





        onEditCharacteristic: function (oEvent) { //---characteristic edit (with fragment)
            var oView = this.getView();
            var oModel = oView.getModel();
            var oContext = oEvent.getSource().getBindingContext(); // Get the selected row's context
            
            var sCharacteristicID = oContext.getProperty("characteristicID");
            
            oModel.read("/CHARACTERISTICS(" + sCharacteristicID + ")", {
                success: function (oData) {
                    if (!this._characteristicUpdateDialog) {
                        this._characteristicUpdateDialog = Fragment.load({
                            id: 'charecetricsInputUpdateDialog',
                            name: "com.productclassdatamaintenanceapplication.updateFragments.characteristicsUpdateFragmnet",
                            controller: this
                        }).then(function (oDialog) {
                            this._characteristicUpdateDialog = Promise.resolve(oDialog); 
                            oView.addDependent(oDialog);
                            oDialog.open();
                            this._setCharacteristicDialogData(oDialog, oData); // Set data when dialog is first loaded
                        }.bind(this));
                    } else {
                        this._characteristicUpdateDialog.then(function (oDialog) {
                            this._setCharacteristicDialogData(oDialog, oData);
                            oDialog.open(); // Open the dialog for update
                        }.bind(this));
                    }
                }.bind(this),
                error: function (oError) {
                    MessageToast.show("Error fetching Characteristic data");
                    console.error("Error fetching Characteristic data:", oError);
                }
            });
        },
        
        _setCharacteristicDialogData: function (oDialog, oData) {
            Fragment.byId("charecetricsInputUpdateDialog", "characteristicIdUpdateInput").setValue(oData.characteristicID);
            Fragment.byId("charecetricsInputUpdateDialog", "characteristicClassIdUpdateInput").setSelectedKey(oData.classID_classID);
            Fragment.byId("charecetricsInputUpdateDialog", "characteristicNameUpdateInput").setValue(oData.characteristicName);
            Fragment.byId("charecetricsInputUpdateDialog", "characteristicIdUpdateInput").setEnabled(false); // Disable ID field for editing
            Fragment.byId("charecetricsInputUpdateDialog", "characteristicClassIdUpdateInput").setEnabled(false);
        },
        
        onSaveCharacteristicsUpdateDialog: function () {
            var oDialog = this._characteristicUpdateDialog;
        
            if (!oDialog) {
                MessageToast.show("Dialog is not available.");
                return;
            }
        
            oDialog.then(function (dialog) {
                var sCharacteristicID = Fragment.byId("charecetricsInputUpdateDialog", "characteristicIdUpdateInput").getValue();
                var sClassID = Fragment.byId("charecetricsInputUpdateDialog", "characteristicClassIdUpdateInput").getSelectedKey();
                var sCharacteristicName = Fragment.byId("charecetricsInputUpdateDialog", "characteristicNameUpdateInput").getValue();
        
                if (!sCharacteristicID || !sClassID || !sCharacteristicName) {
                    MessageToast.show("Please enter all required fields.");
                    return;
                }
        
                var oUpdatedCharacteristic = {
                    characteristicID: parseInt(sCharacteristicID, 10),
                    classID_classID: sClassID,
                    characteristicName: sCharacteristicName
                };
        
                var oModel = this.getView().getModel();
        
                oModel.update("/CHARACTERISTICS(" + sCharacteristicID + ")", oUpdatedCharacteristic, {
                    success: function () {
                        MessageToast.show("Characteristic updated successfully");
                        oModel.refresh();
                        dialog.close();
                    }.bind(this),
                    error: function (oError) {
                        MessageToast.show("Error updating Characteristic. Check the console for details.");
                        console.error("Error updating Characteristic:", oError);
                    }
                });
            }.bind(this));
        },
        
        onCancelChareectcisDialogUpdate: function () {
            var oDialog = this._characteristicUpdateDialog;
        
            if (!oDialog) {
                MessageToast.show("Dialog is not available.");
                return;
            }
        
            oDialog.then(function (dialog) {
                dialog.close();
            }.bind(this));
        },
      
        // onEditCharacteristic: function (oEvent) { //--------charecetrics edit(without fragment)----------------
        //     // Get the selected item
        //     var oSelectedItem = oEvent.getSource().getParent().getParent();
        //     var oContext = oSelectedItem.getBindingContext();

        //     // Get data from selected item
        //     var oData = oContext.getObject();

        //     // Set data to input fields
        //     this.byId("editCharacteristicIdInput").setText(oData.characteristicID); // ID is not editable
        //     this.byId("editCharacteristicNameInput").setValue(oData.characteristicName);

        //     // Switch to edit mode
        //     this._oCharacteristicTable.setVisible(false);
        //     this._oEditCharacteristicContainer.setVisible(true);

        //     // Store context for later use
        //     this._oEditContext = oContext;
        // },

        // onSaveCharacteristic: function () {
        //     var sCharacteristicName = this.byId("editCharacteristicNameInput").getValue();

        //     var sCharacteristicId = this.byId("editCharacteristicIdInput").getText(); // ID is read-only

        //     // Create a payload with the updated data
        //     var oPayload = {
        //         characteristicName: sCharacteristicName,
        //         characteristicID: sCharacteristicId
        //     };

        //     // Assuming you have a reference to your ODataModel
        //     var oModel = this.getView().getModel();

        //     // Update data in the OData service
        //     oModel.update("/CHARACTERISTIC(" + sCharacteristicId + ")", oPayload, {
        //         success: function () {
        //             MessageToast.show("Characteristic updated successfully.");
        //             this._exitEditMode("characteristic");
        //         }.bind(this),
        //         error: function () {
        //             MessageToast.show("Error updating characteristic.");
        //         }
        //     });
        // },

        // onCancelEditCharacteristic: function () {
        //     this._exitCharEditMode();
        // },


        // _exitCharEditMode: function () {
        //     // this.byId(sEntity + "Table").setVisible(true);
        //     // this.byId("edit" + sEntity.charAt(0).toUpperCase() + sEntity.slice(1) + "Container").setVisible(false);
        //     this._oCharacteristicTable.setVisible(true);
        //     this._oEditCharacteristicContainer.setVisible(false);
        // },



        // ---------edit charecetrics value fucntilonality-----------
      


      
      
      
        onEditCharacteristicValue: function (oEvent) { //--------charecetricsvalue edit (with fragemnt)------------
            var oView = this.getView();
            var oModel = oView.getModel();
            var oContext = oEvent.getSource().getBindingContext(); // Get selected row's context
        
            var sCharacteristicValueID = oContext.getProperty("characteristicValueID");
        
            oModel.read("/CHARACTERISTICSVALUE(" + sCharacteristicValueID + ")", {
                success: function (oData) {
                    if (!this._characteristicValueUpdateDialog) {
                        this._characteristicValueUpdateDialog = Fragment.load({
                            id: 'characterictsValueInputUpdataeDialog',
                            name: "com.productclassdatamaintenanceapplication.updateFragments.characteristicsValueUpdateFragment",
                            controller: this
                        }).then(function (oDialog) {
                            this._characteristicValueUpdateDialog = Promise.resolve(oDialog);
                            oView.addDependent(oDialog);
                            oDialog.open();
                            this._setCharacteristicValueDialogData(oDialog, oData); // Set data when the dialog is first loaded
                        }.bind(this));
                    } else {
                        this._characteristicValueUpdateDialog.then(function (oDialog) {
                            this._setCharacteristicValueDialogData(oDialog, oData);
                            oDialog.open();
                        }.bind(this));
                    }
                }.bind(this),
                error: function (oError) {
                    MessageToast.show("Error fetching Characteristic Value data");
                    console.error("Error fetching Characteristic Value data:", oError);
                }
            });
        },
        
        _setCharacteristicValueDialogData: function (oDialog, oData) {
            Fragment.byId("characterictsValueInputUpdataeDialog", "characteristicValueIdUpdateInput").setValue(oData.characteristicValueID);
            Fragment.byId("characterictsValueInputUpdataeDialog", "characteristicValueUpdateInput").setValue(oData.value);
            Fragment.byId("characterictsValueInputUpdataeDialog", "characteristicValueDesUpdateInput").setValue(oData.valueDescription);
            Fragment.byId("characterictsValueInputUpdataeDialog", "characteristicsIdUpdateInput").setSelectedKey(oData.characteristicID_characteristicID);
            Fragment.byId("characterictsValueInputUpdataeDialog", "characteristicValueIdUpdateInput").setEnabled(false); // Disable ID field for editing
            Fragment.byId("characterictsValueInputUpdataeDialog", "characteristicsIdUpdateInput").setEnabled(false);
        },
        
        onSaveCharacteristicValuesUpdate: function () {
            var oDialog = this._characteristicValueUpdateDialog;
        
            if (!oDialog) {
                MessageToast.show("Dialog is not available.");
                return;
            }
        
            oDialog.then(function (dialog) {
                var sCharacteristicValueID = Fragment.byId("characterictsValueInputUpdataeDialog", "characteristicValueIdUpdateInput").getValue();
                var sValue = Fragment.byId("characterictsValueInputUpdataeDialog", "characteristicValueUpdateInput").getValue();
                var sValueDescription = Fragment.byId("characterictsValueInputUpdataeDialog", "characteristicValueDesUpdateInput").getValue();
                var sCharacteristicID = Fragment.byId("characterictsValueInputUpdataeDialog", "characteristicsIdUpdateInput").getSelectedKey();
        
                if (!sCharacteristicValueID || !sValue || !sValueDescription || !sCharacteristicID) {
                    MessageToast.show("Please enter all required fields.");
                    return;
                }
        
                var oUpdatedCharacteristicValue = {
                    characteristicValueID: parseInt(sCharacteristicValueID, 10),
                    value: sValue,
                    valueDescription: sValueDescription,
                    characteristicID_characteristicID: sCharacteristicID
                };
        
                var oModel = this.getView().getModel();
        
                oModel.update("/CHARACTERISTICSVALUE(" + sCharacteristicValueID + ")", oUpdatedCharacteristicValue, {
                    success: function () {
                        MessageToast.show("Characteristic Value updated successfully");
                        oModel.refresh();
                        dialog.close();
                    }.bind(this),
                    error: function (oError) {
                        MessageToast.show("Error updating Characteristic Value. Check the console for details.");
                        console.error("Error updating Characteristic Value:", oError);
                    }
                });
            }.bind(this));
        },
        
        onCancelChareectcisValueDialogUpdate: function () {
            var oDialog = this._characteristicValueUpdateDialog;
        
            if (!oDialog) {
                MessageToast.show("Dialog is not available.");
                return;
            }
        
            oDialog.then(function (dialog) {
                dialog.close();
            }.bind(this));
        },
        
      
        // onEditCharacteristicValue: function (oEvent) { //--------charectricts value edit (without fargemnt)--------------
        //     // Get the selected item
        //     var oSelectedItem = oEvent.getSource().getParent().getParent();
        //     var oContext = oSelectedItem.getBindingContext();

        //     // Get data from selected item
        //     var oData = oContext.getObject();

        //     // Set data to input fields
        //     this.byId("editCharacteristicValueIdInput").setText(oData.characteristicValueID); // ID is not editable
        //     this.byId("editCharacteristicValueInput").setValue(oData.value);
        //     this.byId("editCharacteristicValueDesInput").setValue(oData.valueDescription);

        //     // Switch to edit mode
        //     this._oCharacteristicValueTable.setVisible(false);
        //     this._oEditCharacteristicValueContainer.setVisible(true);

        //     // Store context for later use
        //     this._oEditContext = oContext;
        // },

        // onSaveCharacteristicValue: function () {
        //     var sCharacteristicValueName = this.byId("editCharacteristicValueInput").getValue();
        //     var sCharacteristicValueDesName = this.byId("editCharacteristicValueDesInput").getValue();
        //     var sCharacteristicValueId = this.byId("editCharacteristicValueIdInput").getText(); // ID is read-only

        //     // Create a payload with the updated data
        //     var oPayload = {
        //         value: sCharacteristicValueName,
        //         valueDescription: sCharacteristicValueDesName
        //     };

        //     // Assuming you have a reference to your ODataModel
        //     var oModel = this.getView().getModel();

        //     // Update data in the OData service
        //     oModel.update("/CHARACTERISTICVALUE(" + sCharacteristicValueId + ")", oPayload, {
        //         success: function () {
        //             MessageToast.show("Characteristic value updated successfully.");
        //             this._exitEditMode("value");
        //         }.bind(this),
        //         error: function () {
        //             MessageToast.show("Error updating characteristic value.");
        //         }
        //     });
        // },

        // onCancelEditCharacteristicValue: function () {
        //     this._exitEditMode();
        // },
        // _exitEditMode: function () {
        //     // this.byId(sEntity + "Table").setVisible(true);
        //     // this.byId("edit" + sEntity.charAt(0).toUpperCase() + sEntity.slice(1) + "Container").setVisible(false);
        //     this._oCharacteristicValueTable.setVisible(true);
        //     this._oEditCharacteristicValueContainer.setVisible(false);
        // },
// ----------edit functionality end's----------------



        // --------nav back to main view-----------
     
     
     
     
     
     
     
        addProductOnNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteProductClassMainView", {}, true);
            }
        }
    });
});
