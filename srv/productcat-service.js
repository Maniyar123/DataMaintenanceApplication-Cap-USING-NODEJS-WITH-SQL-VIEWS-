const cds = require('@sap/cds');
module.exports = cds.service.impl(async function () {
    console.log("Inside cds.service.impl...");

    this.on('READ', 'HierarchicalData', async (req) => {
        console.log("Handling READ request for HierarchicalData");

        const db = await cds.connect.to('db');
        // cds.server.listen(4004); // Start the server on port 4004

        console.log("connected to database");
        
        const query = `
        SELECT 
        MYAPP_CHARACTERISTIC.CHARACTERISTICNAME,
        MYAPP_SUBCHARACTERISTIC.SUBCHARACTERISTICNAME,
        MYAPP_CHARACTERISTICVALUE.VALUE
    FROM 
        MYAPP_CHARACTERISTIC
        INNER JOIN
        MYAPP_SUBCHARACTERISTIC
        ON MYAPP_CHARACTERISTIC.CHARACTERISTICNUMBER = MYAPP_SUBCHARACTERISTIC.CHARACTERISTICNUMBER_CHARACTERISTICNUMBER
        INNER JOIN
        MYAPP_CHARACTERISTICVALUE
        ON MYAPP_SUBCHARACTERISTIC.SUBCHARACTERISTICNUMBER = MYAPP_CHARACTERISTICVALUE.SUBCHARACTERISTICNUMBER_SUBCHARACTERISTICNUMBER;
    
        `;
        
        console.log("Executing query:", query);

        try {
            const result = await db.run(query);
            console.log("Query result:", result);

            // Transform the flat data into hierarchical structure
            const hierarchicalData = [];
            const characteristicMap = {};

            result.forEach(row => {
                if (!characteristicMap[row.CHARACTERISTICNAME]) {
                    characteristicMap[row.CHARACTERISTICNAME] = {
                        characteristicName: row.CHARACTERISTICNAME,
                        subCharacteristics: []
                    };
                    hierarchicalData.push(characteristicMap[row.CHARACTERISTICNAME]);
                }

                const characteristic = characteristicMap[row.CHARACTERISTICNAME];
                const subCharacteristic = characteristic.subCharacteristics.find(sc => sc.subCharacteristicName === row.SUBCHARACTERISTICNAME);

                if (!subCharacteristic) {
                    characteristic.subCharacteristics.push({
                        subCharacteristicName: row.SUBCHARACTERISTICNAME,
                        values: [row.VALUE]
                    });
                } else {
                    subCharacteristic.values.push(row.VALUE);
                }
            });

            return hierarchicalData;
        } catch (error) {
            console.error("Error executing query:", error);
            throw error;
        }
    });
});

