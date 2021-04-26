import {XmlFormat} from "../../editor/xmlLoader";
import {AOWordContent} from "../../editor/documentWord";

/**
 * Mater lectionis:
 * vor und nach der Mater Lectionis (Kleinbuchstaben markiert durch ° … °; davor oder dahinter jeweils ein Spatium oder Bindestrich)
 */
export interface AOMaterLectionis {
  type: 'AOMaterLectionis';
  content: string;
}

export function aoMaterLectionis(content: string): AOMaterLectionis {
  return {type: 'AOMaterLectionis', content};
}

export const materLectionisFormat: XmlFormat<AOMaterLectionis> = {
  read: (el) => aoMaterLectionis(el.textContent || ''),
  write: ({content}) => `<SP___AO_3a_MaterLect>${content}</SP___AO_3a_MaterLect>`
};

export function isMaterLectionis(c: AOWordContent): c is AOMaterLectionis {
  return typeof c !== 'string' && 'type' in c && c.type === 'AOMaterLectionis';
}
