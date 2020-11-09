import {Akkadogramm} from "../model/akkadogramm";
import {Sumerogramm} from "../model/sumerogramm";
import {Determinativ} from "../model/determinativ";
import {Damages} from "../model/damages";
import {Corrections} from "../model/corrections";

export interface LineNumber {
    number: number;
    isAbsolute: boolean;
}


export type TransliterationLineContent = string | Akkadogramm | Sumerogramm | Determinativ | Damages | Corrections;


export interface TransliterationLine {
    lineNumber: LineNumber;
    content: TransliterationLineContent[];
}
