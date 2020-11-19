import {TransliterationLine} from "../model/transliterationLine";


export interface TransliterationLineParseResult {
    line: string;
    result?: TransliterationLine;
}