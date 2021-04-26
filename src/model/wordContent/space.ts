import {attributeReader, XmlFormat} from "../../editor/xmlLoader";

export interface AOSpace {
  type: 'AOSpace';
  c: string;
}

export const aoSpaceFormat: XmlFormat<AOSpace> = {
  read: (el) => aoSpace(attributeReader(el, 'c', (v) => v || '')),
  write: ({c}) => `<space c="${c}"/>`
}

export function aoSpace(c: string): AOSpace {
  return {type: 'AOSpace', c};
}