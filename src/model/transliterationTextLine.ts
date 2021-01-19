import {StringContent} from './stringContent';
import {Damages} from "./damages";
import {Corrections} from "./corrections";
import {NumeralContent} from "./numeralContent";
import {ManuscriptSide, StringContentTypeEnum} from "../generated/graphql";


export type TransliterationWordContent = string | StringContent | NumeralContent | Damages | Corrections;


function xmlify(content: TransliterationWordContent): string {
    if (typeof content === 'string') {
        return content;
    } else if (content.type === StringContentTypeEnum.Akadogramm) {
        return `<aGr>${content.content}</aGr>`;
    } else if (content.type === StringContentTypeEnum.Sumerogramm) {
        return `<sGr>${content.content}</sGr>`;
    } else if (content.type === StringContentTypeEnum.MaterLectionis) {
        return `<ml>${content.content}</ml>`;
    } else if (content.type === StringContentTypeEnum.Determinativ) {
        return `<dt>${content.content}</dt>`;
    } else if (content.type === 'Correction') {
        return '<todo/>';
    } else if (content.type === 'NumeralContent') {
        return `<nc>${content.content}</nc>`;
    } else {
        return content.node;
    }
}

function getContent(twc: TransliterationWordContent): string {
    if (typeof twc === 'string') {
        return twc;
    } else if (twc.type === StringContentTypeEnum.Akadogramm) {
        return twc.content;
    } else if (twc.type === StringContentTypeEnum.Determinativ) {
        return twc.content;
    } else if (twc.type === StringContentTypeEnum.Sumerogramm) {
        return twc.content
    } else if (twc.type === StringContentTypeEnum.MaterLectionis) {
        return '';
    } else {
        // FIXME: implement!
        return '';
    }
}

function getNameForManuscriptSide(side: ManuscriptSide): string {
    switch (side) {
        case ManuscriptSide.Back:
            return 'Rs.';
        case ManuscriptSide.Front:
            return 'Vs.';
        case ManuscriptSide.LeftEdge:
            return 'Li.';
        case ManuscriptSide.LowerEdge:
            return 'Us.';
        case ManuscriptSide.RightEdge:
            return 'Re.';
        case ManuscriptSide.UpperEdge:
            return 'Os.';
    }
}

export class TransliterationWord {
    constructor(public content: TransliterationWordContent[]) {
    }

    private getTranscription(): string {
        return this.content.map((twc) => getContent(twc)).join('');
    }

    xmlify(): string {
        return `<w trans="${this.getTranscription()}" mrp0sel="   "
  >${this.content.map(xmlify).join('')}</w>`;
    }
}

export function transliterationWord(...content: TransliterationWordContent[]): TransliterationWord {
    return new TransliterationWord(content);
}

export class TransliterationTextLine {
    constructor(
        public lineNumber: number,
        public isAbsolute: boolean = false,
        public content: TransliterationWord[]
    ) {
    }

    xmlify(textId: string, side: ManuscriptSide, paragraphNumber: number = 1): string {
        // FIXME: paragraphNumber, language!
        const language = 'Hit';

        const x = `<lb txtid="${textId}" lnr="${getNameForManuscriptSide(side)} ${paragraphNumber} ${this.lineNumber}" lg="${language}"/>\n\n`
        return x + this.content.map((tw) => tw.xmlify()).join('\n\n');

    }
}

export function transliterationTextLine(lineNumber: number, content: TransliterationWord[], isAbsolute: boolean = false): TransliterationTextLine {
    return new TransliterationTextLine(lineNumber, isAbsolute, content);
}
