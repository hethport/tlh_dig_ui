import {
  deletionEndFormat,
  deletionStartFormat,
  lesionEndFormat,
  lesionStartFormat,
  rasureEndFormat,
  rasureStartFormat
} from "../model/damages";
import {AODeterminativ, determinativFormat, isDeterminativ,} from "../model/wordContent/determinativ";
import {attributeReader, unionElementReader, XmlFormat, XmlReader} from "./xmlLoader";
import {AOSign, aoSignFormat} from "../model/wordContent/sign";
import {
  akkadogrammFormat,
  AOAkkadogramm,
  AOSumerogramm,
  isAkkadogramm,
  isSumerogramm,
  MultiStringContent,
  sumerogrammFormat
} from "../model/wordContent/multiStringContent";
import {AOCorr, aoCorrFormat} from "../model/corrections";
import {AOSpace, aoSpaceFormat} from "../model/wordContent/space";
import {AOMaterLectionis, isMaterLectionis, materLectionisFormat} from "../model/wordContent/materLectionis";
import {AONumeralContent, isNumeralContent, numeralContentFormat} from "../model/wordContent/numeralContent";
import {AONote, aoNoteFormat} from "../model/wordContent/footNote";
import {AOKolonMark, aoKolonMarkFormat} from "../model/wordContent/kolonMark";
import {AOIllegibleContent} from "../model/wordContent/illegible";
import {xmlify} from "../model/oldTransliteration";

function getContent(c: AOWordContent): string {
  if (typeof c === 'string') {
    return c;
  } else if (isAkkadogramm(c)) {
    return c.contents.map(getContent).join('');
  } else if (isSumerogramm(c)) {
    return c.contents.map(getContent).join('');
  } else if (isNumeralContent(c)) {
    return c.content;
  } else if (isDeterminativ(c)) {
    return c.content;
  } else if (isMaterLectionis(c)) {
    return c.content;
  } else {
    // FIXME: implement?!
    return '';
  }
}

// AOWord

export interface AOWord {
  type: 'AOWord';
  content: AOWordContent[];
  lg?: string;
  mrp0sel?: string;
  mrp1?: string;
  mpr2?: string;
  mpr3?: string;
  mpr4?: string;
  mpr5?: string;
  mpr6?: string;
  mpr7?: string;
  mpr8?: string;
  mpr9?: string;
  trans?: string;
}

export const aoWordFormat: XmlFormat<AOWord> = {
  read: (el: Element) => {
    return {
      type: 'AOWord',
      content: Array.from(el.childNodes).map((x: ChildNode) => {
        if (x instanceof Text) {
          return x.textContent || '';
        } else if (x instanceof Element) {
          return aoWordContentFormat.read(x);
        } else {
          throw new Error(`Illegal node type found`)
        }
      }),
      lg: attributeReader(el, 'lg', (v) => v || undefined),
      mrp0sel: attributeReader(el, 'mpr0sel', (v) => v || undefined),
      mrp1: attributeReader(el, 'mrp1', (v) => v || undefined),
      mpr2: attributeReader(el, 'mrp2', (v) => v || undefined),
      mpr3: attributeReader(el, 'mrp3', (v) => v || undefined),
      mpr4: attributeReader(el, 'mrp4', (v) => v || undefined),
      mpr5: attributeReader(el, 'mrp5', (v) => v || undefined),
      mpr6: attributeReader(el, 'mrp6', (v) => v || undefined),
      mpr7: attributeReader(el, 'mrp7', (v) => v || undefined),
      mpr8: attributeReader(el, 'mrp8', (v) => v || undefined),
      mpr9: attributeReader(el, 'mrp9', (v) => v || undefined),
      trans: attributeReader(el, 'trans', (v) => v || undefined)
    }
  },
  write: ({content}) => {
    const xmlContent = content.map((wc) => xmlify(wc)).join(' ');
    const transcription = content.map((twc) => getContent(twc)).join('');

    return `<w trans="${transcription}">${xmlContent}</w>`;
  }
}

export function parsedWord(trans: string, ...content: AOWordContent[]): AOWord {
  return {type: 'AOWord', trans, content};
}

// Word content

export type AOSimpleWordContent = MultiStringContent
  | AODeterminativ
  | AOMaterLectionis
  | AONumeralContent
  | AONote
  | AOSign
  | AOKolonMark
  | AOIllegibleContent
  | AOCorr
  | AOSpace;

export type AOWordContent = AOAkkadogramm | AOSumerogramm | AOSimpleWordContent; // TODO: more types!

// Word Content

const aoWordContentFormat: XmlReader<AOWordContent> = unionElementReader<AOWordContent>([
  {name: 'del_in', reader: deletionStartFormat},
  {name: 'del_fin', reader: deletionEndFormat},
  {name: 'ras_in', reader: rasureStartFormat},
  {name: 'ras_fin', reader: rasureEndFormat},
  {name: 'laes_in', reader: lesionStartFormat},
  {name: 'laes_fin', reader: lesionEndFormat},
  {name: 'sGr', reader: sumerogrammFormat},
  {name: 'aGr', reader: akkadogrammFormat},
  {name: 'd', reader: determinativFormat},
  {name: 'SP___AO_3a_MaterLect', reader: materLectionisFormat},
  {name: 'num', reader: numeralContentFormat},
  {name: 'space', reader: aoSpaceFormat},
  {name: 'corr', reader: aoCorrFormat},
  {name: 'SP___AO_3a_-KolonMark', reader: aoKolonMarkFormat},
  {name: 'AO:Sign', reader: aoSignFormat},
  {name: 'note', reader: aoNoteFormat},
]);
