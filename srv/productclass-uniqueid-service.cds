using { productclassunique } from '../db/productclass-uniqueid.model';
using {PRODUTCLASSUNICALVIEW} from '../db/productclass-uniqueid.model';
using{CLASSCHARSELCTIONCALVIEW}from'../db/productclass-uniqueid.model';
service CatalogService3 {
entity class as projection on productclassunique.Class;
entity product as projection on productclassunique.Product;
entity characteristic as projection on productclassunique.Characteristic;
entity productclass as projection on productclassunique.ProductClass;
entity productclassunicalview as projection on PRODUTCLASSUNICALVIEW;
entity classcharselectioncalview as projection on CLASSCHARSELCTIONCALVIEW;
entity DemoExcelProduct as projection on productclassunique.DemoProduct;
 // Define the custom action
     action DownloadExcel(base64Data: String) returns String;  // Ensure the action is defined
}
