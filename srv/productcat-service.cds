using { myapp } from '../db/productdata-model';

using {CALVIEW,HIERARICALDATASET} from '../db/productdata-model';

service CatalogService1 {
    entity Products as projection on myapp.Product;
    entity MasterData as projection on myapp.MasterData;
     entity SubCategories as projection on myapp.subCategoriesData;
    entity Characteristics as projection on myapp.Characteristic;
    entity SubCharacteristics as projection on myapp.SubCharacteristic;
    entity CharacteristicValues as projection on myapp.CharacteristicValue;
    // entity calview as projection on myapp.CALVIEW;
    entity HierarchicalData as projection on HIERARICALDATASET;
    entity calculationview as projection on CALVIEW;
     
}    