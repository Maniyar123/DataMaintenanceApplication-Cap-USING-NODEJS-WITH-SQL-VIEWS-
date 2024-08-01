using { myapp as pdb } from '../db/productdata-model';

service CatalogService1 {
    entity Products as projection on pdb.Product;
    entity MasterCharacteristics as projection on pdb.MasterData;
     entity SubCategories as projection on pdb.subCategoriesData;
    entity Characteristics as projection on pdb.Characteristic;
    entity SubCharacteristics as projection on pdb.SubCharacteristic;
    entity CharacteristicValues as projection on pdb.CharacteristicValue;
    
    entity HierarchicalData as projection on pdb.HierarchicalData;
}              