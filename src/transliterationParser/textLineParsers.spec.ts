import {transliteration} from './parser';
import {Akkadogramm as ag, Determinativ as dt, Sumerogramm as sg} from "../model/stringContent";
import {NumeralContent as nc} from "../model/numeralContent";
import {
    DeletionEnd as de,
    DeletionStart as ds,
    LesionEnd as le,
    LesionStart as ls,
    SupplementEnd as supE,
    SupplementStart as supS,
    UnknownBracketEnd as ue,
    UnknownBracketStart as us
} from "../model/damages";
import {Ellipsis as el, ParagraphEnd as pe, UnsureCorrection as uc} from "../model/corrections";
import {transliterationTextLine as tl, transliterationWord as w} from "../model/transliterationTextLine";

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
        const parser = transliteration.transliterationTextLine;

        expect(parser.tryParse("1' # [(x)] x ⸢zi⸣ x ["))
            .toEqual(tl(1, [w(ds, us, 'x', ue, de), w('x'), w(ls, 'zi', le), w('x'), w(ds)]));

        expect(parser.tryParse("2' # [DUMU?].MUNUS?-ma e-ša-⸢a⸣-[ri"))
            .toEqual(tl(2, [w(ds, sg('DUMU'), uc, de, sg('.MUNUS'), uc, '-ma'), w('e-ša-', ls, 'a', le, '-', ds, 'ri')]));

        expect(parser.tryParse("3' # az-zi-ik-ki-it-[tén"))
            .toEqual(tl(3, [w('az-zi-ik-ki-it-', ds, 'tén')]));

        expect(parser.tryParse("4' # nu ḫu-u-ma-an az-[zi-ik-ki- ¬¬¬"))
            .toEqual(tl(4, [w('nu'), w('ḫu-u-ma-an'), w('az-', ds, 'zi-ik-ki-'), w(pe)]));

        expect(parser.tryParse("9' # [nu-u]š-ši im-ma(-)["))
            .toEqual(tl(9, [w(ds, 'nu-u', de, 'š-ši'), w('im-ma', us, '-', ue, ds)]));

        expect(parser.tryParse("10' # [x-x]-TE°MEŠ° ⸢e⸣-["))
            .toEqual(tl(10, [w(ds, 'x-x', de, '-', sg('TE'), dt('MEŠ')), w(ls, 'e', le, '-', ds)]));

        expect(parser.tryParse("1' # [ … ] x ¬¬¬"))
            .toEqual(tl(1, [w(ds), w(el), w(de), w('x'), w(pe)]));

        expect(parser.tryParse("2' # [ … °MUNUS.MEŠ°zi-i]n-tu-ḫi-e-eš"))
            .toEqual(tl(2, [w(ds), w(el), w(dt('MUNUS.MEŠ'), 'zi-i', de, 'n-tu-ḫi-e-eš')]));

        // TODO: enable!
        /*
        expect(parser.tryParse("4' # [ … °G]IŠ°BANŠUR °GIŠ°BANŠUR an-da"))
            .toEqual<TransliterationLine>({
                lineNumber: {number: 4, isAbsolute: false},
                content: [ds, ' ', el, ' ', '°G]IŠ°BANŠUR', ' ', '°GIŠ°BANŠUR', ' ', 'an-da']
            });
         */

        expect(parser.tryParse("5' # [ … ] ⸢6⸣ NINDA.GUR₄.RA°ḪI.A° ki-an-da"))
            .toEqual(tl(5, [w(ds), w(el), w(de), w(ls, nc('6'), le), w(sg('NINDA.GUR'), nc('4', true), sg('.RA'), dt('ḪI.A')), w('ki-an-da')]));

        expect(parser.tryParse("9' # pár-aš-na-a-u-<aš>-kán °LÚ°SAG[I.A ¬¬¬"))
            .toEqual(tl(9, [w('pár-aš-na-a-u-', supS, 'aš', supE, '-kán'), w(dt('LÚ'), sg('SAG'), ds, sg('I.A')), w(pe)]));
    });
});
