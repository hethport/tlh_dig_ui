import {StringContent} from './stringContent';
import {Damages} from "./damages";
import {Corrections} from "./corrections";
import {NumeralContent} from "./numeralContent";


export type TransliterationTextLineContent = string | StringContent | NumeralContent | Damages | Corrections;

export interface TransliterationTextLine {
    lineNumber: number;
    isAbsolute: boolean;
    content: TransliterationTextLineContent[];
}

export function TransliterationTextLine(lineNumber: number, content: TransliterationTextLineContent[], isAbsolute: boolean = false): TransliterationTextLine {
    return {lineNumber, isAbsolute, content};
}
