import {success, XmlFormat} from "../../editor/xmlLib";
import {AOWordContent} from "./wordContent";

/*
 * Determinativ:
 * - automatisch für Großbuchstaben markiert durch ° … ° (davor oder dahinter jeweils ein Spatium oder Bindestrich)
 * - auch °m°, °m.[...]°, °f° und °f.[...]° sind Determinative!
 */
export interface AODeterminativ {
  type: 'AODeterminativ';
  content: string;
}

export function determinativ(content: string): AODeterminativ {
  return {type: 'AODeterminativ', content};
}

export const determinativFormat: XmlFormat<AODeterminativ> = {
  read: (el) => success(determinativ(el.textContent || '')),
  write: ({content}) => [`<d>${content}</d>`]
};

export function isDeterminativ(c: AOWordContent): c is AODeterminativ {
  return typeof c !== 'string' && 'type' in c && c.type === 'AODeterminativ';
}
