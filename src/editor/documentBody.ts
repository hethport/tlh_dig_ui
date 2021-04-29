import {attributeReader, childElementReader, XmlFormat} from "./xmlLib";
import {failure, flattenResults, mapResult, Result, transformResultContent} from '../functional/result';
import {ParseP, parsePDblFormat, ParsePDouble, parsePFormat} from "../model/paragraphEnds";
import {Paragraph, paragraphFormat} from "../model/paragraph";

/*
interface SplitResult {
  lineBreakElement: Element;
  followingElements: Element[];
}

function splitParagraphChildrenInLines(elements: Element[]): [Element[], SplitResult[]] {
  let prior: Element[] = [];
  const result: SplitResult[] = [];

  let currentLb: Element | undefined = undefined;
  let acc: Element[] = [];

  elements.forEach((el) => {
    if (el.tagName === 'lb') {
      if (currentLb === undefined) {
        prior = acc;
      } else {
        result.push({lineBreakElement: currentLb, followingElements: acc});
      }

      currentLb = el;
      acc = [];
    } else {
      acc.push(el);
    }
  });

  return [prior, result];
}
 */

export interface AOBody {
  type: 'AOBody';
  div1: AODiv1;
}

export const aoBodyFormat: XmlFormat<AOBody> = {
  read: (el) => mapResult(
    childElementReader(el, 'div1', aoDiv1Format),
    (div1) => aoBody(div1)
  ),
  write: ({div1}) => ['<body>', ...aoDiv1Format.write(div1), '</body>']
};

function aoBody(div1: AODiv1): AOBody {
  return {type: 'AOBody', div1};
}

// AODiv1

export interface AODiv1 {
  type: string;
  text: AOText;
}

const aoDiv1Format: XmlFormat<AODiv1> = {
  read: (el) => mapResult(
    childElementReader(el, 'text', aoTextFormat),
    (aoText) => aoDiv1(aoText, attributeReader(el, 'type', (v) => v || ''))
  ),
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

export type AOTextContent = typeof ParseP | typeof ParsePDouble | Paragraph;

const aoTextFormat: XmlFormat<AOText> = {
  read: (el) => {
    const childResults: Result<AOTextContent, string[]>[] = Array.from(el.children)
      .map((cel) => {
        switch (cel.tagName) {
          case 'p':
            return paragraphFormat.read(cel);
          case 'parsep':
            return parsePFormat.read(cel);
          case 'parsep_dbl':
            return parsePDblFormat.read(cel);
          default:
            return failure([`Found illegal tag name ${cel.tagName}`]);
        }
      });

    return transformResultContent(
      flattenResults(childResults),
      (contents) => aoText(contents),
      (errorMessages) => errorMessages.flat()
    )
  },
  write: ({content}) => []
}

function aoText(content: AOTextContent[]): AOText {
  return {type: 'AOText', content};
}