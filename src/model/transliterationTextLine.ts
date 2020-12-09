import {NumeralContent, SubscriptNumeralContent} from "./numeralContent";
import {Akkadogramm} from "./akkadogramm";
import {Sumerogramm} from "./sumerogramm";
import {Determinativ} from "./determinativ";
import {Damages} from "./damages";
import {Corrections} from "./corrections";


export type TransliterationTextLineContent =
    string
    | SubscriptNumeralContent
    | NumeralContent
    | Akkadogramm
    | Sumerogramm
    | Determinativ
    | Damages
    | Corrections;


export interface TransliterationTextLine {
    lineNumber: number;
    isAbsolute: boolean;
    content: TransliterationTextLineContent[];
}

export function TransliterationTextLine(lineNumber: number, content: TransliterationTextLineContent[], isAbsolute: boolean = false): TransliterationTextLine {
    return {lineNumber, isAbsolute, content};
}
