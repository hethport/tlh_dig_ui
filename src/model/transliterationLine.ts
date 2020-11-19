import {NumeralContent, SubscriptNumeralContent} from "./numeralContent";
import {Akkadogramm} from "./akkadogramm";
import {Sumerogramm} from "./sumerogramm";
import {Determinativ} from "./determinativ";
import {Damages} from "./damages";
import {Corrections} from "./corrections";


export type TransliterationLineContent =
    string
    | SubscriptNumeralContent
    | NumeralContent
    | Akkadogramm
    | Sumerogramm
    | Determinativ
    | Damages
    | Corrections;


export interface TransliterationLine {
    lineNumber: number;
    isAbsolute: boolean;
    content: TransliterationLineContent[];
}

export function TransliterationLine(lineNumber: number, content: TransliterationLineContent[], isAbsolute: boolean = false): TransliterationLine {
    return {lineNumber, isAbsolute, content};
}
