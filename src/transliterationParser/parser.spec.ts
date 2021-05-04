import {parseTransliterationLine} from './parser';
import {lineParseResult, LineParseResult} from "../model/lineParseResult";
import {parsedWord as w} from "../model/sentenceContent/word";
import {determinativ as dt} from "../model/wordContent/determinativ";
import {numeralContent as nc} from "../model/wordContent/numeralContent";
import {materLectionis as ml} from "../model/wordContent/materLectionis";
import {de, ds, le, ls, rs, sc, supE, supS, uc, ue, us} from './testHelpers';
import {Ellipsis as el} from "../model/wordContent/ellipsis";
import {akkadogramm as ag, sumerogramm as sg} from "../model/wordContent/multiStringContent";
import {ParagraphSeparator as pe, ParagraphSeparatorDouble as dpe} from "../model/paragraphSeparators";
import {AOIllegibleContent} from "../model/wordContent/illegible";
import {aoKolonMark} from "../model/wordContent/kolonMark";
import {aoNote} from "../model/wordContent/footNote";
import {aoGap} from "../model/sentenceContent/gap";

describe.skip('The transliteration parser', () => {

  it('should do what simtex does', () => {
    expect(parseTransliterationLine("1# ta LUGAL-uš A-NA DUTU AN-E x GUx.MAḪ pa-a-i {K:34}"))
      .toEqual<LineParseResult>(
        lineParseResult("1",  [
          // <w>ta</w>
          w('ta', 'ta'),
          // <w><sGr>LUGAL</sGr>-uš</w>
          w('LUGAL-uš', sg('LUGAL'), '-uš'),
          // <w><sGr>A</sGr><aGr>-NA</aGr></w>
          w('A-NA', sg('A'), ag('-', 'NA')),
          // <w><sGr>DUTU</sGr></w>
          w('DUTU', sg('DUTU')),
          // <w><sGr>AN</sGr><aGr>-E</aGr></w>
          w('AN-E', sg('AN'), ag('-', 'E')),
          // x
          w('x', AOIllegibleContent),
          // <w><sGr>GUₓ.MAḪ</sGr></w>
          w('GUx.MAḪ', sg('GU', 'ₓ', '.', 'MAḪ')),
          // <w>pa-a-i</w>
          w('pa-a-i', 'pa-a-i'),
          // <w><SP___AO_3a_-KolonMark>K:34</SP___AO_3a_-KolonMark></w>
          w('{K:34}', aoKolonMark('34'))
        ])
      );

    expect(parseTransliterationLine("1'# [ ... ] ⸢ú?-e?-te-na-an-za⸣"))
      .toEqual<LineParseResult>(
        lineParseResult("1'", [
          // <w><del_in/></w>
          w('[', ds),
          // <w><sGr>...</sGr></w>
          w('...', el),
          // <w><del_fin/></w>
          w(']', de),
          // <w><laes_in/>ú<corr c='?'/>-e<corr c='?'/>-te-na-an-za<laes_fin/></w>
          w('⸢ú?-e?-te-na-an-za⸣', ls, 'ú', uc, '-e', uc, '-te-na-an-za', le)
        ])
      );

    expect(parseTransliterationLine("2'# [ ... ] ⸢nu⸣ LÚKÚR ku-e-da-ni pé-di"))
      .toEqual<LineParseResult>(
        lineParseResult(
          "2'", [
            // <w><del_in/></w>
            w('[', ds),
            // <w><sGr>...</sGr></w>
            w('...', el),
            // <w><del_fin/></w>
            w(']', de),
            // <w><laes_in/>nu<laes_fin/></w>
            w('⸢nu⸣', ls, 'nu', le),
            // <w><sGr>LÚKÚR</sGr></w>
            w('LÚKÚR', sg('LÚKÚR')),
            // <w>ku-e-da-ni</w>
            w('ku-e-da-ni', 'ku-e-da-ni'),
            // <w>pé-di</w>
            w('pé-di', 'pé-di')
          ])
      );

    expect(parseTransliterationLine("3'# [ ... wa-ar-pa da-a]-iš* *na-aš-kán a-pé-e-ez"))
      .toEqual<LineParseResult>(
        lineParseResult("3'", [
          // <w><del_in/></w>
          w('[', ds),
          // <w><sGr>...</sGr></w>
          w('...', el),
          // <w>wa-ar-pa</w>
          w('wa-ar-pa', 'wa-ar-pa'),
          // <w>da-a<del_fin/>-iš<ras_in/></w>
          w('da-a]-iš*', 'da-a', de, '-iš', rs),
          //  <w><ras_fin/>na-aš-kán</w>
          w('*na-aš-kán', rs, 'na-aš-kán'),
          // <w>a-pé-e-ez</w>
          w('a-pé-e-ez', 'a-pé-e-ez')
        ])
      );

    expect(parseTransliterationLine("4'# [ ... mdu-ut-ḫa-l]i-ia-aš GAL ME-ŠE-DI"))
      .toEqual<LineParseResult>(
        lineParseResult("4'", [
          // <w><del_in/></w>
          w('[', ds),
          // <w><sGr>...</sGr></w>
          w('...', el),
          // <w>mdu-ut-ḫa-l<del_fin/>i-ia-aš</w>
          w('mdu-ut-ḫa-l]i-ia-aš', 'mdu-ut-ḫa-l', de, 'i-ia-aš'),
          // <w><sGr>GAL</sGr></w>
          w('GAL', sg('GAL')),
          // <w><sGr>ME</sGr><aGr>-ŠE-DI</aGr></w>
          w('ME-ŠE-DI', sg('ME'), ag('-', 'ŠE', '-', 'DI'))
        ])
      );

    expect(parseTransliterationLine("5'# [ ... -uš-m]a-⸢aš-ši⸣ ku-i-e-eš"))
      .toEqual<LineParseResult>(
        lineParseResult("5'", [
          // <w><del_in/></w>
          w('[', ds),
          // <w><sGr>...</sGr></w>
          w('...', el),
          // <w>-uš-m<del_fin/>a-<laes_in/>aš-ši<laes_fin/></w>
          w('-uš-m]a-⸢aš-ši⸣', '-uš-m', de, 'a-', ls, 'aš-ši', le),
          // <w>ku-i-e-eš</w>
          w('ku-i-e-eš', 'ku-i-e-eš')
        ])
      );

    expect(parseTransliterationLine("6'# [ ... pa-ra-a] da-a-aš ¬¬¬"))
      .toEqual<LineParseResult>(
        lineParseResult("6'", [
          // <w><del_in/></w>
          w('[', ds),
          // <w><sGr>...</sGr></w>
          w('...', el),
          // <w>pa-ra-a<del_fin/></w>
          w('pa-ra-a]', 'pa-ra-a', de),
          // <w>da-a-aš</w>
          w('da-a-aš', 'da-a-aš'),
          // </s></p><parsep/><p><s>
          w('¬¬¬', pe)
        ])
      );

    expect(parseTransliterationLine("7'# [ ... ] x  °m°mur-ši--DINGIR-LIM °MUNUS°ŠU.GI LÚ°MEŠ° DINGIR°MEŠ°-aš"))
      .toEqual<LineParseResult>(
        lineParseResult("7'", [
          // <w><del_in/></w>
          w('[', ds),
          // <w><sGr>...</sGr></w>
          w('...', el),
          // <w><del_fin/></w>
          w(']', de),
          // x
          w('x', AOIllegibleContent),
          // <w><d>m</d>mur-ši-<sGr>DINGIR</sGr><aGr>-LIM</aGr></w>
          w('°m°mur-ši--DINGIR-LIM', dt('m'), 'mur-ši', sg('DINGIR'), ag('-', 'LIM')),
          // <w><d>MUNUS</d><sGr>ŠU.GI</sGr></w>
          w('°MUNUS°ŠU.GI', dt('MUNUS'), sg('ŠU', '.', 'GI')),
          // <w><sGr>LÚ</sGr><d>MEŠ</d></w>
          w('LÚ°MEŠ°', sg('LÚ'), dt('MEŠ')),
          // <w><sGr>DINGIR</sGr><d>MEŠ</d>-aš</w>
          w('DINGIR°MEŠ°-aš', sg('DINGIR'), dt('MEŠ'), '-aš')
        ])
      );

    expect(parseTransliterationLine("8'# [ ] °m.D°30--SUM  ù °m.D°30--SUM{F: Problem mit den Punkten in Determinativen.}"))
      .toEqual<LineParseResult>(
        lineParseResult("8'", [
          // <w><del_in/></w>
          w('[', ds),
          // <w><del_fin/></w>
          w(']', de),
          // <w><d>m.D</d><sGr>30</sGr>-<sGr>SUM</sGr></w>
          w('°m.D°30--SUM', dt('m.D'), sg('30'), '-', sg('SUM')),
          // <w>ù</w>
          w('ù', 'ù'),
          // <w><SP___AO_3a_MaterLect>m.D</SP___AO_3a_MaterLect><num>30</num>-<sGr>SUM</sGr><note  n='1'  c="   &lt;P_f_Footnote&gt;Problem mit den Punkten in Determinativen.&lt;/P_f_Footnote&gt;"  /></w>
          w('°m.D°30--SUM{F: Problem mit den Punkten in Determinativen.}', dt('m.D'), nc('30'), '-', sg('SUM'), aoNote('Problem mit den Punkten in Determinativen.'))
        ])
      );

    expect(parseTransliterationLine("9' # °URU°?ša-mu-ḫa °URU°!ša-*mu-ḫa*   °URU?°ša?-mu-ḫa °URU!°ša-mu!-ḫa"))
      .toEqual<LineParseResult>(
        lineParseResult("9'", [
          // <w><d>URU</d><corr c='?'/>ša-mu-ḫa</w>
          w('°URU°?ša-mu-ḫa', dt('URU'), uc, 'ša-mu-ḫa'),
          // <w><d>URU</d><corr c='!'/>ša-<ras_in/>mu-ḫa<ras_fin/></w>
          w('°URU°!ša-*mu-ḫa*', dt('URU'), sc, 'ša-', rs, 'mu-ḫa', rs),
          // <w><SP___AO_3a_MaterLect>URU?</SP___AO_3a_MaterLect>ša<corr c='?'/>-mu-ḫa</w>
          w('°URU?°ša?-mu-ḫa'/*, TODO: ml('URU?'), ('ša'), uc, ('-mu-ḫa')*/),
          // <w><SP___AO_3a_MaterLect>URU!</SP___AO_3a_MaterLect>ša-mu<corr c='!'/>-ḫa</w>
          w('°URU!°ša-mu!-ḫa' /* TODO:, ml('URU!'), ('ša-mu'), sc, ('-ḫa'))*/)
        ])
      );

    expect(parseTransliterationLine("10# BLABLA-ṢU _ŠI-PÁT"))
      .toEqual<LineParseResult>(
        lineParseResult("10", [
          // <w><sGr>BLABLA</sGr><aGr>-ṢU</aGr></w>
          w('BLABLA-ṢU', sg('BLABLA'), ag('-ṢU')),
          // <w><aGr>ŠI-PÁT</aGr></w>
          w('_ŠI-PÁT', ag('ŠI-PÁT'))
        ])
      );

    expect(parseTransliterationLine("11 # šaṭ-rat°at° °MUNUS.MEŠ°kat°at°-re-eš {G: fünf Zeichen abgebr.} kar-°di°dim-mi-ia-az §§"))
      .toEqual<LineParseResult>(
        lineParseResult("11", [
          // <w>šaṭ-rat<SP___AO_3a_MaterLect>at</SP___AO_3a_MaterLect></w>
          w('šaṭ-rat°at°', 'šaṭ-rat', ml('at')),
          //  <w><d>MUNUS.MEŠ</d>kat<SP___AO_3a_MaterLect>at</SP___AO_3a_MaterLect>-re-eš</w>
          w('°MUNUS.MEŠ°kat°at°-re-eš', dt('MUNUS.MEŠ'), 'kat', ml('at'), '-re-eš'),
          //  <gap c="fünf Zeichen abgebr."/>
          w('{G: fünf Zeichen abgebr.}', aoGap('fünf Zeichen abgebr.')),
          // <w>kar-<SP___AO_3a_MaterLect>di</SP___AO_3a_MaterLect>dim-mi-ia-az</w>
          w('kar-°di°dim-mi-ia-az', 'kar-', ml('di'), 'dim-mi-ia-az'),
          // </s></p><parsep_dbl/><p><s>
          w('§§', dpe)
        ])
      );

    expect(parseTransliterationLine("12 # GU4 ka4 ubx ub[x K]AxU §"))
      .toEqual<LineParseResult>(
        lineParseResult("12", [
          // <w><sGr>GU₄</sGr></w>
          w('GU4', sg('GU₄')),
          // <w>ka₄</w>
          w('ka4', 'ka₄'),
          // <w>ubₓ</w>
          w('ubx', 'ubₓ'),
          // <w>ub<del_in/>ₓ</w>
          w('ub[x', 'ub', ds, 'ₓ'),
          // <w><sGr>K<del_fin/>A×U</sGr></w>
          w('K]AxU', sg('K', ds, 'A×U')),
          // </s></p><parsep/><p><s>
          w('§')
        ])
      );

    expect(parseTransliterationLine("13 # 4 GU4"))
      .toEqual<LineParseResult>(
        lineParseResult("13", [
          // <w><num>4</num></w>
          w('4', nc('4')),
          // <w><sGr>GU₄</sGr></w>
          w('GU4', sg('GU₄'))
        ])
      );

    expect(parseTransliterationLine("14 # 4 GU4"))
      .toEqual<LineParseResult>(
        lineParseResult("14", [
          // <w><num>4</num></w>
          w('4', nc('4')),
          // <w><sGr>GU₄</sGr></w>
          w('GU4', sg('GU₄'))
        ])
      );

    expect(parseTransliterationLine("15 # DUB 2°KAM°"))
      .toEqual<LineParseResult>(
        lineParseResult("15", [
          // <w><sGr>DUB</sGr></w>
          w('DUB', sg('DUB')),
          // <w><num>2</num><d>KAM</d></w>
          w('2°KAM°', nc('2'), dt('KAM'))
        ])
      );
  });

  it('should parse complete document', () => {
    expect(parseTransliterationLine("1' # [(x)] x ⸢zi⸣ x [",))
      .toEqual<LineParseResult>(
        lineParseResult("1'", [
          w('[(x)]', ds, us, 'x', ue, de),
          w('x', AOIllegibleContent),
          w('⸢zi⸣', ls, 'zi', le),
          w('x', AOIllegibleContent),
          w('[', ds)
        ])
      );

    expect(parseTransliterationLine("2' # [DUMU?].MUNUS?-ma e-ša-⸢a⸣-[ri"))
      .toEqual<LineParseResult>(
        lineParseResult("2'", [
          w('[DUMU?].MUNUS?-ma', ds, sg('DUMU'), uc, de, sg('.MUNUS'), uc, '-ma'),
          w('e-ša-⸢a⸣-[ri', 'e-ša-', ls, 'a', le, '-', ds, 'ri')
        ])
      );

    expect(parseTransliterationLine("3' # az-zi-ik-ki-it-[tén"))
      .toEqual<LineParseResult>(
        lineParseResult("3'", [
          w('az-zi-ik-ki-it-[tén', 'az-zi-ik-ki-it-', ds, 'tén')
        ])
      );

    expect(parseTransliterationLine("4' # nu ḫu-u-ma-an az-[zi-ik-ki- ¬¬¬"))
      .toEqual<LineParseResult>(
        lineParseResult("4'", [
          w('nu', 'nu'),
          w('ḫu-u-ma-an', 'ḫu-u-ma-an'),
          w('az-[zi-ik-ki-', 'az-', ds, 'zi-ik-ki-'),
          w('¬¬¬', pe)
        ])
      );

    expect(parseTransliterationLine("5' # [k]u-it-ma-an-aš-ma x ["))
      .toEqual<LineParseResult>(
        lineParseResult("5'", [
          w('[k]u-it-ma-an-aš-ma', ds, 'k', de, 'u-it-ma-an-aš-ma'),
          w('x', AOIllegibleContent),
          w('[', ds)
        ])
      );

    expect(parseTransliterationLine("6' # [n]a-aš-kán GIŠ.NÁ ["))
      .toEqual<LineParseResult>(
        lineParseResult("6'", [
          w('[n]a-aš-kán', ds, 'n', de, 'a-aš-kán'),
          w('GIŠ.NÁ', sg('GIŠ.NÁ')),
          w('[', ds)
        ])
      );

    expect(parseTransliterationLine("7' # [nu-u]š-ši ša-aš-t[a-"))
      .toEqual<LineParseResult>(
        lineParseResult("7'", [
          w('[nu-u]š-ši', ds, 'nu-u', de, 'š-ši'),
          w('ša-aš-t[a-', 'ša-aš-t', ds, 'a-')
        ])
      );

    expect(parseTransliterationLine("8' # [da?]-⸢a?⸣ nu-uš-ši x ["))
      .toEqual<LineParseResult>(
        lineParseResult("8'", [
          w('[da?]-⸢a?⸣', ds, 'da', uc, de, '-', ls, 'a', uc, le),
          w('nu-uš-ši', 'nu-uš-ši'),
          w('x', AOIllegibleContent),
          w('[', ds)
        ])
      );

    expect(parseTransliterationLine("9' # [nu-u]š-ši im-ma(-)["))
      .toEqual<LineParseResult>(
        lineParseResult("9'", [
          w('[nu-u]š-ši', ds, 'nu-u', de, 'š-ši'),
          w('im-ma(-)[', 'im-ma', us, '-', ue, ds)
        ])
      );

    expect(parseTransliterationLine("10' # [x-x]-TE°MEŠ° ⸢e⸣-["))
      .toEqual<LineParseResult>(
        lineParseResult("10'", [
          w('[x-x]-TE°MEŠ°', ds, 'x-x', de, ag('-TE'), dt('MEŠ')),
          w('⸢e⸣-[', ls, 'e', le, '-', ds)
        ])
      );

    expect(parseTransliterationLine("11' # [x (x)]-ri-⸢ia⸣-[ ¬¬¬"))
      .toEqual<LineParseResult>(
        lineParseResult("11'", [
          w('[x', ds, 'x'),
          w('(x)]-ri-⸢ia⸣-[', us, 'x', ue, de, '-ri-', ls, 'ia', le, '-', ds),
          w('¬¬¬', pe)
        ])
      );

    expect(parseTransliterationLine("12' # [x x] x ["))
      .toEqual<LineParseResult>(
        lineParseResult("12'", [
          w('[x', ds, 'x'),
          w('x]', 'x', de),
          w('x', AOIllegibleContent),
          w('[', ds)
        ])
      );

    expect(parseTransliterationLine("1' # [ … ] x ¬¬¬"))
      .toEqual<LineParseResult>(
        lineParseResult("1'", [
          w('[', ds),
          w('…', el),
          w(']', de),
          w('x', AOIllegibleContent),
          w('¬¬¬', pe)
        ])
      );

    expect(parseTransliterationLine("2' # [ … °MUNUS.MEŠ°zi-i]n-tu-ḫi-e-eš"))
      .toEqual<LineParseResult>(
        lineParseResult("2'", [
          w('[', ds),
          w('…', el),
          w('°MUNUS.MEŠ°zi-i]n-tu-ḫi-e-eš', dt('MUNUS.MEŠ'), 'zi-i', de, 'n-tu-ḫi-e-eš')
        ])
      );

    expect(parseTransliterationLine("3' # [ … -i]a-u-an-zi tar-kum-mi-ia-iz-zi ¬¬¬"))
      .toEqual<LineParseResult>(
        lineParseResult("3'", [
          w('[', ds),
          w('…', el),
          w('-i]a-u-an-zi', '-i', de, 'a-u-an-zi'),
          w('tar-kum-mi-ia-iz-zi', 'tar-kum-mi-ia-iz-zi'),
          w('¬¬¬', pe)
        ])
      );

    expect(parseTransliterationLine("4' # [ … °G]IŠ°BANŠUR °GIŠ°BANŠUR an-da"))
      .toEqual<LineParseResult>(
        lineParseResult("4'", [
          w('[', ds),
          w('…', el),
          w('°G]IŠ°BANŠUR'),
          w('°GIŠ°BANŠUR', dt('GIŠ'), sg('BANŠUR')),
          w('an-da', 'an-da')
        ])
      );

    expect(parseTransliterationLine("5' # [ … ] ⸢6⸣ NINDA.GUR₄.RA°ḪI.A° ki-an-da"))
      .toEqual<LineParseResult>(
        lineParseResult("5'", [
          w('[', ds),
          w('…', el),
          w(']', de),
          w('⸢6⸣', ls, nc('6'), le),
          w('NINDA.GUR₄.RA°ḪI.A°', sg('NINDA.GUR'), nc('₄'), sg('.RA'), dt('ḪI.A')),
          w('ki-an-da', 'ki-an-da')
        ])
      );

    expect(parseTransliterationLine("6' # [ … -t]i-ia še-er pé-ra-an da-a-i ¬¬¬"))
      .toEqual<LineParseResult>(
        lineParseResult("6'", [
          w('[', ds),
          w('…', el),
          w('-t]i-ia', '-t', de, 'i-ia'),
          w('še-er', 'še-er'),
          w('pé-ra-an', 'pé-ra-an'),
          w('da-a-i', 'da-a-i'),
          w('¬¬¬', pe)
        ])
      );

    expect(parseTransliterationLine("7' # [ … pé-r]a-an ḫu-u-wa-a-i"))
      .toEqual<LineParseResult>(
        lineParseResult("7'", [
          w('[', ds),
          w('…', el),
          w('pé-r]a-an', 'pé-r', de, 'a-an'),
          w('ḫu-u-wa-a-i', 'ḫu-u-wa-a-i')
        ])
      );

    expect(parseTransliterationLine("8' # [ … °MUNUS.MEŠ°zi]-⸢in-tu-ḫi⸣-e-eš an-da {Rasur}"))
      .toEqual<LineParseResult>(
        lineParseResult("8'", [
          w('[', ds),
          w('…', el),
          w('°MUNUS.MEŠ°zi]-⸢in-tu-ḫi⸣-e-eš', dt('MUNUS.MEŠ'), 'zi', de, '-', ls, 'in-tu-ḫi', le, '-e-eš'),
          w('an-da', 'an-da'),
          w('{Rasur}')
        ])
      );

    expect(parseTransliterationLine("9' # [ú-wa-an-zi … k]i?-an-ta ¬¬¬"))
      .toEqual<LineParseResult>(
        lineParseResult("9'", [
          w('[ú-wa-an-zi', ds, 'ú-wa-an-zi'),
          w('…', el),
          w('k]i?-an-ta', 'k', de, 'i', uc, '-an-ta'),
          w('¬¬¬', pe)
        ])
      );

    expect(parseTransliterationLine("10' # [ … ] x-zi ¬¬¬"))
      .toEqual<LineParseResult>(
        lineParseResult("10'", [
          w('[', ds),
          w('…', el),
          w(']', de),
          w('x-zi', 'x-zi'),
          w('¬¬¬', pe)
        ])
      );

    expect(parseTransliterationLine("11' # [ … ]-da"))
      .toEqual<LineParseResult>(
        lineParseResult("11'", [
          w('[', ds),
          w('…', el),
          w(']-da', de, '-da')
        ])
      );

    expect(parseTransliterationLine("12' # [ … °LÚ°ALAM.Z]U₉"))
      .toEqual<LineParseResult>(
        lineParseResult("12'", [
          w('[', ds),
          w('…', el),
          w('°LÚ°ALAM.Z]U₉', dt('LÚ'), sg('ALAM.Z'), de, sg('U'), nc('₉'))
        ])
      );

    expect(parseTransliterationLine("13' # [ … -z]i ¬¬¬"))
      .toEqual<LineParseResult>(
        lineParseResult("13'", [
          w('[', ds),
          w('…', el),
          w('-z]i', '-z', de, 'i'),
          w('¬¬¬', pe)
        ])
      );

    expect(parseTransliterationLine("1' # [x x] x x [ ¬¬¬"))
      .toEqual<LineParseResult>(
        lineParseResult("1'", [
          w('[x', ds, 'x'),
          w('x]', 'x', de),
          w('x', AOIllegibleContent),
          w('x', AOIllegibleContent),
          w('[', ds),
          w('¬¬¬', pe)
        ])
      );

    expect(parseTransliterationLine("2' # LUGAL-uš GUB-[aš"))
      .toEqual<LineParseResult>(
        lineParseResult("2'", [
          w('LUGAL-uš', sg('LUGAL'), '-uš'),
          w('GUB-[aš', sg('GUB'), '-', ds, 'aš')
        ])
      );

    expect(parseTransliterationLine("3' # °D°UTU °D°U ⸢°D°⸣["))
      .toEqual<LineParseResult>(
        lineParseResult("3'", [
          w('°D°UTU', dt('D'), sg('UTU')),
          w('°D°U', dt('D'), sg('U')),
          w('⸢°D°⸣[', ls, dt('D'), le, ds)
        ])
      );

    expect(parseTransliterationLine("4' # °D°zi-in-t[u-ḫi ¬¬¬"))
      .toEqual<LineParseResult>(
        lineParseResult("4'", [
          w('°D°zi-in-t[u-ḫi', dt('D'), 'zi-in-t', ds, 'u-ḫi'),
          w('¬¬¬', pe)
        ])
      );

    expect(parseTransliterationLine("5' # °LÚ°SAGI.A 1 NINDA.G[UR₄.RA _EM-ṢA]"))
      .toEqual<LineParseResult>(
        lineParseResult("5'", [
          w('°LÚ°SAGI.A', dt('LÚ'), sg('SAGI.A')),
          w('1', nc('1')),
          w('NINDA.G[UR₄.RA', sg('NINDA.G'), ds, sg('UR'), nc('₄'), sg('.RA')),
          w('_EM-ṢA]', ag('EM-ṢA'), de)
        ])
      );

    expect(parseTransliterationLine("6' # LUGAL-i pa-a-i LUGAL-u[š pár-ši-ia] ¬¬¬"))
      .toEqual<LineParseResult>(
        lineParseResult("6'", [
          w('LUGAL-i', sg('LUGAL'), '-i'),
          w('pa-a-i', 'pa-a-i'),
          w('LUGAL-u[š', sg('LUGAL'), '-u', ds, 'š'),
          w('pár-ši-ia]', 'pár-ši-ia', de),
          w('¬¬¬', pe)
        ])
      );

    expect(parseTransliterationLine("7' # ta-aš-ta °MUNUS.MEŠ°zi-[in-tu-ḫi-e-eš"))
      .toEqual<LineParseResult>(
        lineParseResult("7'", [
          w('ta-aš-ta', 'ta-aš-ta'),
          w('°MUNUS.MEŠ°zi-[in-tu-ḫi-e-eš', dt('MUNUS.MEŠ'), 'zi-', ds, 'in-tu-ḫi-e-eš')
        ])
      );

    expect(parseTransliterationLine("8' # pa-ra-a [ ¬¬¬"))
      .toEqual<LineParseResult>(
        lineParseResult("8'", [
          w('pa-ra-a', 'pa-ra-a'),
          w('[', ds),
          w('¬¬¬', pe)
        ])
      );

    expect(parseTransliterationLine("9' # pár-aš-na-a-u-<aš>-kán °LÚ°SAG[I.A ¬¬¬"))
      .toEqual<LineParseResult>(
        lineParseResult("9'", [
          w('pár-aš-na-a-u-<aš>-kán', 'pár-aš-na-a-u-', supS, 'aš', supE, '-kán'),
          w('°LÚ°SAG[I.A', dt('LÚ'), sg('SAG'), ds, sg('I.A')),
          w('¬¬¬', pe)
        ])
      );

    expect(parseTransliterationLine("10' # LUGAL-uš TUŠ-aš <°D°>iz-zi-i[š?-ta?-nu?"))
      .toEqual<LineParseResult>(
        lineParseResult("10'", [
          w('LUGAL-uš', sg('LUGAL'), '-uš'),
          w('TUŠ-aš', sg('TUŠ'), '-aš'),
          w('<°D°>iz-zi-i[š?-ta?-nu?', supS, dt('D'), supE, 'iz-zi-i', ds, 'š', uc, '-ta', uc, '-nu', uc)
        ])
      );

    expect(parseTransliterationLine("11' # e-ku-zi GIŠ ⸢°D°⸣[INANNA ¬¬¬"))
      .toEqual<LineParseResult>(
        lineParseResult("11'", [
          w('e-ku-zi', 'e-ku-zi'),
          w('GIŠ', sg('GIŠ')),
          w('⸢°D°⸣[INANNA', ls, dt('D'), le, ds, sg('INANNA')),
          w('¬¬¬', pe)
        ])
      );

    expect(parseTransliterationLine("12' # °LÚ°SAGI.A [1 NINDA.GUR₄.RA EM-ṢA]"))
      .toEqual<LineParseResult>(
        lineParseResult("12'", [
          w('°LÚ°SAGI.A', dt('LÚ'), sg('SAGI.A')),
          w('[1', ds, nc('1')),
          w('NINDA.GUR₄.RA', sg('NINDA.GUR'), nc('₄'), sg('.RA')),
          w('EM-ṢA]', sg('EM'), ag('-ṢA'), de)
        ])
      );

    expect(parseTransliterationLine("13' # LUGAL-i pa-a-i [LUGAL-uš pár-ši-ia] ¬¬¬"))
      .toEqual<LineParseResult>(
        lineParseResult("13'", [
          w('LUGAL-i', sg('LUGAL'), '-i'),
          w('pa-a-i', 'pa-a-i'),
          w('[LUGAL-uš', ds, sg('LUGAL'), '-uš'),
          w('pár-ši-ia]', 'pár-ši-ia', de),
          w('¬¬¬', pe)
        ])
      );

    expect(parseTransliterationLine("14' # GAL DUMU.MEŠ ⸢É⸣.[GAL"))
      .toEqual<LineParseResult>(
        lineParseResult("14'", [
          w('GAL', sg('GAL')),
          w('DUMU.MEŠ', sg('DUMU.MEŠ')),
          w('⸢É⸣.[GAL', ls, sg('É'), le, sg('.'), ds, sg('GAL'))
        ])
      );

    expect(parseTransliterationLine("15' # °LÚ.MEŠ°GA[LA ¬¬¬"))
      .toEqual<LineParseResult>(
        lineParseResult("15'", [
          w('°LÚ.MEŠ°GA[LA', dt('LÚ.MEŠ'), sg('GA'), ds, sg('LA')),
          w('¬¬¬', pe)
        ])
      );

    expect(parseTransliterationLine("16' # ⸢na-aš⸣-k[án"))
      .toEqual<LineParseResult>(
        lineParseResult("16'", [
          w('⸢na-aš⸣-k[án', ls, 'na-aš', le, '-k', ds, 'án')
        ])
      );

    expect(parseTransliterationLine("1 # a-na ša ki-ma | i-a-tí | ù! ku-li"))
      .toEqual<LineParseResult>(
        lineParseResult("1", [
          w('a-na', 'a-na'),
          w('ša', 'ša'),
          w('ki-ma', 'ki-ma'),
          w('|'),
          w('i-a-tí', 'i-a-tí'),
          w('|'),
          w('ù!', 'ù', sc),
          w('ku-li', 'ku-li')
        ])
      );

    expect(parseTransliterationLine("2 # a-na ku-li | qí-bi₄-ma | um-ma"))
      .toEqual<LineParseResult>(
        lineParseResult("2", [
          w('a-na', 'a-na'),
          w('ku-li', 'ku-li'),
          w('|'),
          w('qí-bi₄-ma', 'qí-bi', nc('₄'), '-ma'),
          w('|'),
          w('um-ma', 'um-ma')
        ])
      );

    expect(parseTransliterationLine("3 # a-šùr-e-na-ma 2 MA.NA 2 ⅔ GÍN"))
      .toEqual<LineParseResult>(
        lineParseResult("3", [
          w('a-šùr-e-na-ma', 'a-šùr-e-na-ma'),
          w('2', nc('2')),
          w('MA.NA', sg('MA.NA')),
          w('2', nc('2')),
          w('⅔'),
          w('GÍN', sg('GÍN'))
        ])
      );

    expect(parseTransliterationLine("4 # KÙ.BABBAR | ša li-bi₄-kà | ša a-na MU 1.[ŠÈ]"))
      .toEqual<LineParseResult>(
        lineParseResult("4", [
          w('KÙ.BABBAR', sg('KÙ.BABBAR')),
          w('|'),
          w('ša', 'ša'),
          w('li-bi₄-kà', 'li-bi', nc('₄'), '-kà'),
          w('|'),
          w('ša', 'ša'),
          w('a-na', 'a-na'),
          w('MU', sg('MU')),
          w('1.[ŠÈ]', nc('1'), sg('.'), ds, sg('ŠÈ'), de)
        ])
      );

    expect(parseTransliterationLine("5 # ša-qá-lìm | qá-bi₄-a-tí-ni"))
      .toEqual<LineParseResult>(
        lineParseResult("5", [
          w('ša-qá-lìm', 'ša-qá-lìm'),
          w('|'),
          w('qá-bi₄-a-tí-ni', 'qá-bi', nc('₄'), '-a-tí-ni')
        ])
      );

    expect(parseTransliterationLine("6 # ITI 1°KAM° | ku-zal-li | li-mu-um"))
      .toEqual<LineParseResult>(
        lineParseResult("6", [
          w('ITI', sg('ITI')),
          w('1°KAM°', nc('1'), dt('KAM')),
          w('|'),
          w('ku-zal-li', 'ku-zal-li'),
          w('|'),
          w('li-mu-um', 'li-mu-um')
        ])
      );

    expect(parseTransliterationLine("7 # am-ri-iš₈-tár DUMU ma-num-ba-lúm-a-šùr"))
      .toEqual<LineParseResult>(
        lineParseResult("7", [
          w('am-ri-iš₈-tár', 'am-ri-iš', nc('₈'), '-tár'),
          w('DUMU', sg('DUMU')),
          w('ma-num-ba-lúm-a-šùr', 'ma-num-ba-lúm-a-šùr')
        ])
      );

    expect(parseTransliterationLine("8 # i-na ṭup-pì-kà | a-šùr-mu-da-mì-i[q]"))
      .toEqual<LineParseResult>(
        lineParseResult("8", [
          w('i-na', 'i-na'),
          w('ṭup-pì-kà', 'ṭup-pì-kà'),
          w('|'),
          w('a-šùr-mu-da-mì-i[q]', 'a-šùr-mu-da-mì-i', ds, 'q', de)
        ])
      );

    expect(parseTransliterationLine("9 # DUMU sá-ak-lá-nim | ⸢ú e⸣-dí-na-a"))
      .toEqual<LineParseResult>(
        lineParseResult("9", [
          w('DUMU', sg('DUMU')),
          w('sá-ak-lá-nim', 'sá-ak-lá-nim'),
          w('|'),
          w('⸢ú', ls, 'ú'),
          w('e⸣-dí-na-a', 'e', le, '-dí-na-a')
        ])
      );

    expect(parseTransliterationLine("10 # [DU]MU a-a-a | kà-an-ku-ni 1 GÍN KÙ.BABBAR"))
      .toEqual<LineParseResult>(
        lineParseResult("10", [
          w('[DU]MU', ds, sg('DU'), de, sg('MU')),
          w('a-a-a', 'a-a-a'),
          w('|'),
          w('kà-an-ku-ni', 'kà-an-ku-ni'),
          w('1', nc('1')),
          w('GÍN', sg('GÍN')),
          w('KÙ.BABBAR', sg('KÙ.BABBAR'))
        ])
      );

    expect(parseTransliterationLine("11 # lá tù-qá-ri-ba-am"))
      .toEqual<LineParseResult>(
        lineParseResult("11", [
          w('lá', 'lá'),
          w('tù-qá-ri-ba-am', 'tù-qá-ri-ba-am')
        ])
      );

    expect(parseTransliterationLine("12 # i-na °d°UTU-ši na-áš-pì-ir-⸢tí⸣"))
      .toEqual<LineParseResult>(
        lineParseResult("12", [
          w('i-na', 'i-na'),
          w('°d°UTU-ši', ml('d'), sg('UTU'), '-ši'),
          w('na-áš-pì-ir-⸢tí⸣', 'na-áš-pì-ir-', ls, 'tí', le)
        ])
      );

    expect(parseTransliterationLine("13 # ta-ša-me-{Rasur}⸢ú⸣"))
      .toEqual<LineParseResult>(
        lineParseResult("13", [
          w('ta-ša-me-{Rasur}⸢ú⸣')
        ])
      );

  });
});