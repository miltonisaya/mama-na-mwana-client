import {DataElement} from "../data-elements/dataElement";

export interface Program {
  id: string;
  name: string;
  code: string;
  dhisUid: string;
  dataElements:DataElement[];
}
