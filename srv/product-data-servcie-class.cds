using { productdetailsdataclass } from '../db/product-data-class-model';
using {PRODUCTCALCLASSVIEWS} from '../db/product-data-class-model';
// using {PRODUCTCLASSSQLVIEW} from '../db/product-data-class-model';
using {PRODUCTIDCLASSIDVIEW} from '../db/product-data-class-model';

service CatalogService2{
entity CLASS as projection on productdetailsdataclass.Class;
entity CHARACTERISTICS as projection on productdetailsdataclass.Characteristic;
entity CHARACTERISTICSVALUE as projection on productdetailsdataclass.CharacteristicValue;
entity PRODUCT as projection on productdetailsdataclass.Product;
entity PRODUCTCLASS as projection on productdetailsdataclass.ProductClass;
entity productclasscalview as projection on PRODUCTCALCLASSVIEWS;
// entity productclasssqlview as projection on PRODUCTCLASSSQLVIEW;
entity productidclassidcalview as projection on PRODUCTIDCLASSIDVIEW;
  // Custom functions for class operations
    function createClass(classID: String, className: String) returns String;
    function createProduct(productID: String,productName:String,type:String) returns String;
    function createCharacteristics (characteristicID:String,classID_classID:String,characteristicName:String)returns String;
    function createCharacteristicValues (characteristicID_characteristicID:String,value:String,valueDescription:String)returns String;
    function createProductClass(classID_classID:String,productID_productID:String)returns String; 
}