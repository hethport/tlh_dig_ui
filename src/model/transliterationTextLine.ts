import {isStringContentInput, xmlifyStringContentInput} from './stringContent';
import {Damages, isDamage, xmlifyDamage} from "./damages";
import {CorrectionType, ManuscriptSide, NumeralContentInput, StringContentInput} from "../generated/graphql";
import {isCorrection} from "./corrections";


export type TransliterationWordContent = StringContentInput | NumeralContentInput | Damages | CorrectionType;


function xmlify(content: TransliterationWordContent): string {
    if (isStringContentInput(content)) {
        return xmlifyStringContentInput(content);
    } else if (isCorrection(content)) {
        return '<todo/>';
    } else if (isDamage(content)) {
        return xmlifyDamage(content.type);
    } else {
        return `<nc>${content.content}</nc>`;
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
