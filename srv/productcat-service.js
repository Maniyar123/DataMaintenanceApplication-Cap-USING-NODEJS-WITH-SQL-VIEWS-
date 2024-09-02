
// const cds = require('@sap/cds');

// module.exports = cds.service.impl(async function () {
//     const { HierarchicalData } = this.entities;

//     // Define the function to fetch and transform hierarchical data
//     async function fetchHierarchicalData() {
//         const db = await cds.connect.to('db');

//         try {
//             // Fetch flat data from the database
//             const result = await db.run(SELECT.from(HierarchicalData)); // Use the correct table/entity name

//             // Transform flat data into hierarchical format
//             const hierarchicalData = [];
//             const characteristicMap = {};

//             result.forEach(row => {
//                 if (!characteristicMap[row.CHARACTERISTICNUMBER]) {
//                     characteristicMap[row.CHARACTERISTICNUMBER] = {
//                         characteristicName: row.CHARACTERISTICNAME,
//                         characteristicNumber: row.CHARACTERISTICNUMBER,
//                         subCharacteristics: []
//                     };
//                     hierarchicalData.push(characteristicMap[row.CHARACTERISTICNUMBER]);
//                 }

//                 const characteristic = characteristicMap[row.CHARACTERISTICNUMBER];

//                 let subCharacteristic = characteristic.subCharacteristics.find(sc => sc.subCharacteristicNumber === row.SUBCHARACTERISTICNUMBER);

//                 if (!subCharacteristic) {
//                     subCharacteristic = {
//                         subCharacteristicName: row.SUBCHARACTERISTICNAME,
//                         subCharacteristicNumber: row.SUBCHARACTERISTICNUMBER,
//                         values: row.VALUE ? [row.VALUE] : []
//                     };
//                     characteristic.subCharacteristics.push(subCharacteristic);
//                 } else if (row.VALUE) {
//                     subCharacteristic.values.push(row.VALUE);
//                 }
//             });

//             // Return hierarchical data
//             return hierarchicalData;
//         } catch (error) {
//             console.error("Error executing query:", error);
//             throw error;
//         }
//     }

//     // Implement the function defined in CDS
//     this.on('GetHierarchicalData', async (req) => {
//         try {
//             const hierarchicalData = await fetchHierarchicalData();
//             return hierarchicalData;
//         } catch (error) {
//             req.reject(500, "Error fetching hierarchical data");
//         }
//     });
// });
















































// // const cds = require('@sap/cds');

// // module.exports = cds.service.impl(async function () {
// //     this.on('READ', 'HIERARICALDATASET', async (req) => {
// //         const db = await cds.connect.to('db');
        
// //         try {
// //             // Fetch flat data from the database
// //             const result = await db.run(SELECT.from('HIERARICALDATASET'));

// //             // Transform flat data into hierarchical format
// //             const hierarchicalData = [];
// //             const characteristicMap = {};

// //             result.forEach(row => {
// //                 if (!characteristicMap[row.CHARACTERISTICNUMBER]) {
// //                     characteristicMap[row.CHARACTERISTICNUMBER] = {
// //                         characteristicName: row.CHARACTERISTICNAME,
// //                         characteristicNumber: row.CHARACTERISTICNUMBER,
// //                         subCharacteristics: []
// //                     };
// //                     hierarchicalData.push(characteristicMap[row.CHARACTERISTICNUMBER]);
// //                 }

// //                 const characteristic = characteristicMap[row.CHARACTERISTICNUMBER];

// //                 let subCharacteristic = characteristic.subCharacteristics.find(sc => sc.subCharacteristicNumber === row.SUBCHARACTERISTICNUMBER);

// //                 if (!subCharacteristic) {
// //                     subCharacteristic = {
// //                         subCharacteristicName: row.SUBCHARACTERISTICNAME,
// //                         subCharacteristicNumber: row.SUBCHARACTERISTICNUMBER,
// //                         values: row.VALUE ? [row.VALUE] : []
// //                     };
// //                     characteristic.subCharacteristics.push(subCharacteristic);
// //                 } else if (row.VALUE) {
// //                     subCharacteristic.values.push(row.VALUE);
// //                 }
// //             });
// //                 // Log the transformed hierarchical data for debugging
// //             // console.log("Hierarchical Data:", JSON.stringify(hierarchicalData, null, 2));

// //             // Return hierarchical data
// //             return { value: hierarchicalData };
// //         } catch (error) {
// //             console.error("Error executing query:", error);
// //             throw error;
// //         }
// //     });
// // });
