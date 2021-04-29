import {attributeReader, XmlFormat} from "../../editor/xmlLib";
import {failure, flattenResults, Result, success} from '../../functional/result';
import {AOWordContent, aoWordContentFormat, getContent} from "../wordContent/wordContent";
import {morphologicalAnalysis, MorphologicalAnalysis} from "../morphologicalAnalysis";
import {AOSentenceContent} from "../sentence";

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
    const readContent: Result<AOWordContent[], string[][]> = flattenResults(
      Array.from(el.childNodes).map((x: ChildNode) => {
        if (x instanceof Text) {
          return success(x.textContent || '');
        } else if (x instanceof Element) {
          return aoWordContentFormat.read(x);
        } else {
          return failure([`Illegal node type found`]);
        }
      })
    );

    return readContent
      .transformContent(
        (content) => {
          return {
            type: 'AOWord',
            content,
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
        (errs) => errs.flat()
      );
  },
  write: ({content}) => {
    const xmlContent = content.map(aoWordContentFormat.write).join(' ');
    const transcription = content.map(getContent).join('');

    return [`<w trans="${transcription}">${xmlContent}</w>`];
  }
}

export function parsedWord(trans: string, ...content: AOWordContent[]): AOWord {
  return {type: 'AOWord', trans, content};
}

export function isAOWord(c: AOSentenceContent): c is AOWord {
  return c.type === 'AOWord';
}