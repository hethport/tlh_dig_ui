import {XmlFormat} from "../../editor/xmlLib";
import {AOWordContent, MultiStringContent} from "./wordContent";
import {flattenResults} from "../../functional/result";
import {readMultiWordContent, writeMultiWordContent} from "./multiStringContent";

/*
 * Zahl
 */
export interface AONumeralContent {
  type: 'AONumeralContent';
  content: MultiStringContent[];
}

export function numeralContent(...content: MultiStringContent[]): AONumeralContent {
  return {type: 'AONumeralContent', content};
}

export const numeralContentFormat: XmlFormat<AONumeralContent> = {
  read: (el) => flattenResults(Array.from(el.childNodes).map(readMultiWordContent))
    .map((content) => numeralContent(...content)),
  write: ({content}) => [`<num>${content.flatMap(writeMultiWordContent).join('')}</num>`]
}

export function isNumeralContent(c: AOWordContent): c is AONumeralContent {
  return c.type === 'AONumeralContent';
}