import {TransliterationLine} from "./model";
import {transliteration} from './parser';
import {Akkadogramm as ag} from "../model/akkadogramm";
import {Sumerogramm as sg} from "../model/sumerogramm";
import {Determinativ as dt} from "../model/determinativ";
import {NumeralContent as nc, SubscriptNumeralContent as snc} from "../model/numeralContent";
import {
    DeletionEnd as de,
    DeletionStart as ds,
    LesionEnd as le,
    LesionStart as ls,
    SupplementStart as supS,
    SupplementEnd as supE,
    UnknownBracketEnd as ue,
    UnknownBracketStart as us
} from "../model/damages";
import {Ellipsis as el, ParagraphEnd as pe, UnsureCorrection as uc} from "../model/corrections";

describe('test', () => {
    it('should parse hittite', () => {
        expect(transliteration.hittite.tryParse('het'))
            .toEqual('het');
        expect(transliteration.hittite.tryParse('tén'))
            .toEqual('tén');
    });

    it('should parse akadogramms', () => {
        expect(transliteration.akkadogramm.tryParse('_ABC'))
            .toEqual(ag('ABC'));

        expect(transliteration.akkadogramm.tryParse('-ABC'))
            .toEqual(ag('ABC'));
    });

    it('should parse sumerogramms', () => {
        expect(transliteration.sumerogramm.tryParse('ABC'))
            .toEqual(sg('ABC'));
    });

    it('should parse determinatives', () => {
        expect(transliteration.determinativ.tryParse('°ABC°'))
            .toEqual(dt('ABC'));
    });

    it('should parse lines', () => {
        const parser = transliteration.transliterationLine;

        expect(parser.tryParse("1' # [(x)] x ⸢zi⸣ x ["))
            .toEqual<TransliterationLine>({
                lineNumber: {number: 1, isAbsolute: false},
                content: [ds, us, 'x', ue, de, ' ', 'x', ' ', ls, 'zi', le, ' ', 'x', ' ', ds]
            });

        expect(parser.tryParse("2' # [DUMU?].MUNUS?-ma e-ša-⸢a⸣-[ri"))
            .toEqual<TransliterationLine>({
                lineNumber: {number: 2, isAbsolute: false},
                content: [ds, sg('DUMU'), uc, de, sg('.MUNUS'), uc, '-ma', ' ', 'e-ša-', ls, 'a', le, '-', ds, 'ri']
            });

        expect(parser.tryParse("3' # az-zi-ik-ki-it-[tén"))
            .toEqual<TransliterationLine>({
                lineNumber: {number: 3, isAbsolute: false},
                content: ['az-zi-ik-ki-it-', ds, 'tén']
            });

        expect(parser.tryParse("4' # nu ḫu-u-ma-an az-[zi-ik-ki- ¬¬¬"))
            .toEqual<TransliterationLine>({
                lineNumber: {number: 4, isAbsolute: false},
                content: ['nu', ' ', 'ḫu-u-ma-an', ' ', 'az-', ds, 'zi-ik-ki-', ' ', pe]
            });

        expect(parser.tryParse("9' # [nu-u]š-ši im-ma(-)["))
            .toEqual<TransliterationLine>({
                lineNumber: {number: 9, isAbsolute: false},
                content: [ds, 'nu-u', de, 'š-ši', ' ', 'im-ma', us, '-', ue, ds]
            })

        expect(parser.tryParse("10' # [x-x]-TE°MEŠ° ⸢e⸣-["))
            .toEqual<TransliterationLine>({
                lineNumber: {number: 10, isAbsolute: false},
                content: [ds, 'x-x', de, '-', sg('TE'), dt('MEŠ'), ' ', ls, 'e', le, '-', ds]
            });

        expect(parser.tryParse("1' # [ … ] x ¬¬¬"))
            .toEqual<TransliterationLine>({
                lineNumber: {number: 1, isAbsolute: false},
                content: [ds, ' ', el, ' ', de, ' ', 'x', ' ', pe]
            });

        expect(parser.tryParse("2' # [ … °MUNUS.MEŠ°zi-i]n-tu-ḫi-e-eš"))
            .toEqual<TransliterationLine>({
                lineNumber: {number: 2, isAbsolute: false},
                content: [ds, ' ', el, ' ', dt('MUNUS.MEŠ'), 'zi-i', de, 'n-tu-ḫi-e-eš']
            });

        // TODO: enable!
        /*
        expect(parser.tryParse("4' # [ … °G]IŠ°BANŠUR °GIŠ°BANŠUR an-da"))
            .toEqual<TransliterationLine>({
                lineNumber: {number: 4, isAbsolute: false},
                content: [ds, ' ', el, ' ', '°G]IŠ°BANŠUR', ' ', '°GIŠ°BANŠUR', ' ', 'an-da']
            });
         */

        expect(parser.tryParse("5' # [ … ] ⸢6⸣ NINDA.GUR₄.RA°ḪI.A° ki-an-da"))
            .toEqual<TransliterationLine>({
                lineNumber: {number: 5, isAbsolute: false},
                content: [ds, ' ', el, ' ', de, ' ', ls, nc(6), le, ' ', sg('NINDA.GUR'), snc(4), sg('.RA'), dt('ḪI.A'), ' ', 'ki-an-da']
            });

        expect(parser.tryParse("9' # pár-aš-na-a-u-<aš>-kán °LÚ°SAG[I.A ¬¬¬"))
            .toEqual<TransliterationLine>({
                lineNumber: {number: 9, isAbsolute: false},
                content: ['pár-aš-na-a-u-', supS, 'aš', supE, '-kán', ' ', dt('LÚ'), sg('SAG'), ds, sg('I.A'), ' ', pe]
            });
    });
});
