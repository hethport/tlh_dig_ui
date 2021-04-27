import {XmlFormat} from "../../editor/xmlLoader";
import {AOWordContent} from "./wordContent";

// AOSign

export interface AOSign {
  type: 'AOSign'
  content: string;
}

export const aoSignFormat: XmlFormat<AOSign> = {
  read: (el) => aoSign(el.textContent || ''),
  write: ({content}) => `<AO:Sign>${content}</AO:Sign>`
}

export function aoSign(content: string): AOSign {
  return {type: 'AOSign', content};
}

export function isAoSign(w: AOWordContent): w is AOSign {
  return typeof w !== 'string' && 'type' in w && w.type === 'AOSign';
}
