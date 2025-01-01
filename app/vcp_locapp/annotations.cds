using CatalogService5 as service from '../../srv/loc-services';
annotate service.LOCATION_STB with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : LOCATION_ID,
            },
            {
                $Type : 'UI.DataField',
                Value : LOCATION_DESC,
            },
            {
                $Type : 'UI.DataField',
                Value : LOCATION_TYPE,
            },
            {
                $Type : 'UI.DataField',
                Value : LATITUDE,
            },
            {
                $Type : 'UI.DataField',
                Value : LONGITUTE,
            },
            {
                $Type : 'UI.DataField',
                Value : RESERVE_FIELD1,
            },
            {
                $Type : 'UI.DataField',
                Value : RESERVE_FIELD2,
            },
            {
                $Type : 'UI.DataField',
                Value : RESERVE_FIELD3,
            },
            {
                $Type : 'UI.DataField',
                Value : RESERVE_FIELD4,
            },
            {
                $Type : 'UI.DataField',
                Value : RESERVE_FIELD5,
            },
            {
                $Type : 'UI.DataField',
                Value : AUTH_GROUP,
            },
            {
                $Type : 'UI.DataField',
                Label : 'CHANGED_DATE',
                Value : CHANGED_DATE,
            },
            {
                $Type : 'UI.DataField',
                Label : 'CHANGED_TIME',
                Value : CHANGED_TIME,
            },
            {
                $Type : 'UI.DataField',
                Label : 'CHANGED_BY',
                Value : CHANGED_BY,
            },
            {
                $Type : 'UI.DataField',
                Label : 'CREATED_DATE',
                Value : CREATED_DATE,
            },
            {
                $Type : 'UI.DataField',
                Label : 'CREATED_TIME',
                Value : CREATED_TIME,
            },
            {
                $Type : 'UI.DataField',
                Label : 'CREATED_BY',
                Value : CREATED_BY,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : LOCATION_ID,
        },
        {
            $Type : 'UI.DataField',
            Value : LOCATION_DESC,
        },
         
       
    ],
    // Corrected annotation for Smart Filter Bar fields
    UI.SelectionFields : [ 
        LOCATION_ID, LOCATION_DESC
         ],
         
     
);

