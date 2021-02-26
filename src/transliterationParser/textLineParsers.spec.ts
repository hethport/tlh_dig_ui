import {numeralContent as nc, transliteration} from './parser';
import {akkadogramm as ag, determinativ as dt, hittite as ht, sumerogramm as sg} from "../model/stringContent";
import {transliterationTextLine as tl, transliterationWord as w} from "../model/transliterationTextLine";
import {de, ds, el, le, ls, pe, supE, supS, uc, ue, us} from './testHelpers';

describe('test', () => {
  it('should parse hittite', () => {
    expect(transliteration.hittite.tryParse('het'))
      .toEqual(ht('het'));
    expect(transliteration.hittite.tryParse('tén'))
      .toEqual(ht('tén'));
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
      .toEqual(tl(1, [w(ds, us, ht('x'), ue, de), w(ht('x')), w(ls, ht('zi'), le), w(ht('x')), w(ds)]));

    expect(parser.tryParse("2' # [DUMU?].MUNUS?-ma e-ša-⸢a⸣-[ri"))
      .toEqual(tl(2, [w(ds, sg('DUMU'), uc, de, sg('.MUNUS'), uc, ht('-ma')), w(ht('e-ša-'), ls, ht('a'), le, ht('-'), ds, ht('ri'))]));

    expect(parser.tryParse("3' # az-zi-ik-ki-it-[tén"))
      .toEqual(tl(3, [w(ht('az-zi-ik-ki-it-'), ds, ht('tén'))]));

    expect(parser.tryParse("4' # nu ḫu-u-ma-an az-[zi-ik-ki- ¬¬¬"))
      .toEqual(tl(4, [w(ht('nu')), w(ht('ḫu-u-ma-an')), w(ht('az-'), ds, ht('zi-ik-ki-')), w(pe)]));

    expect(parser.tryParse("9' # [nu-u]š-ši im-ma(-)["))
      .toEqual(tl(9, [w(ds, ht('nu-u'), de, ht('š-ši')), w(ht('im-ma'), us, ht('-'), ue, ds)]));

    expect(parser.tryParse("10' # [x-x]-TE°MEŠ° ⸢e⸣-["))
      .toEqual(tl(10, [w(ds, ht('x-x'), de, ag('TE'), dt('MEŠ')), w(ls, ht('e'), le, ht('-'), ds)]));

    expect(parser.tryParse("1' # [ … ] x ¬¬¬"))
      .toEqual(tl(1, [w(ds), w(el), w(de), w(ht('x')), w(pe)]));

    expect(parser.tryParse("2' # [ … °MUNUS.MEŠ°zi-i]n-tu-ḫi-e-eš"))
      .toEqual(tl(2, [w(ds), w(el), w(dt('MUNUS.MEŠ'), ht('zi-i'), de, ht('n-tu-ḫi-e-eš'))]));

    // TODO: enable!
    /*
    expect(parser.tryParse("4' # [ … °G]IŠ°BANŠUR °GIŠ°BANŠUR an-da"))
        .toEqual<TransliterationLine>({
            lineNumber: {number: 4, isAbsolute: false},
            content: [ds, ' ', el, ' ', '°G]IŠ°BANŠUR', ' ', '°GIŠ°BANŠUR', ' ', 'an-da']
        });
     */

    expect(parser.tryParse("5' # [ … ] ⸢6⸣ NINDA.GUR₄.RA°ḪI.A° ki-an-da"))
      .toEqual(tl(5, [w(ds), w(el), w(de), w(ls, nc('6'), le), w(sg('NINDA.GUR'), nc('4', true), sg('.RA'), dt('ḪI.A')), w(ht('ki-an-da'))]));

    expect(parser.tryParse("9' # pár-aš-na-a-u-<aš>-kán °LÚ°SAG[I.A ¬¬¬"))
      .toEqual(tl(9, [w(ht('pár-aš-na-a-u-'), supS, ht('aš'), supE, ht('-kán')), w(dt('LÚ'), sg('SAG'), ds, sg('I.A')), w(pe)]));
  });
});
