import {XmlFormat} from "../../editor/xmlLib";
import {flattenResults} from '../../functional/result';
import {AOWordContent} from "./wordContent";
import {clearUpperMultiStringContent, readMultiWordContent, UpperMultiStringContent, writeMultiWordContent} from "./multiStringContent";

/*
 * Determinativ:
 * - automatisch für Großbuchstaben markiert durch ° … ° (davor oder dahinter jeweils ein Spatium oder Bindestrich)
 * - auch °m°, °m.[...]°, °f° und °f.[...]° sind Determinative!
 */
export interface AODeterminativ {
  type: 'AODeterminativ';
  content: UpperMultiStringContent[];
}

export function determinativ(...content: (UpperMultiStringContent | string)[]): AODeterminativ {
  return {type: 'AODeterminativ', content: content.map(clearUpperMultiStringContent)};
}

export const determinativFormat: XmlFormat<AODeterminativ> = {
  read: (el) => flattenResults(Array.from(el.childNodes).map(readMultiWordContent))
    .map((content) => determinativ(...content)),
  write: ({content}) => [`<d>${content.flatMap(writeMultiWordContent).join('')}</d>`]
};

export function isDeterminativ(c: AOWordContent): c is AODeterminativ {
  return c.type === 'AODeterminativ';
}
