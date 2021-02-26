import {numeralContent as nc, parseTransliterationLine} from './parser';
import {transliterationTextLine as tl, transliterationWord as w} from '../model/transliterationTextLine';
import {
  akkadogramm as ag,
  determinativ as dt,
  hittite as ht,
  materLectionis as ml,
  sumerogramm as sg
} from "../model/stringContent";
import {de, ds, el, le, ls, pe, supE, supS, uc, ue, us} from './testHelpers';

describe('The transliteration parser', () => {

  it('should parse complete document', () => {
    expect(parseTransliterationLine("1' # [(x)] x ⸢zi⸣ x [",))
      .toEqual({
        transliterationLineInput: "1' # [(x)] x ⸢zi⸣ x [",
        result: tl(1, [w(ds, us, ht('x'), ue, de), w(ht('x')), w(ls, ht('zi'), le), w(ht('x')), w(ds)])
      });

    expect(parseTransliterationLine("2' # [DUMU?].MUNUS?-ma e-ša-⸢a⸣-[ri"))
      .toEqual({
        transliterationLineInput: "2' # [DUMU?].MUNUS?-ma e-ša-⸢a⸣-[ri",
        result: tl(2, [
          w(ds, sg('DUMU'), uc, de, sg('.MUNUS'), uc, ht('-ma')),
          w(ht('e-ša-'), ls, ht('a'), le, ht('-'), ds, ht('ri'))])
      });

    expect(parseTransliterationLine("3' # az-zi-ik-ki-it-[tén"))
      .toEqual({
        transliterationLineInput: "3' # az-zi-ik-ki-it-[tén",
        result: tl(3, [w(ht('az-zi-ik-ki-it-'), ds, ht('tén'))])
      });

    expect(parseTransliterationLine("4' # nu ḫu-u-ma-an az-[zi-ik-ki- ¬¬¬"))
      .toEqual({
        transliterationLineInput: "4' # nu ḫu-u-ma-an az-[zi-ik-ki- ¬¬¬",
        result: tl(4, [w(ht('nu')), w(ht('ḫu-u-ma-an')), w(ht('az-'), ds, ht('zi-ik-ki-')), w(pe)])
      });

    expect(parseTransliterationLine("5' # [k]u-it-ma-an-aš-ma x ["))
      .toEqual({
        transliterationLineInput: "5' # [k]u-it-ma-an-aš-ma x [",
        result: tl(5, [w(ds, ht('k'), de, ht('u-it-ma-an-aš-ma')), w(ht('x')), w(ds)])
      });

    expect(parseTransliterationLine("6' # [n]a-aš-kán GIŠ.NÁ ["))
      .toEqual({
        transliterationLineInput: "6' # [n]a-aš-kán GIŠ.NÁ [",
        result: tl(6, [w(ds, ht('n'), de, ht('a-aš-kán')), w(sg('GIŠ.NÁ')), w(ds)])
      });

    expect(parseTransliterationLine("7' # [nu-u]š-ši ša-aš-t[a-"))
      .toEqual({
        transliterationLineInput: "7' # [nu-u]š-ši ša-aš-t[a-",
        result: tl(7, [w(ds, ht('nu-u'), de, ht('š-ši')), w(ht('ša-aš-t'), ds, ht('a-'))])
      });

    expect(parseTransliterationLine("8' # [da?]-⸢a?⸣ nu-uš-ši x ["))
      .toEqual({
        transliterationLineInput: "8' # [da?]-⸢a?⸣ nu-uš-ši x [",
        result: tl(8, [w(ds, ht('da'), uc, de, ht('-'), ls, ht('a'), uc, le), w(ht('nu-uš-ši')), w(ht('x')), w(ds)])
      });

    expect(parseTransliterationLine("9' # [nu-u]š-ši im-ma(-)["))
      .toEqual({
        transliterationLineInput: "9' # [nu-u]š-ši im-ma(-)[",
        result: tl(9, [w(ds, ht('nu-u'), de, ht('š-ši')), w(ht('im-ma'), us, ht('-'), ue, ds)])
      });

    expect(parseTransliterationLine("10' # [x-x]-TE°MEŠ° ⸢e⸣-["))
      .toEqual({
        transliterationLineInput: "10' # [x-x]-TE°MEŠ° ⸢e⸣-[",
        result: tl(10, [w(ds, ht('x-x'), de, ag('TE'), dt('MEŠ')), w(ls, ht('e'), le, ht('-'), ds)])
      });

    expect(parseTransliterationLine("11' # [x (x)]-ri-⸢ia⸣-[ ¬¬¬"))
      .toEqual({
        transliterationLineInput: "11' # [x (x)]-ri-⸢ia⸣-[ ¬¬¬",
        result: tl(11, [w(ds, ht('x')), w(us, ht('x'), ue, de, ht('-ri-'), ls, ht('ia'), le, ht('-'), ds), w(pe)])
      });

    expect(parseTransliterationLine("12' # [x x] x ["))
      .toEqual({
        transliterationLineInput: "12' # [x x] x [",
        result: tl(12, [w(ds, ht('x')), w(ht('x'), de), w(ht('x')), w(ds)])
      });

    expect(parseTransliterationLine("$ Bo 2019/2 # KBo 71.90"))
      .toEqual({transliterationLineInput: "$ Bo 2019/2 # KBo 71.90"});

    expect(parseTransliterationLine("1' # [ … ] x ¬¬¬"))
      .toEqual({
        transliterationLineInput: "1' # [ … ] x ¬¬¬",
        result: tl(1, [w(ds), w(el), w(de), w(ht('x')), w(pe)])
      });

    expect(parseTransliterationLine("2' # [ … °MUNUS.MEŠ°zi-i]n-tu-ḫi-e-eš"))
      .toEqual({
        transliterationLineInput: "2' # [ … °MUNUS.MEŠ°zi-i]n-tu-ḫi-e-eš",
        result: tl(2, [w(ds), w(el), w(dt('MUNUS.MEŠ'), ht('zi-i'), de, ht('n-tu-ḫi-e-eš'))])
      });

    expect(parseTransliterationLine("3' # [ … -i]a-u-an-zi tar-kum-mi-ia-iz-zi ¬¬¬"))
      .toEqual({
        transliterationLineInput: "3' # [ … -i]a-u-an-zi tar-kum-mi-ia-iz-zi ¬¬¬",
        result: tl(3, [w(ds), w(el), w(ht('-i'), de, ht('a-u-an-zi')), w(ht('tar-kum-mi-ia-iz-zi')), w(pe)])
      });

    expect(parseTransliterationLine("4' # [ … °G]IŠ°BANŠUR °GIŠ°BANŠUR an-da"))
      .toEqual({
        transliterationLineInput: "4' # [ … °G]IŠ°BANŠUR °GIŠ°BANŠUR an-da"
        /* , result: tl(4, [ds, ' ', el, ' ', '°G]IŠ°BANŠUR', ' ', '°GIŠ°BANŠUR', ' ', 'an-da']) */
      });

    expect(parseTransliterationLine("5' # [ … ] ⸢6⸣ NINDA.GUR₄.RA°ḪI.A° ki-an-da"))
      .toEqual({
        transliterationLineInput: "5' # [ … ] ⸢6⸣ NINDA.GUR₄.RA°ḪI.A° ki-an-da",
        result: tl(5, [w(ds), w(el), w(de), w(ls, nc('6'), le), w(sg('NINDA.GUR'), nc('4', true), sg('.RA'), dt('ḪI.A')), w(ht('ki-an-da'))])
      });

    expect(parseTransliterationLine("6' # [ … -t]i-ia še-er pé-ra-an da-a-i ¬¬¬"))
      .toEqual({
        transliterationLineInput: "6' # [ … -t]i-ia še-er pé-ra-an da-a-i ¬¬¬",
        result: tl(6, [w(ds), w(el), w(ht('-t'), de, ht('i-ia')), w(ht('še-er')), w(ht('pé-ra-an')), w(ht('da-a-i')), w(pe)])
      });

    expect(parseTransliterationLine("7' # [ … pé-r]a-an ḫu-u-wa-a-i"))
      .toEqual({
        transliterationLineInput: "7' # [ … pé-r]a-an ḫu-u-wa-a-i",
        result: tl(7, [w(ds), w(el), w(ht('pé-r'), de, ht('a-an')), w(ht('ḫu-u-wa-a-i'))])
      });

    expect(parseTransliterationLine("8' # [ … °MUNUS.MEŠ°zi]-⸢in-tu-ḫi⸣-e-eš an-da {Rasur}"))
      .toEqual({
        transliterationLineInput: "8' # [ … °MUNUS.MEŠ°zi]-⸢in-tu-ḫi⸣-e-eš an-da {Rasur}"
        /*        , result: tl(8, [ds, ' ', el, ' ', sg('MUNUS.MEŠ'), 'zi', de, '-', ls, 'in-tu-ḫi', le, '-e-eš', ' ', 'an-da', ' {Rasur}'])*/
      });

    expect(parseTransliterationLine("9' # [ú-wa-an-zi … k]i?-an-ta ¬¬¬"))
      .toEqual({
        transliterationLineInput: "9' # [ú-wa-an-zi … k]i?-an-ta ¬¬¬",
        result: tl(9, [w(ds, ht('ú-wa-an-zi')), w(el), w(ht('k'), de, ht('i'), uc, ht('-an-ta')), w(pe)])
      });

    expect(parseTransliterationLine("10' # [ … ] x-zi ¬¬¬"))
      .toEqual({
        transliterationLineInput: "10' # [ … ] x-zi ¬¬¬",
        result: tl(10, [w(ds), w(el), w(de), w(ht('x-zi')), w(pe)])
      });

    expect(parseTransliterationLine("11' # [ … ]-da"))
      .toEqual({
        transliterationLineInput: "11' # [ … ]-da",
        result: tl(11, [w(ds), w(el), w(de, ht('-da'))])
      });

    expect(parseTransliterationLine("12' # [ … °LÚ°ALAM.Z]U₉"))
      .toEqual({
        transliterationLineInput: "12' # [ … °LÚ°ALAM.Z]U₉",
        result: tl(12, [w(ds), w(el), w(dt('LÚ'), sg('ALAM.Z'), de, sg('U'), nc('9', true))])
      });

    expect(parseTransliterationLine("13' # [ … -z]i ¬¬¬"))
      .toEqual({
        transliterationLineInput: "13' # [ … -z]i ¬¬¬",
        result: tl(13, [w(ds), w(el), w(ht('-z'), de, ht('i')), w(pe)])
      });

    expect(parseTransliterationLine("%r. Kol."))
      .toEqual({transliterationLineInput: "%r. Kol."});


    expect(parseTransliterationLine("1' # [x x] x x [ ¬¬¬"))
      .toEqual({
        transliterationLineInput: "1' # [x x] x x [ ¬¬¬",
        result: tl(1, [w(ds, ht('x')), w(ht('x'), de), w(ht('x')), w(ht('x')), w(ds), w(pe)])
      });

    expect(parseTransliterationLine("2' # LUGAL-uš GUB-[aš"))
      .toEqual({
        transliterationLineInput: "2' # LUGAL-uš GUB-[aš",
        result: tl(2, [w(sg('LUGAL'), ht('-uš')), w(sg('GUB'), ht('-'), ds, ht('aš'))])
      });

    expect(parseTransliterationLine("3' # °D°UTU °D°U ⸢°D°⸣["))
      .toEqual({
        transliterationLineInput: "3' # °D°UTU °D°U ⸢°D°⸣[",
        result: tl(3, [w(dt('D'), sg('UTU')), w(dt('D'), sg('U')), w(ls, dt('D'), le, ds)])
      });

    expect(parseTransliterationLine("4' # °D°zi-in-t[u-ḫi ¬¬¬"))
      .toEqual({
        transliterationLineInput: "4' # °D°zi-in-t[u-ḫi ¬¬¬",
        result: tl(4, [w(dt('D'), ht('zi-in-t'), ds, ht('u-ḫi')), w(pe)])
      });

    expect(parseTransliterationLine("5' # °LÚ°SAGI.A 1 NINDA.G[UR₄.RA _EM-ṢA]"))
      .toEqual({
        transliterationLineInput: "5' # °LÚ°SAGI.A 1 NINDA.G[UR₄.RA _EM-ṢA]",
        result: tl(5, [w(dt('LÚ'), sg('SAGI.A')), w(nc('1')), w(sg('NINDA.G'), ds, sg('UR'), nc('4', true), sg('.RA')), w(ag('EM-ṢA'), de)])
      });

    expect(parseTransliterationLine("6' # LUGAL-i pa-a-i LUGAL-u[š pár-ši-ia] ¬¬¬"))
      .toEqual({
        transliterationLineInput: "6' # LUGAL-i pa-a-i LUGAL-u[š pár-ši-ia] ¬¬¬",
        result: tl(6, [w(sg('LUGAL'), ht('-i')), w(ht('pa-a-i')), w(sg('LUGAL'), ht('-u'), ds, ht('š')), w(ht('pár-ši-ia'), de), w(pe)])
      });

    expect(parseTransliterationLine("7' # ta-aš-ta °MUNUS.MEŠ°zi-[in-tu-ḫi-e-eš"))
      .toEqual({
        transliterationLineInput: "7' # ta-aš-ta °MUNUS.MEŠ°zi-[in-tu-ḫi-e-eš",
        result: tl(7, [w(ht('ta-aš-ta')), w(dt('MUNUS.MEŠ'), ht('zi-'), ds, ht('in-tu-ḫi-e-eš'))])
      });

    expect(parseTransliterationLine("8' # pa-ra-a [ ¬¬¬"))
      .toEqual({
        transliterationLineInput: "8' # pa-ra-a [ ¬¬¬",
        result: tl(8, [w(ht('pa-ra-a')), w(ds), w(pe)])
      });

    expect(parseTransliterationLine("9' # pár-aš-na-a-u-<aš>-kán °LÚ°SAG[I.A ¬¬¬"))
      .toEqual({
        transliterationLineInput: "9' # pár-aš-na-a-u-<aš>-kán °LÚ°SAG[I.A ¬¬¬",
        result: tl(9, [w(ht('pár-aš-na-a-u-'), supS, ht('aš'), supE, ht('-kán')), w(dt('LÚ'), sg('SAG'), ds, sg('I.A')), w(pe)])
      });

    expect(parseTransliterationLine("10' # LUGAL-uš TUŠ-aš <°D°>iz-zi-i[š?-ta?-nu?"))
      .toEqual({
        transliterationLineInput: "10' # LUGAL-uš TUŠ-aš <°D°>iz-zi-i[š?-ta?-nu?",
        result: tl(10, [w(sg('LUGAL'), ht('-uš')), w(sg('TUŠ'), ht('-aš')), w(supS, dt('D'), supE, ht('iz-zi-i'), ds, ht('š'), uc, ht('-ta'), uc, ht('-nu'), uc)])
      });

    expect(parseTransliterationLine("11' # e-ku-zi GIŠ ⸢°D°⸣[INANNA ¬¬¬"))
      .toEqual({
        transliterationLineInput: "11' # e-ku-zi GIŠ ⸢°D°⸣[INANNA ¬¬¬",
        result: tl(11, [w(ht('e-ku-zi')), w(sg('GIŠ')), w(ls, dt('D'), le, ds, sg('INANNA')), w(pe)])
      });

    expect(parseTransliterationLine("12' # °LÚ°SAGI.A [1 NINDA.GUR₄.RA EM-ṢA]"))
      .toEqual({
        transliterationLineInput: "12' # °LÚ°SAGI.A [1 NINDA.GUR₄.RA EM-ṢA]",
        result: tl(12, [w(dt('LÚ'), sg('SAGI.A')), w(ds, nc('1')), w(sg('NINDA.GUR'), nc('4', true), sg('.RA')), w(sg('EM'), ag('ṢA'), de)])
      });

    expect(parseTransliterationLine("13' # LUGAL-i pa-a-i [LUGAL-uš pár-ši-ia] ¬¬¬"))
      .toEqual({
        transliterationLineInput: "13' # LUGAL-i pa-a-i [LUGAL-uš pár-ši-ia] ¬¬¬",
        result: tl(13, [w(sg('LUGAL'), ht('-i')), w(ht('pa-a-i')), w(ds, sg('LUGAL'), ht('-uš')), w(ht('pár-ši-ia'), de), w(pe)])
      });

    expect(parseTransliterationLine("14' # GAL DUMU.MEŠ ⸢É⸣.[GAL"))
      .toEqual({
        transliterationLineInput: "14' # GAL DUMU.MEŠ ⸢É⸣.[GAL",
        result: tl(14, [w(sg('GAL')), w(sg('DUMU.MEŠ')), w(ls, sg('É'), le, sg('.'), ds, sg('GAL'))])
      });

    expect(parseTransliterationLine("15' # °LÚ.MEŠ°GA[LA ¬¬¬"))
      .toEqual({
        transliterationLineInput: "15' # °LÚ.MEŠ°GA[LA ¬¬¬",
        result: tl(15, [w(dt('LÚ.MEŠ'), sg('GA'), ds, sg('LA')), w(pe)])
      });

    expect(parseTransliterationLine("16' # ⸢na-aš⸣-k[án"))
      .toEqual({
        transliterationLineInput: "16' # ⸢na-aš⸣-k[án",
        result: tl(16, [w(ls, ht('na-aš'), le, ht('-k'), ds, ht('án'))])
      });

    expect(parseTransliterationLine("$ Bo 2019/5 # KBo 71.95"))
      .toEqual({transliterationLineInput: "$ Bo 2019/5 # KBo 71.95"});

    expect(parseTransliterationLine("@Akk"))
      .toEqual({transliterationLineInput: "@Akk"});

    expect(parseTransliterationLine("%Vs."))
      .toEqual({transliterationLineInput: "%Vs."});
    expect(parseTransliterationLine("1 # a-na ša ki-ma | i-a-tí | ù! ku-li"))
      .toEqual({
        transliterationLineInput: "1 # a-na ša ki-ma | i-a-tí | ù! ku-li",
        /*        result: tl(1, ['a-na', ' ', 'ša', ' ', 'ki-ma', ' ', '|', ' ', 'i-a-tí', ' ', '|', ' ', 'ù', '!', ' ', 'ku-li'], true)*/
      });

    expect(parseTransliterationLine("2 # a-na ku-li | qí-bi₄-ma | um-ma"))
      .toEqual({transliterationLineInput: "2 # a-na ku-li | qí-bi₄-ma | um-ma"});

    expect(parseTransliterationLine("3 # a-šùr-e-na-ma 2 MA.NA 2 ⅔ GÍN"))
      .toEqual({transliterationLineInput: "3 # a-šùr-e-na-ma 2 MA.NA 2 ⅔ GÍN"});

    expect(parseTransliterationLine("4 # KÙ.BABBAR | ša li-bi₄-kà | ša a-na MU 1.[ŠÈ]"))
      .toEqual({transliterationLineInput: "4 # KÙ.BABBAR | ša li-bi₄-kà | ša a-na MU 1.[ŠÈ]"});

    expect(parseTransliterationLine("5 # ša-qá-lìm | qá-bi₄-a-tí-ni"))
      .toEqual({transliterationLineInput: "5 # ša-qá-lìm | qá-bi₄-a-tí-ni"});

    expect(parseTransliterationLine("6 # ITI 1°KAM° | ku-zal-li | li-mu-um"))
      .toEqual({transliterationLineInput: "6 # ITI 1°KAM° | ku-zal-li | li-mu-um"});

    expect(parseTransliterationLine("7 # am-ri-iš₈-tár DUMU ma-num-ba-lúm-a-šùr"))
      .toEqual({
        transliterationLineInput: "7 # am-ri-iš₈-tár DUMU ma-num-ba-lúm-a-šùr",
        result: tl(7, [w(ht('am-ri-iš'), nc('8', true), ht('-tár')), w(sg('DUMU')), w(ht('ma-num-ba-lúm-a-šùr'))], true)
      });

    expect(parseTransliterationLine("8 # i-na ṭup-pì-kà | a-šùr-mu-da-mì-i[q]"))
      .toEqual({transliterationLineInput: "8 # i-na ṭup-pì-kà | a-šùr-mu-da-mì-i[q]"});

    expect(parseTransliterationLine("9 # DUMU sá-ak-lá-nim | ⸢ú e⸣-dí-na-a"))
      .toEqual({transliterationLineInput: "9 # DUMU sá-ak-lá-nim | ⸢ú e⸣-dí-na-a"});

    expect(parseTransliterationLine("10 # [DU]MU a-a-a | kà-an-ku-ni 1 GÍN KÙ.BABBAR"))
      .toEqual({transliterationLineInput: "10 # [DU]MU a-a-a | kà-an-ku-ni 1 GÍN KÙ.BABBAR"});

    expect(parseTransliterationLine("11 # lá tù-qá-ri-ba-am"))
      .toEqual({
        transliterationLineInput: "11 # lá tù-qá-ri-ba-am",
        result: tl(11, [w(ht('lá')), w(ht('tù-qá-ri-ba-am'))], true)
      });

    expect(parseTransliterationLine("12 # i-na °d°UTU-ši na-áš-pì-ir-⸢tí⸣"))
      .toEqual({
        transliterationLineInput: "12 # i-na °d°UTU-ši na-áš-pì-ir-⸢tí⸣",
        result: tl(12, [w(ht('i-na')), w(ml('d'), sg('UTU'), ht('-ši')), w(ht('na-áš-pì-ir-'), ls, ht('tí'), le)], true)
      });

    expect(parseTransliterationLine("%u. Rd."))
      .toEqual({transliterationLineInput: "%u. Rd."});

    expect(parseTransliterationLine("13 # ta-ša-me-{Rasur}⸢ú⸣"))
      .toEqual({transliterationLineInput: "13 # ta-ša-me-{Rasur}⸢ú⸣"});

    expect(parseTransliterationLine("14 # x x x x x ["))
      .toEqual({
        transliterationLineInput: "14 # x x x x x [",
        result: tl(14, [w(ht('x')), w(ht('x')), w(ht('x')), w(ht('x')), w(ht('x')), w(ds)], true)
      });

    expect(parseTransliterationLine("$ Bo 2019/6 # KBo 71.93"))
      .toEqual({transliterationLineInput: "$ Bo 2019/6 # KBo 71.93"});

    expect(parseTransliterationLine("@Hit"))
      .toEqual({transliterationLineInput: "@Hit"});

    expect(parseTransliterationLine("1' # [ … ] x ["))
      .toEqual({
        transliterationLineInput: "1' # [ … ] x [",
        result: tl(1, [w(ds), w(el), w(de), w(ht('x')), w(ds)])
      });

    expect(parseTransliterationLine("2' # [ … ] x x ["))
      .toEqual({
        transliterationLineInput: "2' # [ … ] x x [",
        result: tl(2, [w(ds), w(el), w(de), w(ht('x')), w(ht('x')), w(ds)])
      });

    expect(parseTransliterationLine("3' # [ … ] É x ["))
      .toEqual({
        transliterationLineInput: "3' # [ … ] É x [",
        result: tl(3, [w(ds), w(el), w(de), w(sg('É')), w(ht('x')), w(ds)])
      });
    expect(parseTransliterationLine("4' # [ … ] ⸢É⸣.GAL ["))
      .toEqual({
        transliterationLineInput: "4' # [ … ] ⸢É⸣.GAL [",
        result: tl(4, [w(ds), w(el), w(de), w(ls, sg('É'), le, sg('.GAL')), w(ds)])
      });
    expect(parseTransliterationLine("5' # [ … n]u DUMU-li ["))
      .toEqual({
        transliterationLineInput: "5' # [ … n]u DUMU-li [",
        result: tl(5, [w(ds), w(el), w(ht('n'), de, ht('u')), w(sg('DUMU'), ht('-li')), w(ds)])
      });

    expect(parseTransliterationLine("6' # [ … ] x x ["))
      .toEqual({
        transliterationLineInput: "6' # [ … ] x x [",
        result: tl(6, [w(ds), w(el), w(de), w(ht('x')), w(ht('x')), w(ds)])
      });
  });
});