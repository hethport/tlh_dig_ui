import {StringContent} from './stringContent';
import {Damages} from "./damages";
import {Corrections} from "./corrections";
import {NumeralContent} from "./numeralContent";


export type TransliterationWordContent = string | StringContent | NumeralContent | Damages | Corrections;

export interface TransliterationWord {
    content: TransliterationWordContent[];
}

export function transliterationWord(...content: TransliterationWordContent[]): TransliterationWord {
    return {content};
}

export interface TransliterationTextLine {
    lineNumber: number;
    isAbsolute: boolean;
    content: TransliterationWord[];
}

export function TransliterationTextLine(lineNumber: number, content: TransliterationWord[], isAbsolute: boolean = false): TransliterationTextLine {
    return {lineNumber, isAbsolute, content};
}
