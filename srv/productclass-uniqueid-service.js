// ----------code for DownloadExcel directly passing the xString data(base64data) from abap and downloading the excelsheet-------------
// const cds = require('@sap/cds');
// const XLSX = require('xlsx');

// module.exports = cds.service.impl(async function() {
    
//     this.on('DownloadExcel', async (req) => {
//         console.log("Incoming request:", req.data); // Log the entire request data
//         try {
//             // Step 1: Get the base64 data from the request
//             const base64Data = req.data.base64Data;  // Ensure the base64 data is passed in the request

//             if (!base64Data) {
//                 throw new Error('Base64 data is required.');
//             }

//             // Step 2: Decode the base64 data to binary string
//             const binaryString = Buffer.from(base64Data, 'base64').toString('binary');

//             // Step 3: Convert binary string to a workbook
//             const workbook = XLSX.read(binaryString, { type: 'binary' });

//             // Step 4: Write the workbook to a binary string (Excel file)
//             const excelBinary = XLSX.write(workbook, { type: 'binary', bookType: 'xlsx' });

//             // Step 5: Convert binary string to base64 (for response)
//             const excelBase64 = Buffer.from(excelBinary, 'binary').toString('base64');
//             console.log("Excel Base64 String:", excelBase64);

//             // Step 6: Return the base64-encoded Excel file
//             return { Value: excelBase64 };

//         } catch (error) {
//             req.error(500, "Error generating Excel file: " + error.message);
//         }
//     });
// });


// ------------code for DownloadExcel passing the entity set and converting the data into xString and dowlonading the excelsheet-----------
// // const cds = require('@sap/cds');
// // const XLSX = require('xlsx');

// // module.exports = cds.service.impl(async function() {
    
// //     this.on('DownloadExcel', async (req) => {
// //         try {
// //             // Step 1: Query dynamic data from the 'Product' entity
// //             const products = await SELECT.from('PRODUCTCLASSUNIQUE_DEMOPRODUCT');  // Adjust entity name as necessary
// //             console.log("Fetched products:", products); // Log fetched data

// //             // Step 2: Prepare data for Excel file
// //             const data = [];
// //             // Add headers to the data
// //             data.push(['ID', 'Name', 'Price']);

// //             // Loop through the results and format them for Excel
// //             products.forEach(product => {
// //                 // Use correct casing for the properties and convert price to a readable format
// //                 data.push([product.ID || '', product.NAME || '', parseFloat(product.PRICE).toFixed(2) || '']);
// //             });

// //             console.log("Data for Excel:", data); // Log the prepared data

// //             // Step 3: Convert the data to a worksheet
// //             const worksheet = XLSX.utils.aoa_to_sheet(data);

// //             // Step 4: Create a new workbook and add the worksheet to it
// //             const workbook = XLSX.utils.book_new();
// //             XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

// //             // Step 5: Write the workbook to a binary string (Excel file)
// //             const excelBinary = XLSX.write(workbook, { type: 'binary', bookType: 'xlsx' });

// //             // Step 6: Convert binary string to base64
// //             const excelBase64 = Buffer.from(excelBinary, 'binary').toString('base64');
// //             console.log("excelBase64:", excelBase64); 
// //             // Step 7: Return the base64-encoded Excel file
// //             return { Value: excelBase64 };
// //         } catch (error) {
// //             req.error(500, "Error generating Excel file: " + error.message);
// //         }
// //     });
// // });
