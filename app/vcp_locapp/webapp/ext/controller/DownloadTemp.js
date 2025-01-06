sap.ui.define([
    "sap/m/MessageToast"
], function (MessageToast) {
    "use strict";

    return {
        onPressDownloadTempButton: function () {
            var oModel = this.getModel(); // Ensure the model is bound to your view
            var sMetadataUrl = oModel.sServiceUrl + "/$metadata"; // Fetch metadata URL from the model

            // Fetch metadata XML
            fetch(sMetadataUrl)
                .then(response => response.text())
                .then(metadataXML => {
                    // Parse the metadata XML
                    var parser = new DOMParser();
                    var oMetadataDoc = parser.parseFromString(metadataXML, "application/xml");

                    // Extract entity type (replace 'LOCATION_STB' with your entity name)
                    var oEntityType = oMetadataDoc.querySelector("EntityType[Name='LOCATION_STB']");
                    
                    if (!oEntityType) {
                        MessageToast.show("Entity type 'LOCATION_STB' not found.");
                        return;
                    }

                    // Define the properties to exclude
                    var aExcludedFields = [
                        "CHANGED_DATE",
                        "CHANGED_TIME",
                        "CHANGED_BY",
                        "CREATED_DATE",
                        "CREATED_TIME",
                        "CREATED_BY"
                    ];

                    // Extract the column headings (properties of the entity type)
                    var oProperties = oEntityType.querySelectorAll("Property");
                    var aColumns = [];

                    oProperties.forEach(function (oProperty) {
                        var sPropertyName = oProperty.getAttribute("Name");
                        if (!aExcludedFields.includes(sPropertyName)) {
                            aColumns.push(sPropertyName);
                        }
                    });

                    if (aColumns.length === 0) {
                        MessageToast.show("No properties found for the entity after filtering.");
                        return;
                    }

                    // Use XLSX.js to create an Excel file with just headers
                    var wb = XLSX.utils.book_new();  // Create a new workbook
                    var ws = XLSX.utils.aoa_to_sheet([aColumns]);  // Convert the headers to a sheet

                    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");  // Append the sheet to the workbook

                    // Write the workbook to a binary Excel file (XLSX)
                    var wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });

                    // Create a Blob for the Excel file
                    var oBlob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

                    // Create a temporary link element
                    var oLink = document.createElement("a");
                    oLink.href = URL.createObjectURL(oBlob);
                    oLink.download = "DownloadTemplate.xlsx"; // Specify the file name

                    // Trigger the download
                    document.body.appendChild(oLink);
                    oLink.click();
                    document.body.removeChild(oLink);

                    MessageToast.show("Template downloaded successfully.");
                })
                .catch(function (oError) {
                    MessageToast.show("Error loading metadata.");
                    console.error(oError);
                });
        }
    };
});
