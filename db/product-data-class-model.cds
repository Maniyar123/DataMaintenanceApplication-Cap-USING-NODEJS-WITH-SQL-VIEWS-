// namespace productdetailsdataclass;
context productdetailsdataclass {


    entity Class {
        key classID   : Integer; //class id is assosiate with both charcterictcs and products
            className : String(100);
    }

    entity Characteristic {
        key characteristicID   : Integer;
            classID            : Association to Class;
            characteristicName : String(100);
    }

    entity CharacteristicValue {
        key characteristicValueID : Int16;
            characteristicID      : Association to Characteristic;
            value                 : String(100);
            valueDescription      : String(255);
    }

    entity Product {
        key productID   : Integer;
            productName : String(100);
            type        : String(50);
    }

    entity ProductClass {
        key productClassID : Integer;
            productID      : Association to Product;
            classID        : Association to Class;
    }
}

@cds.persistence.exists
@cds.persistence.table
entity PRODUCTCALCLASSVIEWS {
    PRODUCTNAME        : String(100);
    PRODUCTID          : Integer;
    TYPE               : String(50);
    CHARACTERISTICNAME : String(100);
    VALUE              : String(100);
    VALUEDESCRIPTION   : String(255);
    CLASSID_CLASSID    : Integer;

}

// @cds.persistence.exists
// @cds.persistence.table
// entity PRODUCTIDCLASSIDCALVIEWS {
//     PRODUCTID       : Integer;
//     PRODUCTNAME     : String(100);
//     CLASSID_CLASSID : Integer;
// }
