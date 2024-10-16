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
        // -------------with node js with my smaple data---------------
        // onDownloadExcel: function () {
        //     // Step 1: Get the OData model bound to the view
        //     var oModel = this.getView().getModel();  // Assume this is your OData model
        
        //     // Step 2: Call the OData action or function import to fetch the Excel file (in base64 format)
        //     oModel.callFunction("/DownloadExcel", {  // Assuming 'DownloadExcel' is the action name
        //         method: "POST",  // If this is an action call
        //         success: function (oData) {
        //             console.log(oData); // Log the full response
        //             // Step 3: Get the base64-encoded file content from the response
        //             // var sFileContent = oData.Value;  // 'Value' is assumed to contain the base64 string
        //             var sFileContent = oData.DownloadExcel.Value.trim(); // Trim any whitespace
        //             console.log("Raw base64 string:", sFileContent);

        //             // Step 4: Convert the base64 string to binary
        //             var byteCharacters = atob(sFileContent);  // Decode base64 to binary string
        //             var byteNumbers = new Array(byteCharacters.length);
        //             for (var i = 0; i < byteCharacters.length; i++) {
        //                 byteNumbers[i] = byteCharacters.charCodeAt(i);  // Convert each char to byte (binary)
        //             }
        //             var byteArray = new Uint8Array(byteNumbers);  // Create a typed array for binary data
        
        //             // Step 5: Create a Blob object from the binary data
        //             var blob = new Blob([byteArray], {
        //                 type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'  // MIME type for Excel
        //             });
        
        //             // Step 6: Create a temporary link element for the download
        //             var link = document.createElement("a");
        //             link.href = URL.createObjectURL(blob);  // Create a URL for the Blob object
        //             link.download = "ExportedData.xlsx";  // Set the filename for the download
        
        //             // Step 7: Append the link to the document, trigger the download, then clean up
        //             document.body.appendChild(link);  // Append the link element to the DOM (for Firefox compatibility)
        //             link.click();  // Programmatically trigger the download
        //             document.body.removeChild(link);  // Remove the link element after download
        //         },
        //         error: function (oError) {
        //             // Handle the error if the download fails
        //             sap.m.MessageToast.show("Error downloading the file.");  // Show a message toast for errors
        //         }
        //     });
        // }
        //   --------------with  node js by using abap backend base64 data---------------
        // onDownloadExcel: function () {
        //     // Step 1: Get the base64 data you want to send
        //     const base64Data = "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";  // Replace with your actual base64 data

        //     // Step 2: Get the OData model bound to the view
        //     var oModel = this.getView().getModel();  // Assume this is your OData model
        
        //     // Step 3: Call the OData action or function import to fetch the Excel file (in base64 format)
        //     oModel.callFunction("/DownloadExcel", {
        //         method: "POST",  // If this is an action call
        //         urlParameters: {
        //             base64Data: base64Data  // Pass the base64 data in the request
        //         },
        //         success: function (oData) {
        //             console.log(oData); // Log the full response

        //             // Step 4: Get the base64-encoded file content from the response
        //             var sFileContent =  oData.DownloadExcel.Value; // Trim any whitespace
        //             console.log("Raw base64 string:", sFileContent);

        //             // Step 5: Convert the base64 string to binary
        //             var byteCharacters = atob(sFileContent);  // Decode base64 to binary string
        //             var byteNumbers = new Array(byteCharacters.length);
        //             for (var i = 0; i < byteCharacters.length; i++) {
        //                 byteNumbers[i] = byteCharacters.charCodeAt(i);  // Convert each char to byte (binary)
        //             }
        //             var byteArray = new Uint8Array(byteNumbers);  // Create a typed array for binary data
        
        //             // Step 6: Create a Blob object from the binary data
        //             var blob = new Blob([byteArray], {
        //                 type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'  // MIME type for Excel
        //             });
        
        //             // Step 7: Create a temporary link element for the download
        //             var link = document.createElement("a");
        //             link.href = URL.createObjectURL(blob);  // Create a URL for the Blob object
        //             link.download = "ExportedData.xlsx";  // Set the filename for the download
        
        //             // Step 8: Append the link to the document, trigger the download, then clean up
        //             document.body.appendChild(link);  // Append the link element to the DOM (for Firefox compatibility)
        //             link.click();  // Programmatically trigger the download
        //             document.body.removeChild(link);  // Remove the link element after download
        //         },
        //         error: function (oError) {
        //             // Handle the error if the download fails
        //             MessageToast.show("Error downloading the file.");  // Show a message toast for errors
        //         }
        //     });
        // }

        // -------------- without node js ------------------
        onDownloadExcel: function () {
            // Step 1: Get the base64 data you want to download as an Excel file
            const base64Data = "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"; // Your base64 data for Excel
        
            // Step 2: Convert the base64 string back to binary data (Blob)
            const binaryString = atob(base64Data); // Decode base64 string to binary
            const binaryLength = binaryString.length;
            const byteArray = new Uint8Array(binaryLength);
        
            for (let i = 0; i < binaryLength; i++) {
                byteArray[i] = binaryString.charCodeAt(i); // Fill byteArray with binary data
            }
        
            // Step 3: Create a Blob object with the binary data and the correct MIME type
            const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
            // Step 4: Create a download link element
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob); // Create a URL for the Blob
        
            // Step 5: Set the download filename
            link.download = 'downloaded_file.xlsx';
        
            // Step 6: Trigger the download by programmatically clicking the link
            document.body.appendChild(link);
            link.click();
        
            // Step 7: Clean up and remove the link element
            document.body.removeChild(link);
        }
        
        
    });
});
