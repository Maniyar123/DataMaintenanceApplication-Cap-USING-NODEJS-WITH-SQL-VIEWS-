using { productdetailsdataclass } from '../db/product-data-class-model';
using {PRODUCTCALCLASSVIEW} from '../db/product-data-class-model';
using {PRODUCTIDCLASSIDCALVIEW} from '../db/product-data-class-model';

service CatalogService2{
entity CLASS as projection on productdetailsdataclass.Class;
entity CHARACTERISTICS as projection on productdetailsdataclass.Characteristic;
entity CHARACTERISTICSVALUE as projection on productdetailsdataclass.CharacteristicValue;
entity PRODUCT as projection on productdetailsdataclass.Product;
entity PRODUCTCLASS as projection on productdetailsdataclass.ProductClass;
entity productclasscalview as projection on PRODUCTCALCLASSVIEW;
entity productidclassidcalview as projection on PRODUCTIDCLASSIDCALVIEW;
}