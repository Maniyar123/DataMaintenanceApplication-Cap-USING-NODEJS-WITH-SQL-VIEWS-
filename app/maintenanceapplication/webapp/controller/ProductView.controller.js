    sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/Fragment",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageToast"
    ],
    function (Controller,Fragment,Filter,FilterOperator,JSONModel,MessageToast) {
        "use strict";
        var that;

        return Controller.extend("com.maintenanceapplication.maintenanceapplication.controller.ProductView", {
            onInit: function () {
            that=this;
            var oModel = this.getOwnerComponent().getModel("oNewModel");
                this.getView().setModel(oModel);
               
            },


                //   -------value helper request----------
            onValueHelpRequest: function() {
            
                // Load the fragment
                if (!this._characteristicsDialog) {
                    this._characteristicsDialog = Fragment.load({
                        id: this.getView().getId(),
                        name:"com.maintenanceapplication.maintenanceapplication.fragments.CateFragment",
                        controller: this
                    }).then(function(oDialog) {
                        this.getView().addDependent(oDialog);
                        return oDialog;
                    }.bind(this));
                }
                // Open the dialog
                this._characteristicsDialog.then(function(oDialog) {
                    oDialog.open();
                });
            },

            onCloseCatDialog: function() {
                this._characteristicsDialog.then(function(oDialog) {
                    oDialog.close();
                });
            },
              
                //   -------------Product Search field-------------
            onProductInputLiveChange: function (oEvent) {
                var sQuery = oEvent.getParameter("newValue");
                var oTable = this.byId("productTable");
                var oBinding = oTable.getBinding("items");
    
                var aFilters = [];
                if (sQuery) {
                    if (!isNaN(sQuery)) {
                        aFilters.push(new Filter("productId", FilterOperator.EQ, parseInt(sQuery, 10)));
                    } else {
                        aFilters.push(new Filter("productName", FilterOperator.Contains, sQuery));
                    }
                }
                oBinding.filter(aFilters);
            },


            // ------------characteristicsDetailDialog open-------------------------
            onNavigate: function (oEvent) {
                var oItem = oEvent.getSource();
                var oContext = oItem.getBindingContext();
                var subCategorieNumber = oContext.getProperty("subCategorieNumber");
            
                // Load the characteristic fragment
                if (!this._characteristicsDetailDialog) {
                    this._characteristicsDetailDialog = Fragment.load({
                        id: this.getView().getId(),
                        name: "com.maintenanceapplication.maintenanceapplication.fragments.CharFragment",
                        controller: this
                    }).then(function (oDialog) {
                        this.getView().addDependent(oDialog);
                        return oDialog;
                    }.bind(this));
                }
            
                // Open the dialog and fetch the data
                this._characteristicsDetailDialog.then(function (oDialog) {
                    var oModel = this.getView().getModel("oNewModel");
            
                    // Fetch characteristics data from OData
                    oModel.read("/Characteristics", {
                        success: function (oData) {
                            var aCharacteristics = oData.results; // get the characteristics data from oData
            
                            // Filter characteristics based on subCategorieNumber
                            var aFilteredCharacteristics = aCharacteristics.filter(function (item) {
                                return item.subCategorieNumber_subCategorieNumber === subCategorieNumber;
                            });
            
                            // Create a new model for the filtered data
                            var oFilteredModel = new sap.ui.model.json.JSONModel({
                                Characteristics: aFilteredCharacteristics
                            });
            
                            // Set the model to the table
                            var oCharFragment = this.byId("characteristicsDetailTable");
                            
                            oCharFragment.setModel(oFilteredModel);

                            // Store filtered data for later use
                           this._filteredCharacteristicsData = oFilteredModel;
                            oDialog.open();
                        }.bind(this),
                        error: function (oError) {
                            console.error("Error fetching characteristics data: ", oError);
                        }
                    });
                }.bind(this)).catch(function (oError) {
                    console.error("Error loading fragment: ", oError);
                });
            },
            

            // ----------------characteristicsDetailDialog close ----------------------------------
            onCloseCharacteristicsDetailDialog: function () {
                this._characteristicsDetailDialog.then(function (oDialog) {
                    oDialog.close();
                });
            },
              

            // ---------------checkbox fragmnet functionality-----------------
            // onActionButtonPress: function () {
            //     // Load the CheckBox fragment if not already loaded
            //     if (!this._checkboxDialog) {
            //         this._checkboxDialog = Fragment.load({
            //             id: this.getView().getId(),
            //             name: "com.maintenanceapplication.maintenanceapplication.fragments.CheckBox",
            //             controller: this
            //         }).then(function (oDialog) {
            //             this.getView().addDependent(oDialog);
            //             return oDialog;
            //         }.bind(this));
            //     }
            
            //     // Open the CheckBox dialog and fetch hierarchical data
            //     this._checkboxDialog.then(function (oDialog) {
            //         var oModel = this.getView().getModel("oNewModel");
            
            //         // Get the filtered characteristics data
            //         var aFilteredCharacteristics = this._filteredCharacteristicsData.getProperty("/Characteristics");
            //         // console.log("Filtered Characteristics Data: ", aFilteredCharacteristics);
            
            //         // Fetch all hierarchical data
            //         oModel.read("/HIERARICALDATA", {
            //             success: function (oData) {
            //                 var aHierarchicalData = oData.results[0].value; // Accessing the correct data structure
            //                 // console.log("Hierarchical Data: ", aHierarchicalData);
            
            //                 // Flatten the hierarchical data
            //                 var aFlattenedHierarchicalData = aHierarchicalData.flat();
            //                 // console.log("Flattened Hierarchical Data: ", aFlattenedHierarchicalData);
            
            //                 // Filter hierarchical data based on filtered characteristics
            //                 var aFilteredHierarchicalData = aFlattenedHierarchicalData.filter(function (item) {
            //                     return aFilteredCharacteristics.some(function (filteredChar) {
            //                         // console.log("Comparing: ", item.characteristicNumber, filteredChar.characteristicNumber);
            //                         return item.characteristicNumber === filteredChar.characteristicNumber;
            //                     });
            //                 });
            
            //                 // console.log("Filtered Hierarchical Data: ", aFilteredHierarchicalData);
            
            //                 // Set filtered hierarchical data model to the TreeTable in the dialog
            //                 var oFilteredHierarchicalDataModel = new sap.ui.model.json.JSONModel(aFilteredHierarchicalData);
            //                 var oTreeTable = this.byId("hierarchicalDataTreeTable");
            //                 oTreeTable.setModel(oFilteredHierarchicalDataModel, "hierarchicalDataModel");
            
            //                 // // Bind rows to the TreeTable
            //                 // oTreeTable.bindRows({
            //                 //     path: "hierarchicalDataModel>/",
            //                 //     parameters: {
            //                 //         arrayNames: ['subCharacteristics', 'values'] // Define the array structure for tree binding
            //                 //     }
            //                 // });
            
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

            onActionButtonPress: function () {
                // Load the CheckBox fragment if not already loaded
                if (!this._checkboxDialog) {
                    this._checkboxDialog = Fragment.load({
                        id: this.getView().getId(),
                        name: "com.maintenanceapplication.maintenanceapplication.fragments.CheckBox",
                        controller: this
                    }).then(function (oDialog) {
                        this.getView().addDependent(oDialog);
                        return oDialog;
                    }.bind(this));
                }
            
                // Open the CheckBox dialog and fetch hierarchical data
                this._checkboxDialog.then(function (oDialog) {
                    var oModel = this.getView().getModel("oNewModel");
            
                    // Get the filtered characteristics data
                    var aFilteredCharacteristics = this._filteredCharacteristicsData.getProperty("/Characteristics");
            
                    // Fetch all hierarchical data
                    oModel.read("/HierarchicalData", {
                        success: function (oData) {
                            var aHierarchicalData = oData.results; // Accessing the correct data structure
                            
                            // Transform data into hierarchical format
                            var hierarchicalData = [];
                            var characteristicMap = {};
            
                            // Process the result set
                            aHierarchicalData.forEach(row => {
                                // Create or find the characteristic in the map
                                if (!characteristicMap[row.CHARACTERISTICNUMBER]) {
                                    characteristicMap[row.CHARACTERISTICNUMBER] = {
                                        characteristicName: row.CHARACTERISTICNAME,
                                        characteristicNumber: row.CHARACTERISTICNUMBER,
                                        subCharacteristics: []
                                    };
                                    hierarchicalData.push(characteristicMap[row.CHARACTERISTICNUMBER]);
                                }
            
                                const characteristic = characteristicMap[row.CHARACTERISTICNUMBER];
                               
                                // Find or create the sub-characteristic in the characteristic
                                let subCharacteristic = characteristic.subCharacteristics.find(sc => sc.subCharacteristicNumber === row.SUBCHARACTERISTICNUMBER);
            
                                if (!subCharacteristic) {
                                    subCharacteristic = {
                                        subCharacteristicName: row.SUBCHARACTERISTICNAME,
                                        subCharacteristicNumber: row.SUBCHARACTERISTICNUMBER,
                                        values: row.VALUE ? [row.VALUE] : []
                                    };
                                    characteristic.subCharacteristics.push(subCharacteristic);
                                } else if (row.VALUE) {
                                    subCharacteristic.values.push(row.VALUE);
                                }
                            });
            
                            // Filter hierarchical data based on filtered characteristics
                            var aFilteredHierarchicalData = hierarchicalData.filter(function (item) {
                                return aFilteredCharacteristics.some(function (filteredChar) {
                                    return item.characteristicNumber === filteredChar.characteristicNumber;
                                });
                            });
            
                            // Set filtered hierarchical data model to the TreeTable in the dialog
                            var oFilteredHierarchicalDataModel = new sap.ui.model.json.JSONModel(aFilteredHierarchicalData);
                            var oTreeTable = this.byId("hierarchicalDataTreeTable");
                            oTreeTable.setModel(oFilteredHierarchicalDataModel, "hierarchicalDataModel");
            
                            // Bind rows to the TreeTable
                            // oTreeTable.bindRows({
                            //     path: "hierarchicalDataModel>/",
                            //     parameters: {
                            //         arrayNames: ['subCharacteristics', 'values'] // Define the array structure for tree binding
                            //     }
                            // });
            
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
            
            // onActionButtonPress: function () {
            //     // Load the CheckBox fragment if not already loaded
            //     if (!this._checkboxDialog) {
            //         this._checkboxDialog = Fragment.load({
            //             id: this.getView().getId(),
            //             name: "com.maintenanceapplication.maintenanceapplication.fragments.CheckBox",
            //             controller: this
            //         }).then(function (oDialog) {
            //             this.getView().addDependent(oDialog);
            //             return oDialog;
            //         }.bind(this));
            //     }
            
            //     // Open the CheckBox dialog and fetch hierarchical data
            //     this._checkboxDialog.then(function (oDialog) {
            //         var oModel = this.getView().getModel("oNewModel");
            
            //         // Get the filtered characteristics data
            //         var aFilteredCharacteristics = this._filteredCharacteristicsData.getProperty("/Characteristics");
            
            //         // Fetch all hierarchical data
            //         oModel.read("/HIERARICALDATA", {
            //             success: function (oData) {
            //                 var aHierarchicalData = oData.results; // Hierarchical data already in required format
            
            //                 // Filter hierarchical data based on filtered characteristics
            //                 var aFilteredHierarchicalData = aHierarchicalData.filter(function (item) {
            //                     return aFilteredCharacteristics.some(function (filteredChar) {
            //                         return item.characteristicNumber === filteredChar.characteristicNumber;
            //                     });
            //                 });
            
            //                 // Set filtered hierarchical data model to the TreeTable in the dialog
            //                 var oFilteredHierarchicalDataModel = new sap.ui.model.json.JSONModel(aFilteredHierarchicalData);
            //                 var oTreeTable = this.byId("hierarchicalDataTreeTable");
            //                 oTreeTable.setModel(oFilteredHierarchicalDataModel, "hierarchicalDataModel");
            
            //                 // Bind rows to the TreeTable
            //                 // oTreeTable.bindRows({
            //                 //     path: "hierarchicalDataModel>/",
            //                 //     parameters: {
            //                 //         arrayNames: ['subCharacteristics', 'values'] // Define the array structure for tree binding
            //                 //     }
            //                 // });
            
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
            

            onCloseCheckBoxDialog: function () {
                // Close the dialog
                if (this._checkboxDialog) {
                    this._checkboxDialog.then(function (oDialog) {
                        oDialog.close();
                    });
                }
            },
     
          
           
             
           
            




            
            
           

           
            
            
            

        });
    });
