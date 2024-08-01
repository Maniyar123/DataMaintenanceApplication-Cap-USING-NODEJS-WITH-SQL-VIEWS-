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
              


            // ------------characteristicsDetailDialog-------------------------
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




            

            // onNavigate: function (oEvent) {
            //     var oItem = oEvent.getSource();
            //     var oContext = oItem.getBindingContext();
            //     var subCategorieNumber = oContext.getProperty("subCategorieNumber");

            //     // Load the characteristic fragment
            //     if (!this._characteristicsDetailDialog) {
            //         this._characteristicsDetailDialog = Fragment.load({
            //             id: this.getView().getId(),
            //             name: "com.maintenanceapplication.maintenanceapplication.fragments.CharFragment",
            //             controller: this
            //         }).then(function (oDialog) {
            //             this.getView().addDependent(oDialog);
            //             return oDialog;
            //         }.bind(this));
            //     }

            //     // Open the dialog and bind the context
            //     this._characteristicsDetailDialog.then(function (oDialog) {
            //         var oModelData = that.getView().getModel("oNewModel");
            //         var oCharFragment = sap.ui.getCore().byId("characteristicsDetailTable");
            //         // Filter characteristics based on subCategorieNumber
            //     var filteredCharacteristics = oModelData.getProperty("/Characteristics").filter(function (item) {
            //     return item.subCategorieNumber === subCategorieNumber;
            // });
            //     // Create a new model for the filtered data
            //     var oFilteredModel = new sap.ui.model.json.JSONModel({
            //     Characteristics: filteredCharacteristics
            // });
            //     oCharFragment.setModel(oFilteredModel);
            //         oDialog.open();
            //     });
            // },
  
          

            CloseCheckDialog: function() {
                this._simpleDialog.then(function(oDialog) {
                    oDialog.close();
                });
            },
            
           
            
            // onActionButtonPress: function () {
            //     // Load the checkbox fragment
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
                
            //     // Open the dialog and set the same model data
            //     this._checkboxDialog.then(function (oDialog) {
            //         var oTreeTable = this.byId("hierarchicalDataTreeTable");
            //         oTreeTable.setModel(this._filteredCharacteristicsData);
            //         // this.fetchHierarchicalData();
            //         oDialog.open();
            //     }.bind(this)).catch(function (oError) {
            //         console.error("Error loading fragment: ", oError);
            //     });
            // },
            // fetchHierarchicalData: function () {
            //     var oModel =  this.getView().getModel("oNewModel");
            //     var _checkboxDialog = this;
    
            //     // Fetch the hierarchical data from the OData service
            //     oModel.read("/HierarchicalData", {
            //         success: function (data) {
            //             var oHierarchicalDataModel = new JSONModel(data.results);
            //             // var hierarchicalFrag=that.getId("hierarchicalDataTree");
            //             // hierarchicalFrag.setModel(oHierarchicalDataModel);
            //             _checkboxDialog.getView().setModel(oHierarchicalDataModel, "hierarchicalDataModel");
            //         },
            //         error: function (error) {
            //             sap.m.MessageToast.show("Error fetching data");
            //             console.error("Error fetching data:", error);
            //         }
            //     });
            // },

            // onActionButtonPress: function () {
            //     // Load the checkbox fragment
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
            
            //     // Open the dialog and fetch hierarchical data
            //     this._checkboxDialog.then(function (oDialog) {
            //         var oModel = this.getView().getModel("oNewModel");
            
            //         // Get filtered characteristics data
            //         var aFilteredCharacteristics = this._filteredCharacteristicsData.getProperty("/Characteristics");
            
            //         // Fetch all hierarchical data
            //         oModel.read("/HierarchicalData", {
            //             success: function (data) {
            //                 var oHierarchicalDataModel = new JSONModel(data.results);
            
            //                 // Filter hierarchical data based on filtered characteristics
            //                 var aHierarchicalData = oHierarchicalDataModel.getData();
            //                 var aFilteredHierarchicalData = aHierarchicalData.filter(function (item) {
            //                     return aFilteredCharacteristics.some(function (char) {
            //                         // Match based on characteristic criteria
            //                         return item.characteristicName === char.characteristicName; 
            //                     });
            //                 });
            
            //                 // Set filtered hierarchical data model to the tree table in the dialog
            //                 var oFilteredHierarchicalDataModel = new JSONModel(aFilteredHierarchicalData);
            //                 var oTreeTable = this.byId("hierarchicalDataTreeTable");
            //                 oTreeTable.setModel(oFilteredHierarchicalDataModel, "hierarchicalDataModel");
                                
                              
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
                // Load the checkbox fragment
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
            
                // Open the dialog and fetch hierarchical data
                this._checkboxDialog.then(function (oDialog) {
                    var oModel = this.getView().getModel("oNewModel");
            
                    // Get filtered characteristics data
                    var aFilteredCharacteristics = this._filteredCharacteristicsData.getProperty("/Characteristics");
            
                    // Fetch all hierarchical data
                    oModel.callFunction("/HierarchicalData", {
                        method:"GET",
                        success: function (data) {
                            var oHierarchicalDataModel = new JSONModel(data.results);
            
                            // Filter hierarchical data based on filtered characteristics
                            var aHierarchicalData = oHierarchicalDataModel.getData();
                            var aFilteredHierarchicalData = aHierarchicalData.filter(function (item) {
                                return aFilteredCharacteristics.some(function (char) {
                                    // Match based on characteristic criteria
                                    return item.characteristicName === char.characteristicName; 
                                });
                            });
            
                            // Set filtered hierarchical data model to the tree table in the dialog
                            var oFilteredHierarchicalDataModel = new JSONModel(aFilteredHierarchicalData);
                            var oTreeTable = this.byId("hierarchicalDataTreeTable");
                            oTreeTable.setModel(oFilteredHierarchicalDataModel, "hierarchicalDataModel");
                                
                              
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
            
        
            
          
            onCloseDialog: function () {
                this._checkboxDialog.then(function (oDialog) {
                    oDialog.close();
                });
            },
             
           
            
            
            




            
            
           

           
            
            
            

        });
    });
