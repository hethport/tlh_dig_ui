import {parseTransliterationLine, TransliterationLineParseResult} from './parser';
import {transliterationTextLine as tl, transliterationWord as w} from '../model/transliterationTextLine';
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
import {Akkadogramm as ag, Determinativ as dt, Sumerogramm as sg} from "../model/stringContent";
import {Ellipsis as el, ParagraphEnd as pe, UnsureCorrection as uc} from '../model/corrections';
import {NumeralContent as nc} from "../model/numeralContent";

const awaited: TransliterationLineParseResult[] = [
    {
        line: "1' # [(x)] x ⸢zi⸣ x [",
        result: tl(1, [w(ds, us, 'x', ue, de), w('x'), w(ls, 'zi', le), w('x'), w(ds)])
    },
    {
        line: "2' # [DUMU?].MUNUS?-ma e-ša-⸢a⸣-[ri",
        result: tl(2, [
            w(ds, sg('DUMU'), uc, de, sg('.MUNUS'), uc, '-ma'),
            w('e-ša-', ls, 'a', le, '-', ds, 'ri')])
    },
    {
        line: "3' # az-zi-ik-ki-it-[tén",
        result: tl(3, [w('az-zi-ik-ki-it-', ds, 'tén')])
    },
    {
        line: "4' # nu ḫu-u-ma-an az-[zi-ik-ki- ¬¬¬",
        result: tl(4, [w('nu'), w('ḫu-u-ma-an'), w('az-', ds, 'zi-ik-ki-'), w(pe)])
    },
    {
        line: "5' # [k]u-it-ma-an-aš-ma x [",
        result: tl(5, [w(ds, 'k', de, 'u-it-ma-an-aš-ma'), w('x'), w(ds)])
    },
    {
        line: "6' # [n]a-aš-kán GIŠ.NÁ [",
        result: tl(6, [w(ds, 'n', de, 'a-aš-kán'), w(sg('GIŠ.NÁ')), w(ds)])
    },
    {
        line: "7' # [nu-u]š-ši ša-aš-t[a-",
        result: tl(7, [w(ds, 'nu-u', de, 'š-ši'), w('ša-aš-t', ds, 'a-')])
    },
    {
        line: "8' # [da?]-⸢a?⸣ nu-uš-ši x [",
        result: tl(8, [w(ds, 'da', uc, de, '-', ls, 'a', uc, le), w('nu-uš-ši'), w('x'), w(ds)])
    },
    {
        line: "9' # [nu-u]š-ši im-ma(-)[",
        result: tl(9, [w(ds, 'nu-u', de, 'š-ši'), w('im-ma', us, '-', ue, ds)])
    },
    {
        line: "10' # [x-x]-TE°MEŠ° ⸢e⸣-[",
        result: tl(10, [w(ds, 'x-x', de, '-', sg('TE'), dt('MEŠ')), w(ls, 'e', le, '-', ds)])
    },
    {
        line: "11' # [x (x)]-ri-⸢ia⸣-[ ¬¬¬",
        result: tl(11, [w(ds, 'x'), w(us, 'x', ue, de, '-ri-', ls, 'ia', le, '-', ds), w(pe)])
    },
    {
        line: "12' # [x x] x [",
        result: tl(12, [w(ds, 'x'), w('x', de), w('x'), w(ds)])
    },
    {line: "$ Bo 2019/2 # KBo 71.90"},
    {
        line: "1' # [ … ] x ¬¬¬",
        result: tl(1, [w(ds), w(el), w(de), w('x'), w(pe)])
    },
    {
        line: "2' # [ … °MUNUS.MEŠ°zi-i]n-tu-ḫi-e-eš",
        result: tl(2, [w(ds), w(el), w(dt('MUNUS.MEŠ'), 'zi-i', de, 'n-tu-ḫi-e-eš')])
    },
    {
        line: "3' # [ … -i]a-u-an-zi tar-kum-mi-ia-iz-zi ¬¬¬",
        result: tl(3, [w(ds), w(el), w('-i', de, 'a-u-an-zi'), w('tar-kum-mi-ia-iz-zi'), w(pe)])
    },
    {
        line: "4' # [ … °G]IŠ°BANŠUR °GIŠ°BANŠUR an-da"
        /* , result: tl(4, [ds, ' ', el, ' ', '°G]IŠ°BANŠUR', ' ', '°GIŠ°BANŠUR', ' ', 'an-da']) */
    },
    {
        line: "5' # [ … ] ⸢6⸣ NINDA.GUR₄.RA°ḪI.A° ki-an-da",
        result: tl(5, [w(ds), w(el), w(de), w(ls, nc('6'), le), w(sg('NINDA.GUR'), nc('4', true), sg('.RA'), dt('ḪI.A')), w('ki-an-da')])
    },
    {
        line: "6' # [ … -t]i-ia še-er pé-ra-an da-a-i ¬¬¬",
        result: tl(6, [w(ds), w(el), w('-t', de, 'i-ia'), w('še-er'), w('pé-ra-an'), w('da-a-i'), w(pe)])
    },
    {
        line: "7' # [ … pé-r]a-an ḫu-u-wa-a-i",
        result: tl(7, [w(ds), w(el), w('pé-r', de, 'a-an'), w('ḫu-u-wa-a-i')])
    },
    {
        line: "8' # [ … °MUNUS.MEŠ°zi]-⸢in-tu-ḫi⸣-e-eš an-da {Rasur}"
        /*        , result: tl(8, [ds, ' ', el, ' ', sg('MUNUS.MEŠ'), 'zi', de, '-', ls, 'in-tu-ḫi', le, '-e-eš', ' ', 'an-da', ' {Rasur}'])*/
    },
    {
        line: "9' # [ú-wa-an-zi … k]i?-an-ta ¬¬¬",
        result: tl(9, [w(ds, 'ú-wa-an-zi'), w(el), w('k', de, 'i', uc, '-an-ta'), w(pe)])
    },
    {
        line: "10' # [ … ] x-zi ¬¬¬",
        result: tl(10, [w(ds), w(el), w(de), w('x-zi'), w(pe)])
    },
    {
        line: "11' # [ … ]-da",
        result: tl(11, [w(ds), w(el), w(de, '-da')])
    },
    {
        line: "12' # [ … °LÚ°ALAM.Z]U₉",
        result: tl(12, [w(ds), w(el), w(dt('LÚ'), sg('ALAM.Z'), de, sg('U'), nc('9', true))])
    },
    {
        line: "13' # [ … -z]i ¬¬¬",
        result: tl(13, [w(ds), w(el), w('-z', de, 'i'), w(pe)])
    },
    {line: "%r. Kol."},
    //{line: "1' # [x x] x x [ ¬¬¬"},
    {
        line: "2' # LUGAL-uš GUB-[aš",
        result: tl(2, [w(sg('LUGAL'), '-uš'), w(sg('GUB'), '-', ds, 'aš')])
    },
    {
        line: "3' # °D°UTU °D°U ⸢°D°⸣[",
        result: tl(3, [w(dt('D'), sg('UTU')), w(dt('D'), sg('U')), w(ls, dt('D'), le, ds)])
    },
    {
        line: "4' # °D°zi-in-t[u-ḫi ¬¬¬",
        result: tl(4, [w(dt('D'), 'zi-in-t', ds, 'u-ḫi'), w(pe)])
    },
    {
        line: "5' # °LÚ°SAGI.A 1 NINDA.G[UR₄.RA _EM-ṢA]",
        result: tl(5, [w(dt('LÚ'), sg('SAGI.A')), w(nc('1')), w(sg('NINDA.G'), ds, sg('UR'), nc('4', true), sg('.RA')), w(ag('EM-ṢA'), de)])
    },
    {
        line: "6' # LUGAL-i pa-a-i LUGAL-u[š pár-ši-ia] ¬¬¬",
        result: tl(6, [w(sg('LUGAL'), '-i'), w('pa-a-i'), w(sg('LUGAL'), '-u', ds, 'š'), w('pár-ši-ia', de), w(pe)])
    },
    {
        line: "7' # ta-aš-ta °MUNUS.MEŠ°zi-[in-tu-ḫi-e-eš",
        result: tl(7, [w('ta-aš-ta'), w(dt('MUNUS.MEŠ'), 'zi-', ds, 'in-tu-ḫi-e-eš')])
    },
    {
        line: "8' # pa-ra-a [ ¬¬¬",
        result: tl(8, [w('pa-ra-a'), w(ds), w(pe)])
    },
    {
        line: "9' # pár-aš-na-a-u-<aš>-kán °LÚ°SAG[I.A ¬¬¬",
        result: tl(9, [w('pár-aš-na-a-u-', supS, 'aš', supE, '-kán'), w(dt('LÚ'), sg('SAG'), ds, sg('I.A')), w(pe)])
    },
    {
        line: "10' # LUGAL-uš TUŠ-aš <°D°>iz-zi-i[š?-ta?-nu?",
        result: tl(10, [w(sg('LUGAL'), '-uš'), w(sg('TUŠ'), '-aš'), w(supS, dt('D'), supE, 'iz-zi-i', ds, 'š', uc, '-ta', uc, '-nu', uc)])
    },
    {
        line: "11' # e-ku-zi GIŠ ⸢°D°⸣[INANNA ¬¬¬",
        result: tl(11, [w('e-ku-zi'), w(sg('GIŠ')), w(ls, dt('D'), le, ds, sg('INANNA')), w(pe)])
    },
    {
        line: "12' # °LÚ°SAGI.A [1 NINDA.GUR₄.RA EM-ṢA]",
        result: tl(12, [w(dt('LÚ'), sg('SAGI.A')), w(ds, nc('1')), w(sg('NINDA.GUR'), nc('4', true), sg('.RA')), w(sg('EM'), '-', sg('ṢA'), de)])
    },
    {
        line: "13' # LUGAL-i pa-a-i [LUGAL-uš pár-ši-ia] ¬¬¬",
        result: tl(13, [w(sg('LUGAL'), '-i'), w('pa-a-i'), w(ds, sg('LUGAL'), '-uš'), w('pár-ši-ia', de), w(pe)])
    },
    {
        line: "14' # GAL DUMU.MEŠ ⸢É⸣.[GAL",
        result: tl(14, [w(sg('GAL')), w(sg('DUMU.MEŠ')), w(ls, sg('É'), le, sg('.'), ds, sg('GAL'))])
    },
    {
        line: "15' # °LÚ.MEŠ°GA[LA ¬¬¬",
        result: tl(15, [w(dt('LÚ.MEŠ'), sg('GA'), ds, sg('LA')), w(pe)])
    },
    {
        line: "16' # ⸢na-aš⸣-k[án",
        result: tl(16, [w(ls, 'na-aš', le, '-k', ds, 'án')])
    },
    /* ... */
    {line: "$ Bo 2019/5 # KBo 71.95"},
    {line: "@Akk"},
    {line: "%Vs."},
    {
        line: "1 # a-na ša ki-ma | i-a-tí | ù! ku-li",
        /*        result: tl(1, ['a-na', ' ', 'ša', ' ', 'ki-ma', ' ', '|', ' ', 'i-a-tí', ' ', '|', ' ', 'ù', '!', ' ', 'ku-li'], true)*/
    },
    {line: "2 # a-na ku-li | qí-bi₄-ma | um-ma"},
    {line: "3 # a-šùr-e-na-ma 2 MA.NA 2 ⅔ GÍN"},
    {line: "4 # KÙ.BABBAR | ša li-bi₄-kà | ša a-na MU 1.[ŠÈ]"},
    {line: "5 # ša-qá-lìm | qá-bi₄-a-tí-ni"},
    {line: "6 # ITI 1°KAM° | ku-zal-li | li-mu-um"},
    {
        line: "7 # am-ri-iš₈-tár DUMU ma-num-ba-lúm-a-šùr",
        result: tl(7, [w('am-ri-iš', nc('8', true), '-tár'), w(sg('DUMU')), w('ma-num-ba-lúm-a-šùr')], true)
    },
    {line: "8 # i-na ṭup-pì-kà | a-šùr-mu-da-mì-i[q]"},
    {line: "9 # DUMU sá-ak-lá-nim | ⸢ú e⸣-dí-na-a"},
    {line: "10 # [DU]MU a-a-a | kà-an-ku-ni 1 GÍN KÙ.BABBAR"},
    {
        line: "11 # lá tù-qá-ri-ba-am",
        result: tl(11, [w('lá'), w('tù-qá-ri-ba-am')], true)
    },
    {line: "12 # i-na °d°UTU-ši na-áš-pì-ir-⸢tí⸣"},
    {line: "%u. Rd."},
    {line: "13 # ta-ša-me-{Rasur}⸢ú⸣"},
    {
        line: "14 # x x x x x [",
        result: tl(14, [w('x'), w('x'), w('x'), w('x'), w('x'), w(ds)], true)
    },
    {line: "$ Bo 2019/6 # KBo 71.93"},
    {line: "@Hit"},
    {
        line: "1' # [ … ] x [",
        result: tl(1, [w(ds), w(el), w(de), w('x'), w(ds)])
    },
    {
        line: "2' # [ … ] x x [",
        result: tl(2, [w(ds), w(el), w(de), w('x'), w('x'), w(ds)])
    },
    {
        line: "3' # [ … ] É x [",
        result: tl(3, [w(ds), w(el), w(de), w(sg('É')), w('x'), w(ds)])
    },
    {
        line: "4' # [ … ] ⸢É⸣.GAL [",
        result: tl(4, [w(ds), w(el), w(de), w(ls, sg('É'), le, sg('.GAL')), w(ds)])
    },
    {
        line: "5' # [ … n]u DUMU-li [",
        result: tl(5, [w(ds), w(el), w('n', de, 'u'), w(sg('DUMU'), '-li'), w(ds)])
    },
    {
        line: "6' # [ … ] x x [",
        result: tl(6, [w(ds), w(el), w(de), w('x'), w('x'), w(ds)])
    }
]

describe('The transliteration parser', () => {

    it('should parse complete document', () => {
        awaited.forEach((tlpr) => {
            expect(parseTransliterationLine(tlpr.line)).toEqual(tlpr);
        });
    });
});