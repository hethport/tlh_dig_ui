import {attributeReader, childElementReader, XmlFormat} from "./xmlLoader";
import {AOWord, aoWordFormat} from "./documentWord";
import {ParseP, parsePDblFormat, ParsePDouble, parsePFormat} from "../model/paragraphEnds";

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
  read: (el) => aoBody(
    childElementReader(el, 'div1', aoDiv1Format)
  ),
  write: ({div1}, level) => `<body>
${aoDiv1Format.write(div1, level + 1)}
</body>`
};

function aoBody(div1: AODiv1): AOBody {
  return {type: 'AOBody', div1};
}

// AODiv1

export interface AODiv1 {
  text: AOText;
  type: string;
}

const aoDiv1Format: XmlFormat<AODiv1> = {
  read: (el) => aoDiv1(
    childElementReader(el, 'text', aoTextFormat),
    attributeReader(el, 'type', (v) => v || '')
  ),
  write: ({text, type}) => ''
}

function aoDiv1(text: AOText, type: string): AODiv1 {
  return {text, type};
}

// AOText

export interface AOText {
  type: 'AOText';
  content: AOTextType[];
}

export type AOTextType = typeof ParseP | typeof ParsePDouble | Paragraph;

const aoTextFormat: XmlFormat<AOText> = {
  read: (el) => aoText(
    Array.from(el.children)
      .map((cel) => {
        switch (cel.tagName) {
          case 'p':
            return paragraphFormat.read(cel);
          case 'parsep':
            return parsePFormat.read(cel);
          case 'parsep_dbl':
            return parsePDblFormat.read(cel);
          default:
            throw new Error(`Found illegal tag name ${cel.tagName}`);
        }
      })
  ),
  write: ({content}) => ''
}

function aoText(content: AOTextType[]): AOText {
  return {type: 'AOText', content};
}

// AOParagraph

export interface Paragraph {
  // FIXME: split by lb?
  type: 'AOParagraph';
  s: AOS;
}

const paragraphFormat: XmlFormat<Paragraph> = {
  read: (el) => aoParagraph(childElementReader(el, 's', aoSentenceFormat)),
  write: ({s}) => ''
}

function aoParagraph(s: AOS): Paragraph {
  return {type: 'AOParagraph', s};
}

// AOSentence

export interface AOS {
  type: 'AOS';
  content: AOSContent[];
}

const aoSentenceFormat: XmlFormat<AOS> = {
  read: (el) => aoS(
    Array.from(el.children).map((cel) => {
      switch (cel.tagName) {
        case 'AO:Manuscripts' :
          return aoManuscriptsFormat.read(cel);
        case 'gap':
          return aoGapFormat.read(cel);
        case 'lb':
          return aoLineBreakFormat.read(cel);
        case 'w':
          return aoWordFormat.read(cel);
        default:
          throw new Error(`Found illegal tag name ${cel.tagName}`);
      }
    })
  ),
  write: ({content}, level) => `<s>
TODO!
</s>`
}

function aoS(content: AOSContent[]): AOS {
  return {type: 'AOS', content};
}

export type AOSContent = AOManuscripts | AOGap | AOLineBreak | AOWord;

// AoTxtPubl

export interface AOTxtPubl {
  type: 'AO:TxtPubl';
  content: string;
}

const aoTxtPublFormat: XmlFormat<AOTxtPubl> = {
  read: (el) => aoTxtPubl(el.textContent || ''),
  write: ({content}) => `<AO:TxtPubl>${content}</AO:TxtPubl>`
}

function aoTxtPubl(content: string): AOTxtPubl {
  return {type: 'AO:TxtPubl', content};
}

// AOManuscripts

export interface AOManuscripts {
  type: 'AO:Manuscripts';
  aoTxtPubl: AOTxtPubl;
}

const aoManuscriptsFormat: XmlFormat<AOManuscripts> = {
  read: (el) => aoManuscripts(childElementReader(el, 'AO:TxtPubl', aoTxtPublFormat)),
  write: ({aoTxtPubl}, level) => `<AO:Manuscripts>\n${aoTxtPublFormat.write(aoTxtPubl, level + 1)}\n</AO:Manuscripts>`
}

function aoManuscripts(aoTxtPubl: AOTxtPubl): AOManuscripts {
  return {type: 'AO:Manuscripts', aoTxtPubl};
}

// AOGap

export interface AOGap {
  type: 'gap';
  c: string;
  t?: string;
}

const aoGapFormat: XmlFormat<AOGap> = {
  read: (el) => aoGap(
    attributeReader(el, 'c', (v) => v || ''),
    attributeReader(el, 't', (v) => v || undefined)
  ),
  write: ({c, t}) => t ? `<gap c="${c}" t="${t}"/>` : `<gap c="${c}"/>`
}

export function aoGap(c: string, t?: string): AOGap {
  return {type: 'gap', c, t};
}

// AOLineBreak

export interface AOLineBreak {
  type: 'lb';
  content: string | null;
  lg: string;
  lnr: string;
  txtid: string;
}

const aoLineBreakFormat: XmlFormat<AOLineBreak> = {
  read: (el) => aoLineBreak(
    el.textContent,
    attributeReader(el, 'lg', (v) => v || ''),
    attributeReader(el, 'lnr', (v) => v || ''),
    attributeReader(el, 'txtid', (v) => v || '')
  ),
  write: ({content, lg, lnr, txtid}) => {
    const attrs = [`lg="${lg}" lnr="${lnr}" txt="${txtid}"`]

    return content
      ? `<lb ${attrs}>${content}</lb>`
      : `<lb ${attrs}/>`
  }
}

function aoLineBreak(content: string | null, lg: string, lnr: string, txtid: string): AOLineBreak {
  return {type: 'lb', content, lg, lnr, txtid};
}
