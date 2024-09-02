//    namespace myapp;

  context myapp {
    
  
    entity Product {
    key productId         : Integer;  // Auto-generated numerical ID
    productName           : String(50);  // Product name
    masterClass           : Composition of MasterData on masterClass.productId = $self; // Single MasterClass
}

entity MasterData {
    key masterDataNumber     : Integer;  // Identifier for MasterData, not auto-generated
    productId                : Association to Product;  // Foreign key to Product.productId
    subCategories            : Composition of many subCategoriesData on subCategories.masterDataNumber = $self; // Composition to SubData
}

entity subCategoriesData {
    key subCategorieNumber      : Integer;  // Identifier for SubData, not auto-generated
    subCategoriesName           : String(255);  // Subclass name
    masterDataNumber            : Association to MasterData; // Foreign key to MasterData.masterDataNumber
    characteristics             : Composition of many Characteristic on characteristics.subCategorieNumber = $self; // Composition to Characteristic
}

entity Characteristic {
    key characteristicNumber    : Integer;  // Identifier for Characteristic, not auto-generated
    characteristicName          : String(255);  // Characteristic name
    subCategorieNumber          : Association to subCategoriesData; // Foreign key to SubData.subCategorieNumber
    subCharacteristics          : Composition of many SubCharacteristic on subCharacteristics.characteristicNumber = $self; // Composition to SubCharacteristic
}

entity SubCharacteristic {
    key subCharacteristicNumber : Integer;  // Identifier for SubCharacteristic, not auto-generated
    subCharacteristicName       : String(255);  // Sub-Characteristic name
    characteristicNumber        : Association to Characteristic; // Foreign key to Characteristic.characteristicNumber
    values                      : Composition of many CharacteristicValue on values.subCharacteristicNumber = $self; // Composition to CharacteristicValue
}

entity CharacteristicValue {
    key characteristicValueNumber : Integer;  // Identifier for CharacteristicValue, not auto-generated
    value                         : String(255);  // Value associated with the sub-characteristic
    subCharacteristicNumber       : Association to SubCharacteristic; // Foreign key to SubCharacteristic.subCharacteristicNumber
}
}
   // Virtual entity for Calculation View
    @cds.persistence.exists
    @cds.persistence.table
    entity CALVIEW {
        key CHARACTERISTICNUMBER: Integer;
        CHARACTERISTICNAME: String;
        key SUBCHARACTERISTICNUMBER: Integer;
        SUBCHARACTERISTICNAME: String;
        VALUE: String;
    }

// Virtual entity for hierarchical data

@cds.persistence.exists
@cds.persistence.table
entity HIERARICALDATASET {
     CHARACTERISTICNAME:String;
     key CHARACTERISTICNUMBER:Integer;
     SUBCHARACTERISTICNAME:String;
     key SUBCHARACTERISTICNUMBER:Integer;
     VALUE:String;
};

