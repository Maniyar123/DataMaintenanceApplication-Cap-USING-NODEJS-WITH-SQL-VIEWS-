namespace productdetailsproject;

entity Products {
    key ID       :Integer;  // Auto-generated numerical ID
    productName  : String(50);      // Product name
}

entity Characteristics {
     key ID              :Integer;  // Auto-generated numerical ID
    product             : Association to Products; // Association to Products
    characteristicName  : String(255);     // Characteristic name
    characteristicValue : String(255);     // Characteristic value
}


