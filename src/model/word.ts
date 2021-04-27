import {attributeReader, XmlFormat} from "../editor/xmlLoader";
import {AOWordContent, aoWordContentFormat, getContent} from "./wordContent/wordContent";
import {morphologicalAnalysis, MorphologicalAnalysis} from "./morphologicalAnalysis";

// AOWord

export interface AOWord {
  type: 'AOWord';
  content: AOWordContent[];
  lg?: string;
  mrp0sel?: string;
  mrp1?: MorphologicalAnalysis;
  mpr2?: MorphologicalAnalysis;
  mpr3?: MorphologicalAnalysis;
  mpr4?: MorphologicalAnalysis;
  mpr5?: MorphologicalAnalysis;
  mpr6?: MorphologicalAnalysis;
  mpr7?: MorphologicalAnalysis;
  mpr8?: MorphologicalAnalysis;
  mpr9?: MorphologicalAnalysis;
  trans?: string;
}

function readMorphAnalysis(value: string | null): MorphologicalAnalysis | undefined {
  return value ? morphologicalAnalysis(value) : undefined;
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
      mrp1: attributeReader(el, 'mrp1', readMorphAnalysis),
      mpr2: attributeReader(el, 'mrp2', readMorphAnalysis),
      mpr3: attributeReader(el, 'mrp3', readMorphAnalysis),
      mpr4: attributeReader(el, 'mrp4', readMorphAnalysis),
      mpr5: attributeReader(el, 'mrp5', readMorphAnalysis),
      mpr6: attributeReader(el, 'mrp6', readMorphAnalysis),
      mpr7: attributeReader(el, 'mrp7', readMorphAnalysis),
      mpr8: attributeReader(el, 'mrp8', readMorphAnalysis),
      mpr9: attributeReader(el, 'mrp9', readMorphAnalysis),
      trans: attributeReader(el, 'trans', (v) => v || undefined)
    }
  },
  write: ({content}) => {
    const xmlContent = content.map((wc) => aoWordContentFormat.write(wc, -1)).join(' ');
    const transcription = content.map((twc) => getContent(twc)).join('');

    return `<w trans="${transcription}">${xmlContent}</w>`;
  }
}

export function parsedWord(trans: string, ...content: AOWordContent[]): AOWord {
  return {type: 'AOWord', trans, content};
}
