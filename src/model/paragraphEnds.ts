import {XmlFormat} from "../editor/xmlLib";
import {AOTextContent} from "../editor/documentBody";
import {success} from "../functional/result";

// ParseP

export const ParseP = {
  type: 'ParseP'
}

export const parsePFormat: XmlFormat<typeof ParseP> = {
  read: () => success(ParseP),
  write: () => ['<parsep/>']
};

export function isParseP(c: AOTextContent): c is typeof ParseP {
  return c.type === 'ParseP';
}

// ParsePDbl

export const ParsePDouble = {
  type: 'ParsePDouble'
}

export const parsePDblFormat: XmlFormat<typeof ParsePDouble> = {
  read: () => success(ParsePDouble),
  write: () => ['<parsep_dbl/>']
}

export function isParsePDouble(c: AOTextContent): c is typeof ParsePDouble {
  return c.type === 'ParsePDouble';
}