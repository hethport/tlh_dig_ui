import {LineNumber, TransliterationLine, TransliterationLineContent} from "./model";
import {akadogrammRegex, Akkadogramm} from "../model/akkadogramm";
import {alt, createLanguage, digits, optWhitespace, regexp, seq, seqObj, string, TypedLanguage} from "parsimmon";
import {Sumerogramm, sumerogrammRegex} from "../model/sumerogramm";
import {Determinativ, determinativRegex} from "../model/determinativ";
import {allDamages, Damages} from "../model/damages";
import {allCorrections, Corrections} from "../model/corrections";


const hittiteRegex = /[\p{Ll}¬-]+/u;

type LanguageSpec = {
    // Helpers
    number: number,
    poundSign: string;

    // Damages
    damages: Damages,

    // Corrections
    corrections: Corrections,

    // Line number
    lineNumberNotAbsolute: string,
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
    // Helpers
    number: () => digits.map(parseInt),
    poundSign: () => string('#'),

    // Damages
    damages: () => alt(...allDamages.map((d) => string(d.symbol).result(d))),

    // Corrections
    corrections: () => alt(...allCorrections.map((c) => string(c.symbol).result(c))),

    // Line number
    lineNumberNotAbsolute: () => string('\''),
    lineNumber: r => seq(r.number, r.lineNumberNotAbsolute.times(0, 1))
        .map(([number, todo]) => {
            return {number, isAbsolute: todo.length === 0};
        }),

    // String content
    hittite: () => regexp(hittiteRegex),

    akkadogramm: () => regexp(akadogrammRegex)
        .map((result) => Akkadogramm(result.substring(1))),

    sumerogramm: () => regexp(sumerogrammRegex)
        .map((result) => Sumerogramm(result)),

    determinativ: () => regexp(determinativRegex, 1)
        .map((result) => Determinativ(result)),

    singleContent: (r) => alt(r.hittite, r.akkadogramm, r.sumerogramm, r.determinativ, r.damages, r.corrections),

    completeContent: (r) => r.singleContent.sepBy(optWhitespace),

    transliterationLine: (r) => seqObj(
        ["lineNumber", r.lineNumber],
        optWhitespace,
        r.poundSign,
        optWhitespace,
        ["content", r.completeContent]
    )

});

export function parseTransliterationLine(line: string): TransliterationLine | undefined {
    const parsed = transliteration.transliterationLine.parse(line);
    return parsed.status ? parsed.value : undefined;
}
