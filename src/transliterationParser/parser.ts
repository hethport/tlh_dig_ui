import {alt, createLanguage, digits, optWhitespace, regexp, seq, string, TypedLanguage, whitespace} from "parsimmon";
import {allDamages, Damages} from "../model/damages";
import {allCorrections, symbolForCorrection} from "../model/corrections";
import {numeralContent, numeralContentRegex, subscriptNumeralContentRegex} from "../model/numeralContent";
import {
    TransliterationTextLine,
    TransliterationWord,
    TransliterationWordContent
} from "../model/transliterationTextLine";
import {
    akadogrammRegex,
    akkadogramm,
    determinativ,
    determinativRegex,
    hittite,
    sumerogramm,
    sumerogrammRegex
} from "../model/stringContent";
import {CorrectionType, NumeralContentInput, StringContentInput} from "../generated/graphql";


export interface TransliterationLineParseResult {
    transliterationLineInput: string;
    result?: TransliterationTextLine;
}

const hittiteRegex = /[\p{Ll}-]+/u;

type LanguageSpec = {
    // String contents
    damages: Damages;
    corrections: CorrectionType;

    hittite: StringContentInput;
    akkadogramm: StringContentInput;
    sumerogramm: StringContentInput;
    determinativ: StringContentInput;

    numeralContent: NumeralContentInput;
    subscriptNumeralContent: NumeralContentInput;


    singleContent: TransliterationWordContent;

    transliterationWord: TransliterationWord;

    transliterationTextLine: TransliterationTextLine;
}

export const transliteration: TypedLanguage<LanguageSpec> = createLanguage<LanguageSpec>({
    damages: () => alt(
        ...allDamages.map(
            (d) => (d.regex ? regexp(d.regex) : string(d.symbol)).result(d)
        )
    ),

    corrections: () => alt(...allCorrections.map((c) => string(symbolForCorrection(c)).result(c))),

    numeralContent: () => regexp(numeralContentRegex)
        .map((result) => numeralContent(result, false)),

    subscriptNumeralContent: () => regexp(subscriptNumeralContentRegex)
        .map((result) => numeralContent((result.codePointAt(0)! % 10).toString(), true)),

    hittite: () => regexp(hittiteRegex).map((result) => hittite(result)),

    akkadogramm: () => regexp(akadogrammRegex)
        .map((result) => akkadogramm(result.substring(1))),

    sumerogramm: () => regexp(sumerogrammRegex)
        .map((result) => sumerogramm(result)),

    determinativ: () => regexp(determinativRegex, 1)
        .map((result) => determinativ(result)),

    singleContent: r => alt(r.damages, r.corrections, r.subscriptNumeralContent, r.numeralContent, r.hittite, r.akkadogramm, r.sumerogramm, r.determinativ),

    transliterationWord: r => r.singleContent.atLeast(1)
        .map((content: TransliterationWordContent[]) => new TransliterationWord(content)),

    transliterationTextLine: r => seq(
        digits.map(parseInt),
        string("'").times(0, 1).map((res) => res.length === 0),
        optWhitespace,
        string('#'),
        optWhitespace,
        r.transliterationWord.sepBy(whitespace)
    ).map(([number, isAbsolute, ows1, _hash, _ows2, content]) => new TransliterationTextLine(number, isAbsolute, content))
});

export function parseTransliterationLine(transliterationLineInput: string): TransliterationLineParseResult {
    const parsed = transliteration.transliterationTextLine.parse(transliterationLineInput);
    return parsed.status ? {transliterationLineInput, result: parsed.value} : {transliterationLineInput};
}
