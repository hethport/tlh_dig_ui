import {attributeReader, XmlFormat} from "../../editor/xmlLoader";
import {AOSentenceContent} from "../sentence";

export interface AOGap {
  type: 'gap';
  c: string;
  t?: string;
}

export const aoGapFormat: XmlFormat<AOGap> = {
  read: (el) => aoGap(
    attributeReader(el, 'c', (v) => v || ''),
    attributeReader(el, 't', (v) => v || undefined)
  ),
  write: ({c, t}) => t ? [`<gap c="${c}" t="${t}"/>`] : [`<gap c="${c}"/>`]
}

export function aoGap(c: string, t?: string): AOGap {
  return {type: 'gap', c, t};
}

export function isAOGap(c: AOSentenceContent): c is AOGap {
  return c.type === 'gap';
}