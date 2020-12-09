import {parseTransliterationLine, TransliterationLineParseResult} from './parser';
import {TransliterationTextLine as tl} from '../model/transliterationTextLine';
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
import {Sumerogramm as sg} from "../model/sumerogramm";
import {Akkadogramm as ag} from "../model/akkadogramm";
import {Determinativ as dt} from "../model/determinativ";
import {Ellipsis as el, ParagraphEnd as pe, UnsureCorrection as uc} from '../model/corrections';
import {NumeralContent as nc} from "../model/numeralContent";

const awaited: TransliterationLineParseResult[] = [
    {
        line: "1' # [(x)] x ⸢zi⸣ x [",
        result: tl(1, [ds, us, 'x', ue, de, ' ', 'x', ' ', ls, 'zi', le, ' ', 'x', ' ', ds])
    },
    {
        line: "2' # [DUMU?].MUNUS?-ma e-ša-⸢a⸣-[ri",
        result: tl(2, [ds, sg('DUMU'), uc, de, sg('.MUNUS'), uc, '-ma', ' ', 'e-ša-', ls, 'a', le, '-', ds, 'ri'])
    },
    {
        line: "3' # az-zi-ik-ki-it-[tén",
        result: tl(3, ['az-zi-ik-ki-it-', ds, 'tén'])
    },
    {
        line: "4' # nu ḫu-u-ma-an az-[zi-ik-ki- ¬¬¬",
        result: tl(4, ['nu', ' ', 'ḫu-u-ma-an', ' ', 'az-', ds, 'zi-ik-ki-', ' ', pe])
    },
    {
        line: "5' # [k]u-it-ma-an-aš-ma x [",
        result: tl(5, [ds, 'k', de, 'u-it-ma-an-aš-ma', ' ', 'x', ' ', ds])
    },
    {
        line: "6' # [n]a-aš-kán GIŠ.NÁ [",
        result: tl(6, [ds, 'n', de, 'a-aš-kán', ' ', sg('GIŠ.NÁ'), ' ', ds])
    },
    {
        line: "7' # [nu-u]š-ši ša-aš-t[a-",
        result: tl(7, [ds, 'nu-u', de, 'š-ši', ' ', 'ša-aš-t', ds, 'a-'])
    },
    {
        line: "8' # [da?]-⸢a?⸣ nu-uš-ši x [",
        result: tl(8, [ds, 'da', uc, de, '-', ls, 'a', uc, le, ' ', 'nu-uš-ši', ' ', 'x', ' ', ds])
    },
    {
        line: "9' # [nu-u]š-ši im-ma(-)[",
        result: tl(9, [ds, 'nu-u', de, 'š-ši', ' ', 'im-ma', us, '-', ue, ds])
    },
    {
        line: "10' # [x-x]-TE°MEŠ° ⸢e⸣-[",
        result: tl(10, [ds, 'x-x', de, '-', sg('TE'), dt('MEŠ'), ' ', ls, 'e', le, '-', ds])
    },
    {
        line: "11' # [x (x)]-ri-⸢ia⸣-[ ¬¬¬",
        result: tl(11, [ds, 'x', ' ', us, 'x', ue, de, '-ri-', ls, 'ia', le, '-', ds, ' ', pe])
    },
    {
        line: "12' # [x x] x [",
        result: tl(12, [ds, 'x', ' ', 'x', de, ' ', 'x', ' ', ds])
    },
    {line: "$ Bo 2019/2 # KBo 71.90"},
    {
        line: "1' # [ … ] x ¬¬¬",
        result: tl(1, [ds, ' ', el, ' ', de, ' ', 'x', ' ', pe])
    },
    {
        line: "2' # [ … °MUNUS.MEŠ°zi-i]n-tu-ḫi-e-eš",
        result: tl(2, [ds, ' ', el, ' ', dt('MUNUS.MEŠ'), 'zi-i', de, 'n-tu-ḫi-e-eš'])
    },
    {
        line: "3' # [ … -i]a-u-an-zi tar-kum-mi-ia-iz-zi ¬¬¬",
        result: tl(3, [ds, ' ', el, ' ', '-i', de, 'a-u-an-zi', ' ', 'tar-kum-mi-ia-iz-zi', ' ', pe])
    },
    {
        line: "4' # [ … °G]IŠ°BANŠUR °GIŠ°BANŠUR an-da"
        /* , result: tl(4, [ds, ' ', el, ' ', '°G]IŠ°BANŠUR', ' ', '°GIŠ°BANŠUR', ' ', 'an-da']) */
    },
    {
        line: "5' # [ … ] ⸢6⸣ NINDA.GUR₄.RA°ḪI.A° ki-an-da",
        result: tl(5, [ds, ' ', el, ' ', de, ' ', ls, nc(6), le, ' ', sg('NINDA.GUR'), nc(4, true), sg('.RA'), dt('ḪI.A'), ' ', 'ki-an-da'])
    },
    {
        line: "6' # [ … -t]i-ia še-er pé-ra-an da-a-i ¬¬¬",
        result: tl(6, [ds, ' ', el, ' ', '-t', de, 'i-ia', ' ', 'še-er', ' ', 'pé-ra-an', ' ', 'da-a-i', ' ', pe])
    },
    {
        line: "7' # [ … pé-r]a-an ḫu-u-wa-a-i",
        result: tl(7, [ds, ' ', el, ' ', 'pé-r', de, 'a-an', ' ', 'ḫu-u-wa-a-i'])
    },
    {
        line: "8' # [ … °MUNUS.MEŠ°zi]-⸢in-tu-ḫi⸣-e-eš an-da {Rasur}"
        /*        , result: tl(8, [ds, ' ', el, ' ', sg('MUNUS.MEŠ'), 'zi', de, '-', ls, 'in-tu-ḫi', le, '-e-eš', ' ', 'an-da', ' {Rasur}'])*/
    },
    {
        line: "9' # [ú-wa-an-zi … k]i?-an-ta ¬¬¬",
        result: tl(9, [ds, 'ú-wa-an-zi', ' ', el, ' ', 'k', de, 'i', uc, '-an-ta', ' ', pe])
    },
    {
        line: "10' # [ … ] x-zi ¬¬¬",
        result: tl(10, [ds, ' ', el, ' ', de, ' ', 'x-zi', ' ', pe])
    },
    {
        line: "11' # [ … ]-da",
        result: tl(11, [ds, ' ', el, ' ', de, '-da'])
    },
    {
        line: "12' # [ … °LÚ°ALAM.Z]U₉",
        result: tl(12, [ds, ' ', el, ' ', dt('LÚ'), sg('ALAM.Z'), de, sg('U'), nc(9, true)])
    },
    {
        line: "13' # [ … -z]i ¬¬¬",
        result: tl(13, [ds, ' ', el, ' ', '-z', de, 'i', ' ', pe])
    },
    {line: "%r. Kol."},
    //{line: "1' # [x x] x x [ ¬¬¬"},
    {
        line: "2' # LUGAL-uš GUB-[aš",
        result: tl(2, [sg('LUGAL'), '-uš', ' ', sg('GUB'), '-', ds, 'aš'])
    },
    {
        line: "3' # °D°UTU °D°U ⸢°D°⸣[",
        result: tl(3, [dt('D'), sg('UTU'), ' ', dt('D'), sg('U'), ' ', ls, dt('D'), le, ds])
    },
    {
        line: "4' # °D°zi-in-t[u-ḫi ¬¬¬",
        result: tl(4, [dt('D'), 'zi-in-t', ds, 'u-ḫi', ' ', pe])
    },
    {
        line: "5' # °LÚ°SAGI.A 1 NINDA.G[UR₄.RA _EM-ṢA]",
        result: tl(5, [dt('LÚ'), sg('SAGI.A'), ' ', nc(1), ' ', sg('NINDA.G'), ds, sg('UR'), nc(4, true), sg('.RA'), ' ', ag('EM-ṢA'), de])
    },
    {
        line: "6' # LUGAL-i pa-a-i LUGAL-u[š pár-ši-ia] ¬¬¬",
        result: tl(6, [sg('LUGAL'), '-i', ' ', 'pa-a-i', ' ', sg('LUGAL'), '-u', ds, 'š', ' ', 'pár-ši-ia', de, ' ', pe])
    },
    {
        line: "7' # ta-aš-ta °MUNUS.MEŠ°zi-[in-tu-ḫi-e-eš",
        result: tl(7, ['ta-aš-ta', ' ', dt('MUNUS.MEŠ'), 'zi-', ds, 'in-tu-ḫi-e-eš'])
    },
    {
        line: "8' # pa-ra-a [ ¬¬¬",
        result: tl(8, ['pa-ra-a', ' ', ds, ' ', pe])
    },
    {
        line: "9' # pár-aš-na-a-u-<aš>-kán °LÚ°SAG[I.A ¬¬¬",
        result: tl(9, ['pár-aš-na-a-u-', supS, 'aš', supE, '-kán', ' ', dt('LÚ'), sg('SAG'), ds, sg('I.A'), ' ', pe])
    },
    {
        line: "10' # LUGAL-uš TUŠ-aš <°D°>iz-zi-i[š?-ta?-nu?",
        result: tl(10, [sg('LUGAL'), '-uš', ' ', sg('TUŠ'), '-aš', ' ', supS, dt('D'), supE, 'iz-zi-i', ds, 'š', uc, '-ta', uc, '-nu', uc])
    },
    {
        line: "11' # e-ku-zi GIŠ ⸢°D°⸣[INANNA ¬¬¬",
        result: tl(11, ['e-ku-zi', ' ', sg('GIŠ'), ' ', ls, dt('D'), le, ds, sg('INANNA'), ' ', pe])
    },
    {
        line: "12' # °LÚ°SAGI.A [1 NINDA.GUR₄.RA EM-ṢA]",
        result: tl(12, [dt('LÚ'), sg('SAGI.A'), ' ', ds, nc(1), ' ', sg('NINDA.GUR'), nc(4, true), sg('.RA'), ' ', sg('EM'), '-', sg('ṢA'), de])
    },
    {
        line: "13' # LUGAL-i pa-a-i [LUGAL-uš pár-ši-ia] ¬¬¬",
        result: tl(13, [sg('LUGAL'), '-i', ' ', 'pa-a-i', ' ', ds, sg('LUGAL'), '-uš', ' ', 'pár-ši-ia', de, ' ', pe])
    },
    {
        line: "14' # GAL DUMU.MEŠ ⸢É⸣.[GAL",
        result: tl(14, [sg('GAL'), ' ', sg('DUMU.MEŠ'), ' ', ls, sg('É'), le, sg('.'), ds, sg('GAL')])
    },
    {
        line: "15' # °LÚ.MEŠ°GA[LA ¬¬¬",
        result: tl(15, [dt('LÚ.MEŠ'), sg('GA'), ds, sg('LA'), ' ', pe])
    },
    {
        line: "16' # ⸢na-aš⸣-k[án",
        result: tl(16, [ls, 'na-aš', le, '-k', ds, 'án'])
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
        result: tl(7, ['am-ri-iš', nc(8, true), '-tár', ' ', sg('DUMU'), ' ', 'ma-num-ba-lúm-a-šùr'], true)
    },
    {line: "8 # i-na ṭup-pì-kà | a-šùr-mu-da-mì-i[q]"},
    {line: "9 # DUMU sá-ak-lá-nim | ⸢ú e⸣-dí-na-a"},
    {line: "10 # [DU]MU a-a-a | kà-an-ku-ni 1 GÍN KÙ.BABBAR"},
    {line: "11 # lá tù-qá-ri-ba-am"},
    {line: "12 # i-na °d°UTU-ši na-áš-pì-ir-⸢tí⸣"},
    {line: "%u. Rd."},
    {line: "13 # ta-ša-me-{Rasur}⸢ú⸣"},
    {line: "14 # x x x x x ["},
    {line: "$ Bo 2019/6 # KBo 71.93"},
    {line: "@Hit"},
    {line: "1' # [ … ] x ["},
    {line: "2' # [ … ] x x ["},
    {line: "3' # [ … ] É x ["},
    {line: "4' # [ … ] ⸢É⸣.GAL ["},
    {line: "5' # [ … n]u DUMU-li ["},
    {line: "6' # [ … ] x x ["}
]

describe('The transliteration parser', () => {

    it('should parse complete document', () => {
        awaited.forEach((tlpr) => {
            expect(parseTransliterationLine(tlpr.line)).toEqual(tlpr);
        });
    });
});