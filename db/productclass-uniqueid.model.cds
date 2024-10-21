// namespace productclassunique;
context productclassunique {
    

entity Class {
    key classID   : String;          //classID which is Assosiate with Characteristic and  productclass
    className     : String;     // Class name
}

entity Product {
     key uniqueID : Integer;    // Auto-generated 
     productID    : String;     //  ID for the product
    productName   : String;     // Name of the product
    description   : String;     // Product description
    status        : String;      // Status of the product (e.g., "active", "inactive")
    validFrom     : Date;            // Product valid from date
    validTo       : Date;            // Product valid to date
}

entity Characteristic {
    key characteristicID : String;     
    characteristicName   :String;
    classID              :  Association to Class;    
    value                : String;  // Value of the characteristic
}

entity ProductClass {
   key uniqueID  : Association to Product;  // Foreign key to Product
   key classID   : Association to Class;    // Foreign key to Class
    
    
}
entity DemoProduct {
    key ID: Integer;
    Name: String;
    Price: Decimal;
}
}
@cds.persistence.exists
@cds.persistence.table
entity PRODUTCLASSUNICALVIEW {
  key  UNIQUEID:Integer;
    DESCRIPTION:String;
    CHARACTERISTICNAME:String;
    VALUE:String;

}
@cds.persistence.exists
@cds.persistence.table
entity CLASSCHARSELCTIONCALVIEW{
    key CLASSID:String;
    CLASSNAME:String;
    key CHARACTERISTICID:String;
    CHARACTERISTICNAME:String;
    VALUE:String;
}