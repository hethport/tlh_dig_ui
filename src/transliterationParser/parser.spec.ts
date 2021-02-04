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
import {akkadogramm as ag, determinativ as dt, hittite as ht, sumerogramm as sg} from "../model/stringContent";
import {numeralContent as nc} from "../model/numeralContent";
import {CorrectionType} from "../generated/graphql";

const el = CorrectionType.Ellipsis;
const pe = CorrectionType.ParagraphEnd;
const uc = CorrectionType.UnsureCorrection;

const awaited: TransliterationLineParseResult[] = [
    {
        transliterationLineInput: "1' # [(x)] x ⸢zi⸣ x [",
        result: tl(1, [w(ds, us, ht('x'), ue, de), w(ht('x')), w(ls, ht('zi'), le), w(ht('x')), w(ds)])
    },
    {
        transliterationLineInput: "2' # [DUMU?].MUNUS?-ma e-ša-⸢a⸣-[ri",
        result: tl(2, [
            w(ds, sg('DUMU'), uc, de, sg('.MUNUS'), uc, ht('-ma')),
            w(ht('e-ša-'), ls, ht('a'), le, ht('-'), ds, ht('ri'))])
    },
    {
        transliterationLineInput: "3' # az-zi-ik-ki-it-[tén",
        result: tl(3, [w(ht('az-zi-ik-ki-it-'), ds, ht('tén'))])
    },
    {
        transliterationLineInput: "4' # nu ḫu-u-ma-an az-[zi-ik-ki- ¬¬¬",
        result: tl(4, [w(ht('nu')), w(ht('ḫu-u-ma-an')), w(ht('az-'), ds, ht('zi-ik-ki-')), w(pe)])
    },
    {
        transliterationLineInput: "5' # [k]u-it-ma-an-aš-ma x [",
        result: tl(5, [w(ds, ht('k'), de, ht('u-it-ma-an-aš-ma')), w(ht('x')), w(ds)])
    },
    {
        transliterationLineInput: "6' # [n]a-aš-kán GIŠ.NÁ [",
        result: tl(6, [w(ds, ht('n'), de, ht('a-aš-kán')), w(sg('GIŠ.NÁ')), w(ds)])
    },
    {
        transliterationLineInput: "7' # [nu-u]š-ši ša-aš-t[a-",
        result: tl(7, [w(ds, ht('nu-u'), de, ht('š-ši')), w(ht('ša-aš-t'), ds, ht('a-'))])
    },
    {
        transliterationLineInput: "8' # [da?]-⸢a?⸣ nu-uš-ši x [",
        result: tl(8, [w(ds, ht('da'), uc, de, ht('-'), ls, ht('a'), uc, le), w(ht('nu-uš-ši')), w(ht('x')), w(ds)])
    },
    {
        transliterationLineInput: "9' # [nu-u]š-ši im-ma(-)[",
        result: tl(9, [w(ds, ht('nu-u'), de, ht('š-ši')), w(ht('im-ma'), us, ht('-'), ue, ds)])
    },
    {
        transliterationLineInput: "10' # [x-x]-TE°MEŠ° ⸢e⸣-[",
        result: tl(10, [w(ds, ht('x-x'), de, ht('-'), sg('TE'), dt('MEŠ')), w(ls, ht('e'), le, ht('-'), ds)])
    },
    {
        transliterationLineInput: "11' # [x (x)]-ri-⸢ia⸣-[ ¬¬¬",
        result: tl(11, [w(ds, ht('x')), w(us, ht('x'), ue, de, ht('-ri-'), ls, ht('ia'), le, ht('-'), ds), w(pe)])
    },
    {
        transliterationLineInput: "12' # [x x] x [",
        result: tl(12, [w(ds, ht('x')), w(ht('x'), de), w(ht('x')), w(ds)])
    },
    {transliterationLineInput: "$ Bo 2019/2 # KBo 71.90"},
    {
        transliterationLineInput: "1' # [ … ] x ¬¬¬",
        result: tl(1, [w(ds), w(el), w(de), w('x'), w(pe)])
    },
    {
        transliterationLineInput: "2' # [ … °MUNUS.MEŠ°zi-i]n-tu-ḫi-e-eš",
        result: tl(2, [w(ds), w(el), w(dt('MUNUS.MEŠ'), 'zi-i', de, 'n-tu-ḫi-e-eš')])
    },
    {
        transliterationLineInput: "3' # [ … -i]a-u-an-zi tar-kum-mi-ia-iz-zi ¬¬¬",
        result: tl(3, [w(ds), w(el), w('-i', de, 'a-u-an-zi'), w('tar-kum-mi-ia-iz-zi'), w(pe)])
    },
    {
        transliterationLineInput: "4' # [ … °G]IŠ°BANŠUR °GIŠ°BANŠUR an-da"
        /* , result: tl(4, [ds, ' ', el, ' ', '°G]IŠ°BANŠUR', ' ', '°GIŠ°BANŠUR', ' ', 'an-da']) */
    },
    {
        transliterationLineInput: "5' # [ … ] ⸢6⸣ NINDA.GUR₄.RA°ḪI.A° ki-an-da",
        result: tl(5, [w(ds), w(el), w(de), w(ls, nc('6'), le), w(sg('NINDA.GUR'), nc('4', true), sg('.RA'), dt('ḪI.A')), w('ki-an-da')])
    },
    {
        transliterationLineInput: "6' # [ … -t]i-ia še-er pé-ra-an da-a-i ¬¬¬",
        result: tl(6, [w(ds), w(el), w('-t', de, 'i-ia'), w('še-er'), w('pé-ra-an'), w('da-a-i'), w(pe)])
    },
    {
        transliterationLineInput: "7' # [ … pé-r]a-an ḫu-u-wa-a-i",
        result: tl(7, [w(ds), w(el), w('pé-r', de, 'a-an'), w('ḫu-u-wa-a-i')])
    },
    {
        transliterationLineInput: "8' # [ … °MUNUS.MEŠ°zi]-⸢in-tu-ḫi⸣-e-eš an-da {Rasur}"
        /*        , result: tl(8, [ds, ' ', el, ' ', sg('MUNUS.MEŠ'), 'zi', de, '-', ls, 'in-tu-ḫi', le, '-e-eš', ' ', 'an-da', ' {Rasur}'])*/
    },
    {
        transliterationLineInput: "9' # [ú-wa-an-zi … k]i?-an-ta ¬¬¬",
        result: tl(9, [w(ds, 'ú-wa-an-zi'), w(el), w('k', de, 'i', uc, '-an-ta'), w(pe)])
    },
    {
        transliterationLineInput: "10' # [ … ] x-zi ¬¬¬",
        result: tl(10, [w(ds), w(el), w(de), w('x-zi'), w(pe)])
    },
    {
        transliterationLineInput: "11' # [ … ]-da",
        result: tl(11, [w(ds), w(el), w(de, '-da')])
    },
    {
        transliterationLineInput: "12' # [ … °LÚ°ALAM.Z]U₉",
        result: tl(12, [w(ds), w(el), w(dt('LÚ'), sg('ALAM.Z'), de, sg('U'), nc('9', true))])
    },
    {
        transliterationLineInput: "13' # [ … -z]i ¬¬¬",
        result: tl(13, [w(ds), w(el), w('-z', de, 'i'), w(pe)])
    },
    {transliterationLineInput: "%r. Kol."},
    //{transliterationLineInput: "1' # [x x] x x [ ¬¬¬"},
    {
        transliterationLineInput: "2' # LUGAL-uš GUB-[aš",
        result: tl(2, [w(sg('LUGAL'), '-uš'), w(sg('GUB'), '-', ds, 'aš')])
    },
    {
        transliterationLineInput: "3' # °D°UTU °D°U ⸢°D°⸣[",
        result: tl(3, [w(dt('D'), sg('UTU')), w(dt('D'), sg('U')), w(ls, dt('D'), le, ds)])
    },
    {
        transliterationLineInput: "4' # °D°zi-in-t[u-ḫi ¬¬¬",
        result: tl(4, [w(dt('D'), 'zi-in-t', ds, 'u-ḫi'), w(pe)])
    },
    {
        transliterationLineInput: "5' # °LÚ°SAGI.A 1 NINDA.G[UR₄.RA _EM-ṢA]",
        result: tl(5, [w(dt('LÚ'), sg('SAGI.A')), w(nc('1')), w(sg('NINDA.G'), ds, sg('UR'), nc('4', true), sg('.RA')), w(ag('EM-ṢA'), de)])
    },
    {
        transliterationLineInput: "6' # LUGAL-i pa-a-i LUGAL-u[š pár-ši-ia] ¬¬¬",
        result: tl(6, [w(sg('LUGAL'), '-i'), w('pa-a-i'), w(sg('LUGAL'), '-u', ds, 'š'), w('pár-ši-ia', de), w(pe)])
    },
    {
        transliterationLineInput: "7' # ta-aš-ta °MUNUS.MEŠ°zi-[in-tu-ḫi-e-eš",
        result: tl(7, [w('ta-aš-ta'), w(dt('MUNUS.MEŠ'), 'zi-', ds, 'in-tu-ḫi-e-eš')])
    },
    {
        transliterationLineInput: "8' # pa-ra-a [ ¬¬¬",
        result: tl(8, [w('pa-ra-a'), w(ds), w(pe)])
    },
    {
        transliterationLineInput: "9' # pár-aš-na-a-u-<aš>-kán °LÚ°SAG[I.A ¬¬¬",
        result: tl(9, [w('pár-aš-na-a-u-', supS, 'aš', supE, '-kán'), w(dt('LÚ'), sg('SAG'), ds, sg('I.A')), w(pe)])
    },
    {
        transliterationLineInput: "10' # LUGAL-uš TUŠ-aš <°D°>iz-zi-i[š?-ta?-nu?",
        result: tl(10, [w(sg('LUGAL'), '-uš'), w(sg('TUŠ'), '-aš'), w(supS, dt('D'), supE, 'iz-zi-i', ds, 'š', uc, '-ta', uc, '-nu', uc)])
    },
    {
        transliterationLineInput: "11' # e-ku-zi GIŠ ⸢°D°⸣[INANNA ¬¬¬",
        result: tl(11, [w('e-ku-zi'), w(sg('GIŠ')), w(ls, dt('D'), le, ds, sg('INANNA')), w(pe)])
    },
    {
        transliterationLineInput: "12' # °LÚ°SAGI.A [1 NINDA.GUR₄.RA EM-ṢA]",
        result: tl(12, [w(dt('LÚ'), sg('SAGI.A')), w(ds, nc('1')), w(sg('NINDA.GUR'), nc('4', true), sg('.RA')), w(sg('EM'), '-', sg('ṢA'), de)])
    },
    {
        transliterationLineInput: "13' # LUGAL-i pa-a-i [LUGAL-uš pár-ši-ia] ¬¬¬",
        result: tl(13, [w(sg('LUGAL'), '-i'), w('pa-a-i'), w(ds, sg('LUGAL'), '-uš'), w('pár-ši-ia', de), w(pe)])
    },
    {
        transliterationLineInput: "14' # GAL DUMU.MEŠ ⸢É⸣.[GAL",
        result: tl(14, [w(sg('GAL')), w(sg('DUMU.MEŠ')), w(ls, sg('É'), le, sg('.'), ds, sg('GAL'))])
    },
    {
        transliterationLineInput: "15' # °LÚ.MEŠ°GA[LA ¬¬¬",
        result: tl(15, [w(dt('LÚ.MEŠ'), sg('GA'), ds, sg('LA')), w(pe)])
    },
    {
        transliterationLineInput: "16' # ⸢na-aš⸣-k[án",
        result: tl(16, [w(ls, 'na-aš', le, '-k', ds, 'án')])
    },
    /* ... */
    {transliterationLineInput: "$ Bo 2019/5 # KBo 71.95"},
    {transliterationLineInput: "@Akk"},
    {transliterationLineInput: "%Vs."},
    {
        transliterationLineInput: "1 # a-na ša ki-ma | i-a-tí | ù! ku-li",
        /*        result: tl(1, ['a-na', ' ', 'ša', ' ', 'ki-ma', ' ', '|', ' ', 'i-a-tí', ' ', '|', ' ', 'ù', '!', ' ', 'ku-li'], true)*/
    },
    {transliterationLineInput: "2 # a-na ku-li | qí-bi₄-ma | um-ma"},
    {transliterationLineInput: "3 # a-šùr-e-na-ma 2 MA.NA 2 ⅔ GÍN"},
    {transliterationLineInput: "4 # KÙ.BABBAR | ša li-bi₄-kà | ša a-na MU 1.[ŠÈ]"},
    {transliterationLineInput: "5 # ša-qá-lìm | qá-bi₄-a-tí-ni"},
    {transliterationLineInput: "6 # ITI 1°KAM° | ku-zal-li | li-mu-um"},
    {
        transliterationLineInput: "7 # am-ri-iš₈-tár DUMU ma-num-ba-lúm-a-šùr",
        result: tl(7, [w('am-ri-iš', nc('8', true), '-tár'), w(sg('DUMU')), w('ma-num-ba-lúm-a-šùr')], true)
    },
    {transliterationLineInput: "8 # i-na ṭup-pì-kà | a-šùr-mu-da-mì-i[q]"},
    {transliterationLineInput: "9 # DUMU sá-ak-lá-nim | ⸢ú e⸣-dí-na-a"},
    {transliterationLineInput: "10 # [DU]MU a-a-a | kà-an-ku-ni 1 GÍN KÙ.BABBAR"},
    {
        transliterationLineInput: "11 # lá tù-qá-ri-ba-am",
        result: tl(11, [w('lá'), w('tù-qá-ri-ba-am')], true)
    },
    {transliterationLineInput: "12 # i-na °d°UTU-ši na-áš-pì-ir-⸢tí⸣"},
    {transliterationLineInput: "%u. Rd."},
    {transliterationLineInput: "13 # ta-ša-me-{Rasur}⸢ú⸣"},
    {
        transliterationLineInput: "14 # x x x x x [",
        result: tl(14, [w('x'), w('x'), w('x'), w('x'), w('x'), w(ds)], true)
    },
    {transliterationLineInput: "$ Bo 2019/6 # KBo 71.93"},
    {transliterationLineInput: "@Hit"},
    {
        transliterationLineInput: "1' # [ … ] x [",
        result: tl(1, [w(ds), w(el), w(de), w('x'), w(ds)])
    },
    {
        transliterationLineInput: "2' # [ … ] x x [",
        result: tl(2, [w(ds), w(el), w(de), w('x'), w('x'), w(ds)])
    },
    {
        transliterationLineInput: "3' # [ … ] É x [",
        result: tl(3, [w(ds), w(el), w(de), w(sg('É')), w('x'), w(ds)])
    },
    {
        transliterationLineInput: "4' # [ … ] ⸢É⸣.GAL [",
        result: tl(4, [w(ds), w(el), w(de), w(ls, sg('É'), le, sg('.GAL')), w(ds)])
    },
    {
        transliterationLineInput: "5' # [ … n]u DUMU-li [",
        result: tl(5, [w(ds), w(el), w('n', de, 'u'), w(sg('DUMU'), '-li'), w(ds)])
    },
    {
        transliterationLineInput: "6' # [ … ] x x [",
        result: tl(6, [w(ds), w(el), w(de), w('x'), w('x'), w(ds)])
    }
]

describe('The transliteration parser', () => {

    it('should parse complete document', () => {
        awaited.forEach((tlpr) => {
            expect(parseTransliterationLine(tlpr.transliterationLineInput)).toEqual(tlpr);
        });
    });
});