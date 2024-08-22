using { myapp } from '../db/productdata-model';
using {HIERARICALDATASET} from '../db/productdata-model';

service CatalogService1 {
 
 entity Product as projection on myapp.Product;
 entity MasterData as projection on myapp.MasterData;
 entity subCategoriesData as projection on myapp.subCategoriesData;
 entity Characteristic as projection on myapp.Characteristic;
 entity SubCharacteristic as projection on myapp.SubCharacteristic;
 entity CharacteristicValue as projection on myapp.CharacteristicValue;
 entity HIERARICALDATA as projection on HIERARICALDATASET;

}