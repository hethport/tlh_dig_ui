import {attributeReader, childElementReader, XmlFormat} from "./xmlLib";
import {failure, flattenResults, Result, zipResult} from '../functional/result';
import {ParagraphSeparator, ParagraphSeparatorDouble, paragraphSeparatorDoubleXmlFormat, paragraphSeparatorXmlFormat} from "../model/paragraphSeparators";
import {Paragraph, paragraphFormat} from "../model/paragraph";
import {AOManuscripts, aoManuscriptsFormat} from "../model/sentenceContent/aoManuscripts";

export interface AOBody {
  type: 'AOBody';
  aoManuscripts: AOManuscripts;
  div1: AODiv1;
}

export const aoBodyFormat: XmlFormat<AOBody> = {
  read: (el) => zipResult(
    childElementReader(el, 'AO:Manuscripts', aoManuscriptsFormat),
    childElementReader(el, 'div1', aoDiv1Format)
  )
    .transformContent(
      ([m, div1]) => aoBody(m, div1),
      (errs) => errs.flat()
    ),
  write: ({div1}) => ['<body>', ...aoDiv1Format.write(div1), '</body>']
};

function aoBody(aoManuscripts: AOManuscripts, div1: AODiv1): AOBody {
  return {type: 'AOBody', aoManuscripts, div1};
}

// AODiv1

export interface AODiv1 {
  type: string;
  text: AOText;
}

const aoDiv1Format: XmlFormat<AODiv1> = {
  read: (el) => childElementReader(el, 'text', aoTextFormat).map((aoText) => aoDiv1(aoText, attributeReader(el, 'type', (v) => v || ''))),
  write: ({text, type}) => []
}

function aoDiv1(text: AOText, type: string): AODiv1 {
  return {text, type};
}

// AOText

export interface AOText {
  type: 'AOText';
  content: AOTextContent[];
}

export type AOTextContent = ParagraphSeparator | ParagraphSeparatorDouble | Paragraph;

const aoTextFormat: XmlFormat<AOText> = {
  read: (el) => {
    const childResults: Result<AOTextContent, string[]>[] = Array.from(el.children)
      .map((cel) => {
        switch (cel.tagName) {
          case 'p':
            return paragraphFormat.read(cel);
          case 'parsep':
            return paragraphSeparatorXmlFormat.read(cel);
          case 'parsep_dbl':
            return paragraphSeparatorDoubleXmlFormat.read(cel);
          default:
            return failure([`Found illegal tag name ${cel.tagName}`]);
        }
      });

    return flattenResults(childResults)
      .transformContent(
        (contents) => aoText(contents),
        (errorMessages) => errorMessages.flat()
      );
  },
  write: ({content}) => []
}

function aoText(content: AOTextContent[]): AOText {
  return {type: 'AOText', content};
}