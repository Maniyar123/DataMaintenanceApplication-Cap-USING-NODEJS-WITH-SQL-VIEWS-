using {interface} from '../db/interface-model';
using {INTERFACEVIEW} from '../db/interface-model';


service CatalogService4 {

    entity INTERFACE as projection on interface.Interface;
    entity SERVICETYPE as projection on interface.ServiceType;
    entity INTERFACE_SERVICE_CONFIGURATION as projection on interface.Interface_Service_Configuration1;
    entity CONFIGURATION_INTERFACE_TABLE as projection on interface.Configuration_Interface_Table;
    entity interface_View as projection on INTERFACEVIEW;

}