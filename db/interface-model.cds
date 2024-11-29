// namespace interface;
 context interface {
    
 
entity Interface {
    key interface_ID    : Integer; // Primary key for Interface
    interface_Name      : String;  // Name of the interface
    interface_Desc      : String;  // Description of the interface
}

entity ServiceType {
    key Interface_Type  : Integer;  // Primary key for ServiceType
    service_TypeName    : String;   // Name of the service type
}

entity Interface_Service_Configuration1 {
    key Service_ID      : Integer;  // Primary key for Service Configuration
    key Interface_Type      : Integer;  // Foreign key to ServiceType.Interface_Type
    key Parameter_ID        : Integer;  // Parameter identifier
    Value_ID            : String;   // Configuration value
}

entity Configuration_Interface_Table {
    key Service_ID          : Integer; // Foreign key to Interface_Service_Configuration.Service_ID
    key Interface_Type          : Integer; // Foreign key to ServiceType.Interface_Type
   
}
 }
@cds.persistence.exists
@cds.persistence.table
entity INTERFACEVIEW {
    key INTERFACE_TYPE:Integer;
    SERVICE_TYPENAME :String;
    key SERVICE_ID :Integer;
    key PARAMETER_ID:Integer;
    VALUE_ID:String;
}

