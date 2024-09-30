// namespace productclassunique;
context productclassunique {
    

entity Class {
    key classID   : String;          //classID which is Assosiate with Characteristic and  productclass
    className     : String;     // Class name
}

entity Product {
    key productID : Integer;     // Auto-generated integer ID for the product
    productName   : String;     // Name of the product
    description   : String;     // Product description
    status        : String;      // Status of the product (e.g., "active", "inactive")
    validFrom     : Date;            // Product valid from date
    validTo       : Date;            // Product valid to date
}

entity Characteristic {
    key characteristicID : String;     
    characteristicName:String;
    classID              :  Association to Class;    
    value                : String;  // Value of the characteristic
}

entity ProductClass {
   key productID : Association to Product;  // Foreign key to Product
   key classID   : Association to Class;    // Foreign key to Class
    
    
}
}
@cds.persistence.exists
@cds.persistence.table
entity PRODUTCLASSUNICALVIEW {
  key  PRODUCTID:Integer;
    DESCRIPTION:String;
    CLASSID:String;
    CHARACTERISTICID:String;
    CHARACTERISTICNAME:String;
    VALUE:String;

}