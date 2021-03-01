import {isStringContentInput, xmlifyStringContentInput} from './stringContent';
import {isDamage, xmlifyDamage} from "./damages";
import {
  CorrectionType,
  DamageType,
  ManuscriptSide,
  MarkContent,
  NumeralContentInput,
  StringContentInput
} from "../generated/graphql";
import {isCorrection} from "./corrections";
import {getXmlNameForManuscriptSide} from "../manuscriptSide";


export type TransliterationWordContent =
  StringContentInput
  | NumeralContentInput
  | DamageType
  | CorrectionType
  | MarkContent;

function xmlify(content: TransliterationWordContent): string {
  if (isStringContentInput(content)) {
    return xmlifyStringContentInput(content);
  } else if (isCorrection(content)) {
    return '<todo/>';
  } else if (isDamage(content)) {
    return xmlifyDamage(content);
  } else {
    return `<nc>${content}</nc>`;
  }
}

function getContent(twc: TransliterationWordContent): string {
  if (typeof twc === 'string') {
    return twc;
  } else if (isStringContentInput(twc)) {
    return twc.content;
  } else {
    // FIXME: implement!
    return '';
  }
}


export class TransliterationWord {
  constructor(public contents: TransliterationWordContent[]) {
  }

  private getTranscription(): string {
    return this.contents.map((twc) => getContent(twc)).join('');
  }

  xmlify(): string {
    return `<w trans="${this.getTranscription()}" mrp0sel="   "
  >${this.contents.map(xmlify).join('')}</w>`;
  }
}

export function transliterationWord(...content: TransliterationWordContent[]): TransliterationWord {
  return new TransliterationWord(content);
}

export interface TransliterationWordParseResult {
  wordInput: string;
  result?: TransliterationWord;
}

function xmlifyTransliterationWordParseResult(t: TransliterationWordParseResult): string {
  if (t.result) {
    return t.result.xmlify();
  } else {
    return `<unknown>${t.wordInput}</unknown>`;
  }
}

export class TransliterationTextLineParseResult {
  constructor(
    public lineNumber: number,
    public lineNumberIsAbsolute: boolean = false,
    public content: TransliterationWordParseResult[]
  ) {
  }

  xmlify(textId: string, side: ManuscriptSide, paragraphNumber: number = 1): string {
    // FIXME: paragraphNumber, language!
    const language = 'Hit';

    const x = `<lb txtid="${textId}" lnr="${getXmlNameForManuscriptSide(side)} ${paragraphNumber} ${this.lineNumber}" lg="${language}"/>\n\n`
    return x + this.content.map((tw) => xmlifyTransliterationWordParseResult(tw)).join('\n\n');
  }
}

export function transliterationTextLine(lineNumber: number, content: TransliterationWordParseResult[], isAbsolute: boolean = false): TransliterationTextLineParseResult {
  return new TransliterationTextLineParseResult(lineNumber, isAbsolute, content);
}
