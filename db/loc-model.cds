namespace location;


entity LOCATION_STB1 {
    key LOCATION_ID    : String(4)  @title: 'Location';
        LOCATION_DESC  : String(30) @title: 'Location Description';
        LOCATION_TYPE  : String(1)  @title: 'Location Type';
        LATITUDE       : String(20) @title: 'Latitude';
        LONGITUTE      : String(20) @title: 'Longitude';
        RESERVE_FIELD1 : String(20) @title: 'Reserve Field1';
        RESERVE_FIELD2 : String(20) @title: 'Reserve Field2';
        RESERVE_FIELD3 : String(20) @title: 'Reserve Field3';
        RESERVE_FIELD4 : String(20) @title: 'Reserve Field4';
        RESERVE_FIELD5 : String(20) @title: 'Reserve Field5';
        AUTH_GROUP     : String     @title: 'Authorization Group';
        CHANGED_DATE   : Date;
        CHANGED_TIME   : Time;
        CHANGED_BY     : String(12);
        CREATED_DATE   : Date;
        CREATED_TIME   : Time;
        CREATED_BY     : String(12);
  }

 entity STAGE_LOC {
    key LOCATION_ID    : String(4);
    LOCATION_DESC     : String(30);
    LOCATION_TYPE     : String(1);
    LATITUDE          : String(20);
    LONGITUTE         : String(20);
    RESERVE_FIELD1    : String(20);
    RESERVE_FIELD2    : String(20);
    RESERVE_FIELD3    : String(20);
    RESERVE_FIELD4    : String(20);
    RESERVE_FIELD5    : String(20);
    AUTH_GROUP        : String;
    CHANGED_DATE      : Date;
    CHANGED_TIME      : Time;
    CHANGED_BY        : String(12);
    CREATED_DATE      : Date;
    CREATED_TIME      : Time;
    CREATED_BY        : String(12);
}
