const cds = require("@sap/cds");

module.exports = srv => {

    // Create Class
    srv.on("saveClasses", async (req) => {
        const { classID, className } = req.data;
        
        if (!classID || !className) {
            return req.error(400, "Please enter Class ID and Class Name");
        }

        try {
            await cds.run(INSERT.into("CLASS").entries({ classID, className }));
            return "Class created successfully";
        } catch (err) {
            req.error(500, "Error creating Class");
        }
    });

    // Create Product
    srv.on("saveProducts", async (req) => {
        const { productID, productName, type } = req.data;

        if (!productID || !productName || !type) {
            return req.error(400, "Please enter Product ID, Product Name and Type");
        }

        try {
            await cds.run(INSERT.into("PRODUCT").entries({ productID, productName, type }));
            return "Product created successfully";
        } catch (err) {
            req.error(500, "Error creating Product");
        }
    });

    // Create Characteristic
    srv.on("saveCharacteristics", async (req) => {
        const { characteristicID, classID_classID, characteristicName } = req.data;

        if (!characteristicID || !classID_classID || !characteristicName) {
            return req.error(400, "Please enter valid Characteristic ID, Class ID, and Characteristic Name");
        }

        try {
            await cds.run(INSERT.into("CHARACTERISTICS").entries({ characteristicID, classID_classID, characteristicName }));
            return "Characteristic created successfully";
        } catch (err) {
            req.error(500, "Error creating Characteristic");
        }
    });

    // Create Characteristic Value
    srv.on("saveCharacteristicValues", async (req) => {
        const { characteristicValueID, value, valueDescription, characteristicID_characteristicID } = req.data;

        if (!characteristicValueID || !value || !valueDescription || !characteristicID_characteristicID) {
            return req.error(400, "Please enter Characteristic ID, Value, Characteristic Value ID and Value Description");
        }

        try {
            await cds.run(INSERT.into("CHARACTERISTICSVALUE").entries({
                characteristicValueID,
                value,
                valueDescription,
                characteristicID_characteristicID
            }));
            return "Characteristic Value created successfully";
        } catch (err) {
            req.error(500, "Error creating Characteristic Value");
        }
    });

    // Create Product Class
    srv.on("saveProductClassIds", async (req) => {
        const { productClassID, classID_classID, productID_productID } = req.data;

        if (!productClassID || !classID_classID || !productID_productID) {
            return req.error(400, "Please enter Product Class ID, Class ID, and Product ID");
        }

        try {
            await cds.run(INSERT.into("PRODUCTCLASS").entries({ productClassID, classID_classID, productID_productID }));
            return "Product Class created successfully";
        } catch (err) {
            req.error(500, "Error creating Product Class");
        }
    });
};
