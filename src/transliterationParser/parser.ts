import {TransliterationLineParseResult} from "./model";
import {akadogrammRegex, Akkadogramm} from "../model/akkadogramm";
import {alt, createLanguage, digits, optWhitespace, regexp, seq, seqObj, string, TypedLanguage} from "parsimmon";
import {Sumerogramm, sumerogrammRegex} from "../model/sumerogramm";
import {Determinativ, determinativRegex} from "../model/determinativ";
import {allDamages, Damages} from "../model/damages";
import {allCorrections, Corrections} from "../model/corrections";
import {
    NumeralContent,
    numeralContentRegex,
    SubscriptNumberContentFromString,
    SubscriptNumeralContent,
    subscriptNumeralContentRegex
} from "../model/numeralContent";
import {TransliterationLine, TransliterationLineContent} from "../model/transliterationLine";


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
    subscriptNumeralContent: SubscriptNumeralContent,


    singleContent: TransliterationLineContent;
    completeContent: TransliterationLineContent[];

    transliterationLine: TransliterationLine;
}

export const transliteration: TypedLanguage<LanguageSpec> = createLanguage<LanguageSpec>({
    damages: () => alt(
        ...allDamages.map(
            (d) => (d.regex ? regexp(d.regex) : string(d.symbol)).result(d)
        )
    ),

    corrections: () => alt(...allCorrections.map((c) => string(c.symbol).result(c))),

    numeralContent: () => regexp(numeralContentRegex)
        .map((result) => NumeralContent(parseInt(result))),

    subscriptNumeralContent: () => regexp(subscriptNumeralContentRegex)
        .map((result) => SubscriptNumberContentFromString(result)),

    hittite: () => regexp(hittiteRegex),

    akkadogramm: () => regexp(akadogrammRegex)
        .map((result) => Akkadogramm(result.substring(1))),

    sumerogramm: () => regexp(sumerogrammRegex)
        .map((result) => Sumerogramm(result)),

    determinativ: () => regexp(determinativRegex, 1)
        .map((result) => Determinativ(result)),

    singleContent: (r) => alt(r.damages, r.corrections, r.subscriptNumeralContent, r.numeralContent, r.hittite, r.akkadogramm, r.sumerogramm, r.determinativ),

    completeContent: (r) => seq(r.singleContent, seq(optWhitespace, r.singleContent).many())
        .map(([tlc, last]) => [
                tlc, ...last.flatMap(([maybeWhiteSpace, otherTlc]) => maybeWhiteSpace.length === 0 ? [otherTlc] : [maybeWhiteSpace, otherTlc])
            ]
        ),

    transliterationLine: (r) => seqObj(
        ['lineNumber', digits.map(parseInt)],
        ['isAbsolute', string("'").times(0, 1).map((res) => res.length === 0)],
        optWhitespace,
        string('#'),
        optWhitespace,
        ['content', r.completeContent]
    )
});

export function parseTransliterationLine(line: string): TransliterationLineParseResult {
    const parsed = transliteration.transliterationLine.parse(line);
    return parsed.status ? {line, result: parsed.value} : {line};
}
