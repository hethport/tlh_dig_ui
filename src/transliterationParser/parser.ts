import {LineNumber, TransliterationLine, TransliterationLineContent} from "./model";
import {akadogrammRegex, Akkadogramm} from "../model/akkadogramm";
import {alt, createLanguage, digits, optWhitespace, regexp, seq, seqObj, string, TypedLanguage} from "parsimmon";
import {Sumerogramm, sumerogrammRegex} from "../model/sumerogramm";
import {Determinativ, determinativRegex} from "../model/determinativ";
import {allDamages, Damages} from "../model/damages";
import {allCorrections, Corrections} from "../model/corrections";


const hittiteRegex = /[\p{Ll}¬-]+/u;

type LanguageSpec = {
    // Damages
    damages: Damages,

    // Corrections
    corrections: Corrections,

    // Line number
    lineNumber: LineNumber,

    // String contents
    hittite: string;
    akkadogramm: Akkadogramm;
    sumerogramm: Sumerogramm;
    determinativ: Determinativ,

    singleContent: TransliterationLineContent;

    completeContent: TransliterationLineContent[];

    transliterationLine: TransliterationLine;
}

export const transliteration: TypedLanguage<LanguageSpec> = createLanguage<LanguageSpec>({
    damages: () => alt(...allDamages.map((d) => string(d.symbol).result(d))),

    corrections: () => alt(...allCorrections.map((c) => string(c.symbol).result(c))),

    lineNumber: () => seq(digits, string('\'').times(0, 1))
        .map(([numberStr, todo]) => {
            return {number: parseInt(numberStr), isAbsolute: todo.length === 0};
        }),

    hittite: () => regexp(hittiteRegex),

    akkadogramm: () => regexp(akadogrammRegex)
        .map((result) => Akkadogramm(result.substring(1))),

    sumerogramm: () => regexp(sumerogrammRegex)
        .map((result) => Sumerogramm(result)),

    determinativ: () => regexp(determinativRegex, 1)
        .map((result) => Determinativ(result)),

    singleContent: (r) => alt(r.hittite, r.akkadogramm, r.sumerogramm, r.determinativ, r.damages, r.corrections),

    completeContent: (r) => seq(r.singleContent, seq(optWhitespace, r.singleContent).many())
        .map(([tlc, last]) => [
                tlc, ...last.flatMap(([maybeWhiteSpace, otherTlc]) => maybeWhiteSpace.length === 0 ? [otherTlc] : [maybeWhiteSpace, otherTlc])
            ]
        ),

    transliterationLine: (r) => seqObj(
        ["lineNumber", r.lineNumber],
        optWhitespace,
        string('#'),
        optWhitespace,
        ["content", r.completeContent]
    )

});

export function parseTransliterationLine(line: string): TransliterationLine | undefined {
    const parsed = transliteration.transliterationLine.parse(line);
    return parsed.status ? parsed.value : undefined;
}
