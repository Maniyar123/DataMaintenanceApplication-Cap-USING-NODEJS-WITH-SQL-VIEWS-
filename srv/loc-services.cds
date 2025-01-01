using { location} from '../db/loc-model';

service CatalogService5 {

entity LOCATION_STB as projection on location.LOCATION_STB1;
entity STAGE_LOC as projection on location.STAGE_LOC;

}
