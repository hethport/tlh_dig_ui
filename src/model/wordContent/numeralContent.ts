import {success, XmlFormat} from "../../editor/xmlLib";
import {AOWordContent} from "./wordContent";

/*
 * Zahl
 */
export interface AONumeralContent {
  type: 'AONumeralContent';
  content: string;
}

export function numeralContent(content: string): AONumeralContent {
  return {type: 'AONumeralContent', content};
}

export const numeralContentFormat: XmlFormat<AONumeralContent> = {
  read: (el) => success(numeralContent(el.textContent || '')),
  write: ({content}) => [`<num>${content}</num>`]
}

export function isNumeralContent(c: AOWordContent): c is AONumeralContent {
  return typeof c !== 'string' && 'type' in c && c.type === 'AONumeralContent';
}