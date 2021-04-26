import {XmlFormat} from "../editor/xmlLoader";

// ParseP

export const ParseP = {
  type: 'ParseP'
}

export type ParseP = typeof ParseP;

export const parsePFormat: XmlFormat<ParseP> = {
  read: () => ParseP,
  write: () => '<parsep/>'
};

// ParsePDbl

export const ParsePDouble = {
  type: 'ParsePDouble'
}

export type ParsePDouble = typeof ParsePDouble;

export const parsePDblFormat: XmlFormat<ParsePDouble> = {
  read: () => ParsePDouble,
  write: () => '<parsep_dbl/>'
}
