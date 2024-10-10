sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/BusyIndicator",
    "sap/m/MessageToast"
], function (Controller, BusyIndicator, MessageToast) {
    "use strict";

    return Controller.extend("com.demoexceldownload.controller.View1", {
        onInit: function () {
            // Initialization code can be added here if needed
        },
        
        onDownloadExcel: function () {
            // Step 1: Get the OData model bound to the view
            var oModel = this.getView().getModel();  // Assume this is your OData model
        
            // Step 2: Call the OData action or function import to fetch the Excel file (in base64 format)
            oModel.callFunction("/DownloadExcel", {  // Assuming 'DownloadExcel' is the action name
                method: "POST",  // If this is an action call
                success: function (oData) {
                    console.log(oData); // Log the full response
                    // Step 3: Get the base64-encoded file content from the response
                    // var sFileContent = oData.Value;  // 'Value' is assumed to contain the base64 string
                    var sFileContent = oData.DownloadExcel.Value.trim(); // Trim any whitespace
                    console.log("Raw base64 string:", sFileContent);

                    // Step 4: Convert the base64 string to binary
                    var byteCharacters = atob(sFileContent);  // Decode base64 to binary string
                    var byteNumbers = new Array(byteCharacters.length);
                    for (var i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);  // Convert each char to byte (binary)
                    }
                    var byteArray = new Uint8Array(byteNumbers);  // Create a typed array for binary data
        
                    // Step 5: Create a Blob object from the binary data
                    var blob = new Blob([byteArray], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'  // MIME type for Excel
                    });
        
                    // Step 6: Create a temporary link element for the download
                    var link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);  // Create a URL for the Blob object
                    link.download = "ExportedData.xlsx";  // Set the filename for the download
        
                    // Step 7: Append the link to the document, trigger the download, then clean up
                    document.body.appendChild(link);  // Append the link element to the DOM (for Firefox compatibility)
                    link.click();  // Programmatically trigger the download
                    document.body.removeChild(link);  // Remove the link element after download
                },
                error: function (oError) {
                    // Handle the error if the download fails
                    sap.m.MessageToast.show("Error downloading the file.");  // Show a message toast for errors
                }
            });
        }
        
    });
});
