const cds = require("@sap/cds");

module.exports = srv => {
// ---------------------CRAETE FUNATIONALITY(START)------------------------
    // Create Class
    srv.on("createClass", async (req) => {
        const { classID, className } = req.data;
        
        if (!classID || !className) {
            return req.error(400, "Please enter Class ID and Class Name");
        }

        try {
            await cds.run(INSERT.into("PRODUCTDETAILSDATACLASS_CLASS").entries({ classID, className }));
            return "Class created successfully";
        } catch (err) {
            console.error("Error details:", err); // Log the error details for debugging
            req.error(500, "Error creating Class");
        }
    });

    // Create Product
    srv.on("createProduct", async (req) => {
        const { productID, productName, type } = req.data;

        if (!productID || !productName || !type) {
            return req.error(400, "Please enter Product ID, Product Name and Type");
        }

        try {
            await cds.run(INSERT.into("PRODUCTDETAILSDATACLASS_PRODUCT").entries({ productID, productName, type }));
            return "Product created successfully";
        } catch (err) {
            req.error(500, "Error creating Product");
        }
    });

    // Create Characteristic
    srv.on("createCharacteristics", async (req) => {
        const { characteristicID, classID_classID, characteristicName } = req.data;

        if (!characteristicID || !classID_classID || !characteristicName) {
            return req.error(400, "Please enter valid Characteristic ID, Class ID, and Characteristic Name");
        }

        try {
            await cds.run(INSERT.into("PRODUCTDETAILSDATACLASS_CHARACTERISTIC").entries({ characteristicID, classID_classID, characteristicName }));
            return "Characteristic created successfully";
        } catch (err) {
            req.error(500, "Error creating Characteristic");
        }
    });

    // Create Characteristic Value
    srv.on("createCharacteristicValues", async (req) => {
        const { characteristicID_characteristicID, value, valueDescription  } = req.data;

        if (!characteristicID_characteristicID ||!value || !valueDescription ) {
            return req.error(400, "Please enter Characteristic ID, Value, Characteristic Value ID and Value Description");
        }

        try {
            await cds.run(INSERT.into("PRODUCTDETAILSDATACLASS_CHARACTERISTICVALUE").entries({
               
                characteristicID_characteristicID,
                value,
                valueDescription
            }));
            return "Characteristic Value created successfully";
        } catch (err) {
            console.error("Error details:", err); // Log the error details for debugging
            req.error(500, "Error creating Characteristic Value");
        }
    });

    // Create Product Class
    srv.on("createProductClass", async (req) => {
        const {  classID_classID, productID_productID } = req.data;

        if ( !classID_classID || !productID_productID) {
            return req.error(400, "Please enter Product Class ID, Class ID, and Product ID");
        }

        try {
            await cds.run(INSERT.into("PRODUCTDETAILSDATACLASS_PRODUCTCLASS").entries({  classID_classID, productID_productID }));
            return "Product Class created successfully";
        } catch (err) {
            req.error(500, "Error creating Product Class");
        }
    });
    // ------------------CREATE FUNCTIONALITY (END)------------------

    
};
