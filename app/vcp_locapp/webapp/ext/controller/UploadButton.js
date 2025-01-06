sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
], function (MessageToast, JSONModel, Fragment) {
    'use strict';
    var that;  // Store the reference to the current context
    return {
        // Function to open the file upload dialog
        onPressUploadButton: function () {
            if (!this._fileUploaderFragment) {
                this._fileUploaderFragment = sap.ui.xmlfragment(
                    "com.vcplocapp.fragments.fileuploaderFragment", // Path to the fragment
                    this
                );
                // this.getView().addDependent(this._fileUploaderFragment); // Ensure proper lifecycle management
            }
            this._fileUploaderFragment.open();
        },

        // Function to handle file upload
        onUploadFile: function () {
            that = this;
            var oFileUploader = sap.ui.getCore().byId("fileUploader");

            if (!oFileUploader) {
                MessageToast.show("File uploader not found.");
                return;
            }

            var oDomRef = oFileUploader.getDomRef();
            if (!oDomRef || !oDomRef.querySelector("input[type='file']")) {
                MessageToast.show("File input not found.");
                return;
            }

            var oFileInput = oDomRef.querySelector("input[type='file']");
            if (!oFileInput.files || oFileInput.files.length === 0) {
                MessageToast.show("No file selected.");
                return;
            }

            var oFile = oFileInput.files[0];
            if (oFile) {
                var oFileReader = new FileReader();

                oFileReader.onload = function (e) {
                    var sData = e.target.result;
                    var workbook = XLSX.read(sData, { type: 'array' });  // Read the file as an array

                    // Extract data from the first sheet (change index if needed)
                    var worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" }); // Parse into an array of rows

                    // Log the parsed data for debugging
                    console.log("Parsed JSON data from the file:", jsonData);

                    // Skip the header row and process the actual data
                    var dataRows = jsonData.slice(1); // Get all rows except the header

                    // If no valid data rows, show a message and exit
                    if (dataRows.length === 0) {
                        MessageToast.show("The file does not contain any valid data.");
                        return;
                    }

                    // Process each row and prepare the payload for the OData service
                    dataRows.forEach(function (row) {
                        var currentDate = new Date(); // Get the current date and time
                        var currentISODate = currentDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
                        var currentISOTime = currentDate.toISOString().split("T")[1].split(".")[0]; // Format as HH:MM:SS

                        var oFileData = {
                            LOCATION_ID: String(row[0] || "No ID"),  // Convert to string to prevent the deserialization error
                            LOCATION_DESC: row[1] || "", // Default if empty
                            LOCATION_TYPE: row[2] || "", // Default if empty
                            LATITUDE: row[3] || "", // Default if empty
                            LONGITUTE: row[4] || "", // Default if empty
                            RESERVE_FIELD1: row[5] || "", // Empty if not provided
                            RESERVE_FIELD2: row[6] || "", // Empty if not provided
                            RESERVE_FIELD3: row[7] || "", // Handle empty size
                            RESERVE_FIELD4: "",
                            RESERVE_FIELD5: "",
                            AUTH_GROUP: "",
                            CHANGED_DATE: currentISODate, // Auto-generated date
                            CHANGED_TIME: currentISOTime, // Auto-generated time
                            CREATED_DATE: currentISODate, // Auto-generated date
                            CREATED_TIME: currentISOTime  // Auto-generated time
                           
                        };

                        // Log the data being sent to OData service for debugging
                        console.log("Data to be sent to OData service:", oFileData);

                        // Query the OData service to check if LOCATION_ID already exists
                        var oFilter = new sap.ui.model.Filter("LOCATION_ID", sap.ui.model.FilterOperator.EQ, oFileData.LOCATION_ID);
                        var oModel = that.getModel("vmodel");
                        var oModelv4 = that.getModel();
                        oModel.read("/LOCATION_STB", {
                            filters: [oFilter],
                            success: function (oData) {
                                // Check if the entity already exists
                                if (oData.results.length === 0) {
                                    // Entity doesn't exist, create a new one
                                    
                                    oModel.create("/LOCATION_STB", oFileData, {
                                        success: function () {
                                            MessageToast.show("File data uploaded successfully!");
                                            oModelv4.refresh(); // Refresh the model after upload
                                            if (that._fileUploaderFragment) {
                                                that._fileUploaderFragment.close();
                                                that._fileUploaderFragment.destroy();
                                                that._fileUploaderFragment = null;
                                            }
                                        },
                                        error: function (error) {
                                            // Log the error to debug why the request might be failing
                                            console.error("Error occurred while uploading data:", error);
                                            MessageToast.show("Failed to upload file data.");
                                        }
                                    });
                                } else {
                                    // Entity already exists, skip upload for this record
                                    MessageToast.show("Entity already exists");
                                    if (that._fileUploaderFragment) {
                                        that._fileUploaderFragment.close();
                                        that._fileUploaderFragment.destroy();
                                        that._fileUploaderFragment = null;
                                    }
                                }
                            },
                            error: function (error) {
                                console.error("Error occurred while checking for existing entity:", error);
                                MessageToast.show("Failed to check for existing entity.");
                            }
                        });
                    });
                }.bind(this);

                // Use readAsArrayBuffer instead of readAsBinaryString
                oFileReader.readAsArrayBuffer(oFile);
            }
        },

        // Function to close the file upload dialog
        onCloseUploadDialog: function () {
            if (this._fileUploaderFragment) {
                this._fileUploaderFragment.close();
                this._fileUploaderFragment.destroy();
                this._fileUploaderFragment = null;
            }
        }
    };
});
