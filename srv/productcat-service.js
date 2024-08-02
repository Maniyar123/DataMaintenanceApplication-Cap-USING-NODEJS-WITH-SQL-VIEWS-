const cds = require('@sap/cds');
 
module.exports = cds.service.impl(async function () {
    this.on('READ', 'HierarchicalData', async (req) => {
        const db = await cds.connect.to('db');
 
        // Define the SQL query
        const query = `
            SELECT
                MYAPP_CHARACTERISTIC.CHARACTERISTICNAME,
                MYAPP_CHARACTERISTIC.CHARACTERISTICNUMBER,
                MYAPP_SUBCHARACTERISTIC.SUBCHARACTERISTICNAME,
                MYAPP_SUBCHARACTERISTIC.SUBCHARACTERISTICNUMBER,
                MYAPP_CHARACTERISTICVALUE.VALUE
            FROM
                MYAPP_CHARACTERISTIC
                INNER JOIN MYAPP_SUBCHARACTERISTIC
                ON MYAPP_CHARACTERISTIC.CHARACTERISTICNUMBER = MYAPP_SUBCHARACTERISTIC.CHARACTERISTICNUMBER_CHARACTERISTICNUMBER
                LEFT JOIN MYAPP_CHARACTERISTICVALUE
                ON MYAPP_SUBCHARACTERISTIC.SUBCHARACTERISTICNUMBER = MYAPP_CHARACTERISTICVALUE.SUBCHARACTERISTICNUMBER_SUBCHARACTERISTICNUMBER
        `;
 
        try {
            // Execute the SQL query
            const result = await db.run(query);
 
            const hierarchicalData = [];
            const characteristicMap = {};
 
            // Process the result set
            result.forEach(row => {
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
 
            // Log hierarchical data for debugging
            console.log("Hierarchical Data:", JSON.stringify(hierarchicalData, null, 2));
 
            // Return hierarchical data
            return { value: hierarchicalData };
        } catch (error) {
            console.error("Error executing query:", error);
            throw error;
        }
    });
});