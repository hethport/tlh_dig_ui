import {alt, createLanguage, digits, optWhitespace, regexp, seq, string, TypedLanguage, whitespace} from "parsimmon";
import {allDamages, Damages} from "../model/damages";
import {allCorrections, Corrections} from "../model/corrections";
import {NumeralContent, numeralContentRegex, subscriptNumeralContentRegex} from "../model/numeralContent";
import {
    TransliterationTextLine,
    TransliterationWord,
    TransliterationWordContent
} from "../model/transliterationTextLine";
import {
    akadogrammRegex,
    Akkadogramm,
    Determinativ,
    determinativRegex,
    Sumerogramm,
    sumerogrammRegex
} from "../model/stringContent";


export interface TransliterationLineParseResult {
    line: string;
    result?: TransliterationTextLine;
}

const hittiteRegex = /[\p{Ll}-]+/u;

type LanguageSpec = {
    // Line number

    // String contents
    damages: Damages,
    corrections: Corrections,

    hittite: string;
    akkadogramm: Akkadogramm;
    sumerogramm: Sumerogramm;
    determinativ: Determinativ,

    numeralContent: NumeralContent,
    subscriptNumeralContent: NumeralContent,


    singleContent: TransliterationWordContent;

    transliterationWord: TransliterationWord,

    transliterationTextLine: TransliterationTextLine;
}

export const transliteration: TypedLanguage<LanguageSpec> = createLanguage<LanguageSpec>({
    damages: () => alt(
        ...allDamages.map(
            (d) => (d.regex ? regexp(d.regex) : string(d.symbol)).result(d)
        )
    ),

    corrections: () => alt(...allCorrections.map((c) => string(c.symbol).result(c))),

    numeralContent: () => regexp(numeralContentRegex)
        .map((result) => NumeralContent(result, false)),

    subscriptNumeralContent: () => regexp(subscriptNumeralContentRegex)
        .map((result) => NumeralContent((result.codePointAt(0)! % 10).toString(), true)),

    hittite: () => regexp(hittiteRegex),

    akkadogramm: () => regexp(akadogrammRegex)
        .map((result) => Akkadogramm(result.substring(1))),

    sumerogramm: () => regexp(sumerogrammRegex)
        .map((result) => Sumerogramm(result)),

    determinativ: () => regexp(determinativRegex, 1)
        .map((result) => Determinativ(result)),

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

export function parseTransliterationLine(line: string): TransliterationLineParseResult {
    const parsed = transliteration.transliterationTextLine.parse(line);
    return parsed.status ? {line, result: parsed.value} : {line};
}
