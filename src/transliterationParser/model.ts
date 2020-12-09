import {TransliterationTextLine} from "../model/transliterationTextLine";


export interface TransliterationLineParseResult {
    line: string;
    result?: TransliterationTextLine;
}