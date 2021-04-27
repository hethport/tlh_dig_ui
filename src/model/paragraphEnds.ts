import {XmlFormat} from "../editor/xmlLoader";

// ParseP

export const ParseP = {
  type: 'ParseP'
}

export const parsePFormat: XmlFormat<typeof ParseP> = {
  read: () => ParseP,
  write: () => '<parsep/>'
};

// ParsePDbl

export const ParsePDouble = {
  type: 'ParsePDouble'
}

export const parsePDblFormat: XmlFormat<typeof ParsePDouble> = {
  read: () => ParsePDouble,
  write: () => '<parsep_dbl/>'
}
