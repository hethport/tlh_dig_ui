import {childElementReader, XmlFormat} from "../../editor/xmlLoader";
import {AOSentenceContent} from "../sentence";

export interface AOTxtPubl {
  type: 'AO:TxtPubl';
  content: string;
}

const aoTxtPublFormat: XmlFormat<AOTxtPubl> = {
  read: (el) => aoTxtPubl(el.textContent || ''),
  write: ({content}) => [`<AO:TxtPubl>${content}</AO:TxtPubl>`]
}

function aoTxtPubl(content: string): AOTxtPubl {
  return {type: 'AO:TxtPubl', content};
}

// AOManuscripts

export interface AOManuscripts {
  type: 'AO:Manuscripts';
  aoTxtPubl: AOTxtPubl;
}

export const aoManuscriptsFormat: XmlFormat<AOManuscripts> = {
  read: (el) => aoManuscripts(childElementReader(el, 'AO:TxtPubl', aoTxtPublFormat)),
  write: ({aoTxtPubl}) => ['<AO:Manuscripts>', ...aoTxtPublFormat.write(aoTxtPubl), '</AO:Manuscripts>']
}

function aoManuscripts(aoTxtPubl: AOTxtPubl): AOManuscripts {
  return {type: 'AO:Manuscripts', aoTxtPubl};
}

export function isAOManuscripts(c: AOSentenceContent): c is AOManuscripts {
  return c.type === 'AO:Manuscripts';
}