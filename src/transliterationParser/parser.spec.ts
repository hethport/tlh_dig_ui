import {
  markContent as mc,
  numeralContent as nc,
  parseTransliterationLine,
  TransliterationLineParseResult
} from './parser';
import {transliterationTextLine as tl, transliterationWord as w} from '../model/transliterationTextLineParseResult';
import {
  akkadogramm as ag,
  determinativ as dt,
  hittite as ht,
  materLectionis as ml,
  sumerogramm as sg
} from "../model/stringContent";
import {de, ds, el, le, ls, pe, r, sc, supE, supS, uc, ue, us, wordResult as wr} from './testHelpers';
import {MarkType} from '../generated/graphql';

describe('The transliteration parser', () => {

  it('should do what simtex does', () => {
    expect(parseTransliterationLine("1# ta LUGAL-uš A-NA DUTU AN-E x GUx.MAḪ pa-a-i {K:34}"))
      .toEqual<TransliterationLineParseResult>({
        transliterationLineInput: "1# ta LUGAL-uš A-NA DUTU AN-E x GUx.MAḪ pa-a-i {K:34}",
        result: tl(1, [
          // <w>ta</w>
          wr('ta', w(ht('ta'))),
          // <w><sGr>LUGAL</sGr>-uš</w>
          wr('LUGAL-uš', w(sg('LUGAL'), ht('-uš'))),
          // <w><sGr>A</sGr><aGr>-NA</aGr></w>
          wr('A-NA', w(sg('A'), ag('NA'))),
          // <w><sGr>DUTU</sGr></w>
          wr('DUTU', w(sg('DUTU'))),
          // <w><sGr>AN</sGr><aGr>-E</aGr></w>
          wr('AN-E', w(sg('AN'), ag('E'))),
          'x',
          // <w><sGr>GUₓ.MAḪ</sGr></w>
          wr('GUx.MAḪ', w(sg('GUₓ.MAḪ'))),
          // <w>pa-a-i</w>
          wr('pa-a-i', w(ht('pa-a-i'))),
          // <w><SP___AO_3a_-KolonMark>K:34</SP___AO_3a_-KolonMark></w>
          wr('{K:34}', w(mc(MarkType.Colon, '34')))
        ], true)
      });

    expect(parseTransliterationLine("1'# [ ... ] ⸢ú?-e?-te-na-an-za⸣"))
      .toEqual<TransliterationLineParseResult>({
        transliterationLineInput: "1'# [ ... ] ⸢ú?-e?-te-na-an-za⸣",
        result: tl(1, [
          // <w><del_in/></w> <w><sGr>...</sGr></w>
          wr('[', w(ds)), wr('...', w(sg('...'))),
          // <w><del_fin/></w>
          wr(']', w(de)),
          // <w><laes_in/>ú<corr c='?'/>-e<corr c='?'/>-te-na-an-za<laes_fin/></w>
          wr('⸢ú?-e?-te-na-an-za⸣', w(ls, ht('ú'), uc, ht('-e'), uc, ht('-te-na-an-za'), le))
        ])
      });

    expect(parseTransliterationLine("2'# [ ... ] ⸢nu⸣ LÚKÚR ku-e-da-ni pé-di"))
      .toEqual<TransliterationLineParseResult>({
        transliterationLineInput: "2'# [ ... ] ⸢nu⸣ LÚKÚR ku-e-da-ni pé-di",
        result: tl(2, [
          // <w><del_in/></w> <w><sGr>...</sGr></w>
          wr('[', w(ds)), wr('...', w(sg('...'))),
          // <w><del_fin/></w>
          wr(']', w(de)),
          // <w><laes_in/>nu<laes_fin/></w>
          wr('⸢nu⸣', w(ls, ht('nu'), le)),
          // <w><sGr>LÚKÚR</sGr></w>
          wr('LÚKÚR', w(sg('LÚKÚR'))),
          // <w>ku-e-da-ni</w>
          wr('ku-e-da-ni', w(ht('ku-e-da-ni'))),
          // <w>pé-di</w>
          wr('pé-di', w(ht('pé-di')))
        ])
      });

    expect(parseTransliterationLine("3'# [ ... wa-ar-pa da-a]-iš* *na-aš-kán a-pé-e-ez"))
      .toEqual<TransliterationLineParseResult>({
        transliterationLineInput: "3'# [ ... wa-ar-pa da-a]-iš* *na-aš-kán a-pé-e-ez",
        result: tl(3, [
          // <w><del_in/></w> <w><sGr>...</sGr></w>
          wr('[', w(ds)), wr('...', w(sg('...'))),
          // <w>wa-ar-pa</w>
          wr('wa-ar-pa', w(ht('wa-ar-pa'))),
          // <w>da-a<del_fin/>-iš<ras_in/></w>
          wr('da-a]-iš*', w(ht('da-a'), de, ht('-iš'), r)),
          //  <w><ras_fin/>na-aš-kán</w>
          wr('*na-aš-kán', w(r, ht('na-aš-kán'))),
          // <w>a-pé-e-ez</w>
          wr('a-pé-e-ez', w(ht('a-pé-e-ez')))
        ])
      });

    /*
    expect(parseTransliterationLine("4'# [ ... Mdu-ut-ḫa-l]i-ia-aš GAL ME-ŠE-DI"))
      .toEqual<TransliterationLineParseResult>({
        transliterationLineInput: "4'# [ ... Mdu-ut-ḫa-l]i-ia-aš GAL ME-ŠE-DI",
        result: tl(4, [
          // <w><del_in/></w> <w><sGr>...</sGr></w>
          wr('[', w(ds)), wr('...', w(sg('...'))),
          // <w>mdu-ut-ḫa-l<del_fin/>i-ia-aš</w>
          wr('Mdu-ut-ḫa-l]i-ia-aš', w(ht('mdu-ut-ḫa-l'), ds, ht('i-ia-aš'))),
          // <w><sGr>GAL</sGr></w>
          wr('GAL', w(sg('GAL'))),
          // <w><sGr>ME</sGr><aGr>-ŠE-DI</aGr></w>
          wr('ME-ŠE-DI', w(sg('ME'), ag('ŠE-DI')))
        ])
      });
     */

    expect(parseTransliterationLine("5'# [ ... -uš-m]a-⸢aš-ši⸣ ku-i-e-eš"))
      .toEqual<TransliterationLineParseResult>({
        transliterationLineInput: "5'# [ ... -uš-m]a-⸢aš-ši⸣ ku-i-e-eš",
        result: tl(5, [
          // <w><del_in/></w> <w><sGr>...</sGr></w>
          wr('[', w(ds)), wr('...', w(sg('...'))),
          // <w>-uš-m<del_fin/>a-<laes_in/>aš-ši<laes_fin/></w>
          wr('-uš-m]a-⸢aš-ši⸣', w(ht('-uš-m'), de, ht('a-'), ls, ht('aš-ši'), le)),
          // <w>ku-i-e-eš</w>
          wr('ku-i-e-eš', w(ht('ku-i-e-eš')))
        ])
      });

    expect(parseTransliterationLine("6'# [ ... pa-ra-a] da-a-aš ¬¬¬"))
      .toEqual<TransliterationLineParseResult>({
        transliterationLineInput: "6'# [ ... pa-ra-a] da-a-aš ¬¬¬",
        result: tl(6, [
          // <w><del_in/></w> <w><sGr>...</sGr></w>
          wr('[', w(ds)), wr('...', w(sg('...'))),
          // <w>pa-ra-a<del_fin/></w>
          wr('pa-ra-a]', w(ht('pa-ra-a'), de)),
          // <w>da-a-aš</w>
          wr('da-a-aš', w(ht('da-a-aš'))),
          // </s></p><parsep/><p><s>
          wr('¬¬¬', w(pe))
        ])
      });

    /*
    expect(parseTransliterationLine("7'# [ ... ] x  °m°mur-ši--DINGIR-LIM °MUNUS°ŠU.GI LÚ°MEŠ° DINGIR°MEŠ°-aš"))
      .toEqual<TransliterationLineParseResult>({
        transliterationLineInput: "7'# [ ... ] x  °m°mur-ši--DINGIR-LIM °MUNUS°ŠU.GI LÚ°MEŠ° DINGIR°MEŠ°-aš",
        result: tl(7, [
          // <w><del_in/></w> <w><sGr>...</sGr></w> <w><del_fin/></w>
          wr('[', w(ds)), wr('...', w(sg('...'))), wr(']', w(de)),
          // x
          wr('x'),
          // <w><d>m</d>mur-ši-<sGr>DINGIR</sGr><aGr>-LIM</aGr></w>
          wr('°m°mur-ši--DINGIR-LIM', w(dt('m'), ht('mur-ši'), sg('DINGIR'), ag('LIM'))),
          // <w><d>MUNUS</d><sGr>ŠU.GI</sGr></w>
          wr('°MUNUS°ŠU.GI', w(dt('MUNUS'), sg('ŠU.GI'))),
          // <w><sGr>LÚ</sGr><d>MEŠ</d></w>
          wr('LÚ°MEŠ°', w(sg('LÚ'), dt('MEŠ'))),
          // <w><sGr>DINGIR</sGr><d>MEŠ</d>-aš</w>
          wr('DINGIR°MEŠ°-aš', w(sg('DINGIR'), dt('MEŠ'), ht('-aš')))
        ])
      });
     */

    /*
    expect(parseTransliterationLine("8'# [ ] °m°°.°°D°30--SUM  ù °m.D°30--SUM{F: Problem mit den Punkten in Determinativen.}"))
      .toEqual<TransliterationLineParseResult>({
        transliterationLineInput: "8'# [ ] °m°°.°°D°30--SUM  ù °m.D°30--SUM{F: Problem mit den Punkten in Determinativen.}",
        result: tl(8, [
          // <w><del_in/></w> <w><del_fin/></w>
          wr('[', w(ds)), wr(']', w(de)),
          // <w><d>m.D</d><sGr>30</sGr>-<sGr>SUM</sGr></w>
          wr('°m°°.°°D°30--SUM', w(dt('m.D'), sg('30'), ht('-'), sg('SUM'))),
          // <w>ù</w>
          wr('ù', w(ht('ù'))),
          // <w><SP___AO_3a_MaterLect>m.D</SP___AO_3a_MaterLect><num>30</num>-<sGr>SUM</sGr><note  n='1'  c="   &lt;P_f_Footnote&gt;Problem mit den Punkten in Determinativen.&lt;/P_f_Footnote&gt;"  /></w>
          wr('°m.D°30--SUM{F: Problem mit den Punkten in Determinativen.}', w(ml('m.D'), nc('30'), ht('-'), sg('SUM'), '<note  n=\'1\'  c="   &lt;P_f_Footnote&gt;Problem mit den Punkten in Determinativen.&lt;/P_f_Footnote&gt;"  />'))
        ])
      });
     */

    expect(parseTransliterationLine("9' # °URU°?ša-mu-ḫa °URU°!ša-*mu-ḫa*   °URU?°ša?-mu-ḫa °URU!°ša-mu!-ḫa"))
      .toEqual<TransliterationLineParseResult>({
        transliterationLineInput: "9' # °URU°?ša-mu-ḫa °URU°!ša-*mu-ḫa*   °URU?°ša?-mu-ḫa °URU!°ša-mu!-ḫa",
        result: tl(9, [
          // <w><d>URU</d><corr c='?'/>ša-mu-ḫa</w>
          wr('°URU°?ša-mu-ḫa', w(dt('URU'), uc, ht('ša-mu-ḫa'))),
          // <w><d>URU</d><corr c='!'/>ša-<ras_in/>mu-ḫa<ras_fin/></w>
          wr('°URU°!ša-*mu-ḫa*', w(dt('URU'), sc, ht('ša-'), r, ht('mu-ḫa'), r)),
          // <w><SP___AO_3a_MaterLect>URU?</SP___AO_3a_MaterLect>ša<corr c='?'/>-mu-ḫa</w>
          wr('°URU?°ša?-mu-ḫa'/*, TODO: w(ml('URU?'), ht('ša'), uc, ht('-mu-ḫa')*/),
          // <w><SP___AO_3a_MaterLect>URU!</SP___AO_3a_MaterLect>ša-mu<corr c='!'/>-ḫa</w>
          wr('°URU!°ša-mu!-ḫa' /* TODO:, w(ml('URU!'), ht('ša-mu'), sc, ht('-ḫa'))*/)
        ])
      });

    /*
    expect(parseTransliterationLine("10# BLABLA-ṢU _ŠI-PÁT"))
      .toEqual<TransliterationLineParseResult>({
        transliterationLineInput: "10# BLABLA-ṢU _ŠI-PÁT",
        result: tl(10, [
          // <w><sGr>BLABLA</sGr><aGr>-ṢU</aGr></w>
          wr('BLABLA-ṢU', w(sg('BLABLA'), ag('-ṢU'))),
          // <w><aGr>ŠI-PÁT</aGr></w>
          wr('_ŠI-PÁT', w(ag('ŠI-PÁT')))
        ], true)
      });
     */

    /*
    expect(parseTransliterationLine("11 # šaṭ-rat°at° °MUNUS.MEŠ°kat°at°-re-eš {G: fünf Zeichen abgebr.} kar-°di°dim-mi-ia-az §§"))
      .toEqual<TransliterationLineParseResult>({
        transliterationLineInput: "11 # šaṭ-rat°at° °MUNUS.MEŠ°kat°at°-re-eš {G: fünf Zeichen abgebr.} kar-°di°dim-mi-ia-az §§",
        result: tl(11, [
          // <w>šaṭ-rat<SP___AO_3a_MaterLect>at</SP___AO_3a_MaterLect></w>
          wr('šaṭ-rat°at°', w(ht('šaṭ-rat'), ml('at'))),
          //  <w><d>MUNUS.MEŠ</d>kat<SP___AO_3a_MaterLect>at</SP___AO_3a_MaterLect>-re-eš</w>
          wr('°MUNUS.MEŠ°kat°at°-re-eš', w(dt('MUNUS.MEŠ'), ht('kat'), ml('at'), ht('-re-eš'))),
          //  <gap c="fünf Zeichen abgebr."/>
          wr('{G: fünf Zeichen abgebr.}', w('<gap c="fünf Zeichen abgebr."/>')),
          // <w>kar-<SP___AO_3a_MaterLect>di</SP___AO_3a_MaterLect>dim-mi-ia-az</w> </s></p><parsep_dbl/><p><s>
          wr('kar-°di°dim-mi-ia-az', w(ht('kar-'), ml('di'), ht('dim-mi-ia-az'))),
          wr('§§', w('</s></p><parsep_dbl/><p>'))
        ], true)
      });
     */

    /*
    expect(parseTransliterationLine("12 # GU4 ka4 ubx ub[x K]AxU §"))
      .toEqual<TransliterationLineParseResult>({
        transliterationLineInput: "12 # GU4 ka4 ubx ub[x K]AxU §",
        result: tl(12, [
          // <w><sGr>GU₄</sGr></w>
          wr('GU4', w(sg('GU₄'))),
          // <w>ka₄</w>
          wr('ka4', w(ht('ka₄'))),
          // <w>ubₓ</w>
          wr('ubx', w(ht('ubₓ'))),
          // <w>ub<del_in/>ₓ</w>
          wr('ub[x', w(ht('ub'), ds, ht('ₓ'))),
          // <w><sGr>K<del_fin/>A×U</sGr></w>
          wr('K]AxU', w(sg('K', ds, 'A×U'))),
          // </s></p><parsep/><p><s>
          wr('§')
        ], true)
      });
     */

    /*
    expect(parseTransliterationLine("13 # 4 GU4"))
      .toEqual<TransliterationLineParseResult>({
        transliterationLineInput: "13 # 4 GU4",
        result: tl(13, [
          // <w><num>4</num></w>
          wr('4', w(nc('4'))),
          // <w><sGr>GU₄</sGr></w>
          wr('GU4', w(sg('GU₄')))
        ], true)
      });
     */

    /*
    expect(parseTransliterationLine("14 # 4 GU4"))
      .toEqual<TransliterationLineParseResult>({
        transliterationLineInput: "14 # 4 GU4",
        result: tl(14, [
          // <w><num>4</num></w>
          wr('4', w(nc('4'))),
          // <w><sGr>GU₄</sGr></w>
          wr('GU4', w(sg('GU₄')))
        ], true)
      });
     */

    expect(parseTransliterationLine("15 # DUB 2°KAM°"))
      .toEqual<TransliterationLineParseResult>({
        transliterationLineInput: "15 # DUB 2°KAM°",
        result: tl(15, [
          // <w><sGr>DUB</sGr></w>
          wr('DUB', w(sg('DUB'))),
          // <w><num>2</num><d>KAM</d></w>
          wr('2°KAM°', w(nc('2'), dt('KAM')))
        ], true)
      });
  });

  it('should parse complete document', () => {
    expect(parseTransliterationLine("1' # [(x)] x ⸢zi⸣ x [",))
      .toEqual({
        transliterationLineInput: "1' # [(x)] x ⸢zi⸣ x [",
        result: tl(1, [
          wr('[(x)]', w(ds, us, ht('x'), ue, de)),
          wr('x', w(ht('x'))),
          wr('⸢zi⸣', w(ls, ht('zi'), le)),
          wr('x', w(ht('x'))),
          wr('[', w(ds))
        ])
      });

    expect(parseTransliterationLine("2' # [DUMU?].MUNUS?-ma e-ša-⸢a⸣-[ri"))
      .toEqual({
        transliterationLineInput: "2' # [DUMU?].MUNUS?-ma e-ša-⸢a⸣-[ri",
        result: tl(2, [
          wr('[DUMU?].MUNUS?-ma', w(ds, sg('DUMU'), uc, de, sg('.MUNUS'), uc, ht('-ma'))),
          wr('e-ša-⸢a⸣-[ri', w(ht('e-ša-'), ls, ht('a'), le, ht('-'), ds, ht('ri')))
        ])
      })
    ;

    expect(parseTransliterationLine("3' # az-zi-ik-ki-it-[tén"))
      .toEqual({
        transliterationLineInput: "3' # az-zi-ik-ki-it-[tén",
        result: tl(3, [
          wr('az-zi-ik-ki-it-[tén', w(ht('az-zi-ik-ki-it-'), ds, ht('tén')))
        ])
      });

    expect(parseTransliterationLine("4' # nu ḫu-u-ma-an az-[zi-ik-ki- ¬¬¬"))
      .toEqual({
        transliterationLineInput: "4' # nu ḫu-u-ma-an az-[zi-ik-ki- ¬¬¬",
        result: tl(4, [
          wr('nu', w(ht('nu'))),
          wr('ḫu-u-ma-an', w(ht('ḫu-u-ma-an'))),
          wr('az-[zi-ik-ki-', w(ht('az-'), ds, ht('zi-ik-ki-'))),
          wr('¬¬¬', w(pe))
        ])
      });

    expect(parseTransliterationLine("5' # [k]u-it-ma-an-aš-ma x ["))
      .toEqual({
        transliterationLineInput: "5' # [k]u-it-ma-an-aš-ma x [",
        result: tl(5, [
          wr('[k]u-it-ma-an-aš-ma', w(ds, ht('k'), de, ht('u-it-ma-an-aš-ma'))),
          wr('x', w(ht('x'))),
          wr('[', w(ds))
        ])
      });

    expect(parseTransliterationLine("6' # [n]a-aš-kán GIŠ.NÁ ["))
      .toEqual({
        transliterationLineInput: "6' # [n]a-aš-kán GIŠ.NÁ [",
        result: tl(6, [
          wr('[n]a-aš-kán', w(ds, ht('n'), de, ht('a-aš-kán'))),
          wr('GIŠ.NÁ', w(sg('GIŠ.NÁ'))),
          wr('[', w(ds))
        ])
      });

    expect(parseTransliterationLine("7' # [nu-u]š-ši ša-aš-t[a-"))
      .toEqual({
        transliterationLineInput: "7' # [nu-u]š-ši ša-aš-t[a-",
        result: tl(7, [
          wr('[nu-u]š-ši', w(ds, ht('nu-u'), de, ht('š-ši'))),
          wr('ša-aš-t[a-', w(ht('ša-aš-t'), ds, ht('a-')))
        ])
      });

    expect(parseTransliterationLine("8' # [da?]-⸢a?⸣ nu-uš-ši x ["))
      .toEqual({
        transliterationLineInput: "8' # [da?]-⸢a?⸣ nu-uš-ši x [",
        result: tl(8, [
          wr('[da?]-⸢a?⸣', w(ds, ht('da'), uc, de, ht('-'), ls, ht('a'), uc, le)),
          wr('nu-uš-ši', w(ht('nu-uš-ši'))),
          wr('x', w(ht('x'))),
          wr('[', w(ds))
        ])
      });

    expect(parseTransliterationLine("9' # [nu-u]š-ši im-ma(-)["))
      .toEqual({
        transliterationLineInput: "9' # [nu-u]š-ši im-ma(-)[",
        result: tl(9, [
          wr('[nu-u]š-ši', w(ds, ht('nu-u'), de, ht('š-ši'))),
          wr('im-ma(-)[', w(ht('im-ma'), us, ht('-'), ue, ds))
        ])
      });

    expect(parseTransliterationLine("10' # [x-x]-TE°MEŠ° ⸢e⸣-["))
      .toEqual({
        transliterationLineInput: "10' # [x-x]-TE°MEŠ° ⸢e⸣-[",
        result: tl(10, [
          wr('[x-x]-TE°MEŠ°', w(ds, ht('x-x'), de, ag('TE'), dt('MEŠ'))),
          wr('⸢e⸣-[', w(ls, ht('e'), le, ht('-'), ds))
        ])
      });

    expect(parseTransliterationLine("11' # [x (x)]-ri-⸢ia⸣-[ ¬¬¬"))
      .toEqual({
        transliterationLineInput: "11' # [x (x)]-ri-⸢ia⸣-[ ¬¬¬",
        result: tl(11, [
          wr('[x', w(ds, ht('x'))),
          wr('(x)]-ri-⸢ia⸣-[', w(us, ht('x'), ue, de, ht('-ri-'), ls, ht('ia'), le, ht('-'), ds)),
          wr('¬¬¬', w(pe))
        ])
      });

    expect(parseTransliterationLine("12' # [x x] x ["))
      .toEqual({
        transliterationLineInput: "12' # [x x] x [",
        result: tl(12, [
          wr('[x', w(ds, ht('x'))),
          wr('x]', w(ht('x'), de)),
          wr('x', w(ht('x'))),
          wr('[', w(ds))
        ])
      });

    expect(parseTransliterationLine("$ Bo 2019/2 # KBo 71.90"))
      .toEqual({transliterationLineInput: "$ Bo 2019/2 # KBo 71.90"});

    expect(parseTransliterationLine("1' # [ … ] x ¬¬¬"))
      .toEqual({
        transliterationLineInput: "1' # [ … ] x ¬¬¬",
        result: tl(1, [
          wr('[', w(ds)),
          wr('…', w(el)),
          wr(']', w(de)),
          wr('x', w(ht('x'))),
          wr('¬¬¬', w(pe))
        ])
      });

    expect(parseTransliterationLine("2' # [ … °MUNUS.MEŠ°zi-i]n-tu-ḫi-e-eš"))
      .toEqual({
        transliterationLineInput: "2' # [ … °MUNUS.MEŠ°zi-i]n-tu-ḫi-e-eš",
        result: tl(2, [
          wr('[', w(ds)),
          wr('…', w(el)),
          wr('°MUNUS.MEŠ°zi-i]n-tu-ḫi-e-eš', w(dt('MUNUS.MEŠ'), ht('zi-i'), de, ht('n-tu-ḫi-e-eš')))
        ])
      });

    expect(parseTransliterationLine("3' # [ … -i]a-u-an-zi tar-kum-mi-ia-iz-zi ¬¬¬"))
      .toEqual({
        transliterationLineInput: "3' # [ … -i]a-u-an-zi tar-kum-mi-ia-iz-zi ¬¬¬",
        result: tl(3, [
          wr('[', w(ds)),
          wr('…', w(el)),
          wr('-i]a-u-an-zi', w(ht('-i'), de, ht('a-u-an-zi'))),
          wr('tar-kum-mi-ia-iz-zi', w(ht('tar-kum-mi-ia-iz-zi'))),
          wr('¬¬¬', w(pe))
        ])
      });

    expect(parseTransliterationLine("4' # [ … °G]IŠ°BANŠUR °GIŠ°BANŠUR an-da"))
      .toEqual({
        transliterationLineInput: "4' # [ … °G]IŠ°BANŠUR °GIŠ°BANŠUR an-da",
        result: tl(4, [
          wr('[', w(ds)),
          wr('…', w(el)),
          wr('°G]IŠ°BANŠUR'),
          wr('°GIŠ°BANŠUR', w(dt('GIŠ'), sg('BANŠUR'))),
          wr('an-da', w(ht('an-da')))
        ])
      });

    expect(parseTransliterationLine("5' # [ … ] ⸢6⸣ NINDA.GUR₄.RA°ḪI.A° ki-an-da"))
      .toEqual({
        transliterationLineInput: "5' # [ … ] ⸢6⸣ NINDA.GUR₄.RA°ḪI.A° ki-an-da",
        result: tl(5, [
          wr('[', w(ds)),
          wr('…', w(el)),
          wr(']', w(de)),
          wr('⸢6⸣', w(ls, nc('6'), le)),
          wr('NINDA.GUR₄.RA°ḪI.A°', w(sg('NINDA.GUR'), nc('4', true), sg('.RA'), dt('ḪI.A'))),
          wr('ki-an-da', w(ht('ki-an-da')))
        ])
      });

    expect(parseTransliterationLine("6' # [ … -t]i-ia še-er pé-ra-an da-a-i ¬¬¬"))
      .toEqual({
        transliterationLineInput: "6' # [ … -t]i-ia še-er pé-ra-an da-a-i ¬¬¬",
        result: tl(6, [
          wr('[', w(ds)),
          wr('…', w(el)),
          wr('-t]i-ia', w(ht('-t'), de, ht('i-ia'))),
          wr('še-er', w(ht('še-er'))),
          wr('pé-ra-an', w(ht('pé-ra-an'))),
          wr('da-a-i', w(ht('da-a-i'))),
          wr('¬¬¬', w(pe))
        ])
      });

    expect(parseTransliterationLine("7' # [ … pé-r]a-an ḫu-u-wa-a-i"))
      .toEqual({
        transliterationLineInput: "7' # [ … pé-r]a-an ḫu-u-wa-a-i",
        result: tl(7, [
          wr('[', w(ds)),
          wr('…', w(el)),
          wr('pé-r]a-an', w(ht('pé-r'), de, ht('a-an'))),
          wr('ḫu-u-wa-a-i', w(ht('ḫu-u-wa-a-i')))
        ])
      });

    expect(parseTransliterationLine("8' # [ … °MUNUS.MEŠ°zi]-⸢in-tu-ḫi⸣-e-eš an-da {Rasur}"))
      .toEqual({
        transliterationLineInput: "8' # [ … °MUNUS.MEŠ°zi]-⸢in-tu-ḫi⸣-e-eš an-da {Rasur}",
        result: tl(8, [
          wr('[', w(ds)),
          wr('…', w(el)),
          wr('°MUNUS.MEŠ°zi]-⸢in-tu-ḫi⸣-e-eš', w(dt('MUNUS.MEŠ'), ht('zi'), de, ht('-'), ls, ht('in-tu-ḫi'), le, ht('-e-eš'))),
          wr('an-da', w(ht('an-da'))),
          wr('{Rasur}')
        ])
      });

    expect(parseTransliterationLine("9' # [ú-wa-an-zi … k]i?-an-ta ¬¬¬"))
      .toEqual({
        transliterationLineInput: "9' # [ú-wa-an-zi … k]i?-an-ta ¬¬¬",
        result: tl(9, [
          wr('[ú-wa-an-zi', w(ds, ht('ú-wa-an-zi'))),
          wr('…', w(el)),
          wr('k]i?-an-ta', w(ht('k'), de, ht('i'), uc, ht('-an-ta'))),
          wr('¬¬¬', w(pe))
        ])
      });

    expect(parseTransliterationLine("10' # [ … ] x-zi ¬¬¬"))
      .toEqual({
        transliterationLineInput: "10' # [ … ] x-zi ¬¬¬",
        result: tl(10, [
          wr('[', w(ds)),
          wr('…', w(el)),
          wr(']', w(de)),
          wr('x-zi', w(ht('x-zi'))),
          wr('¬¬¬', w(pe))
        ])
      });

    expect(parseTransliterationLine("11' # [ … ]-da"))
      .toEqual({
        transliterationLineInput: "11' # [ … ]-da",
        result: tl(11, [
          wr('[', w(ds)),
          wr('…', w(el)),
          wr(']-da', w(de, ht('-da')))
        ])
      });

    expect(parseTransliterationLine("12' # [ … °LÚ°ALAM.Z]U₉"))
      .toEqual({
        transliterationLineInput: "12' # [ … °LÚ°ALAM.Z]U₉",
        result: tl(12, [
          wr('[', w(ds)),
          wr('…', w(el)),
          wr('°LÚ°ALAM.Z]U₉', w(dt('LÚ'), sg('ALAM.Z'), de, sg('U'), nc('9', true)))
        ])
      });

    expect(parseTransliterationLine("13' # [ … -z]i ¬¬¬"))
      .toEqual({
        transliterationLineInput: "13' # [ … -z]i ¬¬¬",
        result: tl(13, [
          wr('[', w(ds)),
          wr('…', w(el)),
          wr('-z]i', w(ht('-z'), de, ht('i'))),
          wr('¬¬¬', w(pe))
        ])
      });

    expect(parseTransliterationLine("%r. Kol."))
      .toEqual({transliterationLineInput: "%r. Kol."});


    /*
    expect(parseTransliterationLine("1' # [x x] x x [ ¬¬¬"))
      .toEqual({
        transliterationLineInput: "1' # [x x] x x [ ¬¬¬",
        result: tl(1, [w(ds, ht('x')), w(ht('x'), de), w(ht('x')), w(ht('x')), w(ds), w(pe)])
      });
     */

    expect(parseTransliterationLine("2' # LUGAL-uš GUB-[aš"))
      .toEqual({
        transliterationLineInput: "2' # LUGAL-uš GUB-[aš",
        result: tl(2, [
          wr('LUGAL-uš', w(sg('LUGAL'), ht('-uš'))),
          wr('GUB-[aš', w(sg('GUB'), ht('-'), ds, ht('aš')))
        ])
      });

    expect(parseTransliterationLine("3' # °D°UTU °D°U ⸢°D°⸣["))
      .toEqual({
        transliterationLineInput: "3' # °D°UTU °D°U ⸢°D°⸣[",
        result: tl(3, [
          wr('°D°UTU', w(dt('D'), sg('UTU'))),
          wr('°D°U', w(dt('D'), sg('U'))),
          wr('⸢°D°⸣[', w(ls, dt('D'), le, ds))
        ])
      });

    expect(parseTransliterationLine("4' # °D°zi-in-t[u-ḫi ¬¬¬"))
      .toEqual({
        transliterationLineInput: "4' # °D°zi-in-t[u-ḫi ¬¬¬",
        result: tl(4, [
          wr('°D°zi-in-t[u-ḫi', w(dt('D'), ht('zi-in-t'), ds, ht('u-ḫi'))),
          wr('¬¬¬', w(pe))
        ])
      });

    expect(parseTransliterationLine("5' # °LÚ°SAGI.A 1 NINDA.G[UR₄.RA _EM-ṢA]"))
      .toEqual({
        transliterationLineInput: "5' # °LÚ°SAGI.A 1 NINDA.G[UR₄.RA _EM-ṢA]",
        result: tl(5, [
          wr('°LÚ°SAGI.A', w(dt('LÚ'), sg('SAGI.A'))),
          wr('1', w(nc('1'))),
          wr('NINDA.G[UR₄.RA', w(sg('NINDA.G'), ds, sg('UR'), nc('4', true), sg('.RA'))),
          wr('_EM-ṢA]', w(ag('EM-ṢA'), de))
        ])
      });

    expect(parseTransliterationLine("6' # LUGAL-i pa-a-i LUGAL-u[š pár-ši-ia] ¬¬¬"))
      .toEqual({
        transliterationLineInput: "6' # LUGAL-i pa-a-i LUGAL-u[š pár-ši-ia] ¬¬¬",
        result: tl(6, [
          wr('LUGAL-i', w(sg('LUGAL'), ht('-i'))),
          wr('pa-a-i', w(ht('pa-a-i'))),
          wr('LUGAL-u[š', w(sg('LUGAL'), ht('-u'), ds, ht('š'))),
          wr('pár-ši-ia]', w(ht('pár-ši-ia'), de)),
          wr('¬¬¬', w(pe))
        ])
      });

    expect(parseTransliterationLine("7' # ta-aš-ta °MUNUS.MEŠ°zi-[in-tu-ḫi-e-eš"))
      .toEqual({
        transliterationLineInput: "7' # ta-aš-ta °MUNUS.MEŠ°zi-[in-tu-ḫi-e-eš",
        result: tl(7, [
          wr('ta-aš-ta', w(ht('ta-aš-ta'))),
          wr('°MUNUS.MEŠ°zi-[in-tu-ḫi-e-eš', w(dt('MUNUS.MEŠ'), ht('zi-'), ds, ht('in-tu-ḫi-e-eš')))
        ])
      });

    expect(parseTransliterationLine("8' # pa-ra-a [ ¬¬¬"))
      .toEqual({
        transliterationLineInput: "8' # pa-ra-a [ ¬¬¬",
        result: tl(8, [
          wr('pa-ra-a', w(ht('pa-ra-a'))),
          wr('[', w(ds)),
          wr('¬¬¬', w(pe))
        ])
      });

    expect(parseTransliterationLine("9' # pár-aš-na-a-u-<aš>-kán °LÚ°SAG[I.A ¬¬¬"))
      .toEqual({
        transliterationLineInput: "9' # pár-aš-na-a-u-<aš>-kán °LÚ°SAG[I.A ¬¬¬",
        result: tl(9, [
          wr('pár-aš-na-a-u-<aš>-kán', w(ht('pár-aš-na-a-u-'), supS, ht('aš'), supE, ht('-kán'))),
          wr('°LÚ°SAG[I.A', w(dt('LÚ'), sg('SAG'), ds, sg('I.A'))),
          wr('¬¬¬', w(pe))
        ])
      });

    expect(parseTransliterationLine("10' # LUGAL-uš TUŠ-aš <°D°>iz-zi-i[š?-ta?-nu?"))
      .toEqual({
        transliterationLineInput: "10' # LUGAL-uš TUŠ-aš <°D°>iz-zi-i[š?-ta?-nu?",
        result: tl(10, [
          wr('LUGAL-uš', w(sg('LUGAL'), ht('-uš'))),
          wr('TUŠ-aš', w(sg('TUŠ'), ht('-aš'))),
          wr('<°D°>iz-zi-i[š?-ta?-nu?', w(supS, dt('D'), supE, ht('iz-zi-i'), ds, ht('š'), uc, ht('-ta'), uc, ht('-nu'), uc))
        ])
      });

    expect(parseTransliterationLine("11' # e-ku-zi GIŠ ⸢°D°⸣[INANNA ¬¬¬"))
      .toEqual({
        transliterationLineInput: "11' # e-ku-zi GIŠ ⸢°D°⸣[INANNA ¬¬¬",
        result: tl(11, [
          wr('e-ku-zi', w(ht('e-ku-zi'))),
          wr('GIŠ', w(sg('GIŠ'))),
          wr('⸢°D°⸣[INANNA', w(ls, dt('D'), le, ds, sg('INANNA'))),
          wr('¬¬¬', w(pe))
        ])
      });

    expect(parseTransliterationLine("12' # °LÚ°SAGI.A [1 NINDA.GUR₄.RA EM-ṢA]"))
      .toEqual({
        transliterationLineInput: "12' # °LÚ°SAGI.A [1 NINDA.GUR₄.RA EM-ṢA]",
        result: tl(12, [
          wr('°LÚ°SAGI.A', w(dt('LÚ'), sg('SAGI.A'))),
          wr('[1', w(ds, nc('1'))),
          wr('NINDA.GUR₄.RA', w(sg('NINDA.GUR'), nc('4', true), sg('.RA'))),
          wr('EM-ṢA]', w(sg('EM'), ag('ṢA'), de))
        ])
      });

    expect(parseTransliterationLine("13' # LUGAL-i pa-a-i [LUGAL-uš pár-ši-ia] ¬¬¬"))
      .toEqual({
        transliterationLineInput: "13' # LUGAL-i pa-a-i [LUGAL-uš pár-ši-ia] ¬¬¬",
        result: tl(13, [
          wr('LUGAL-i', w(sg('LUGAL'), ht('-i'))),
          wr('pa-a-i', w(ht('pa-a-i'))),
          wr('[LUGAL-uš', w(ds, sg('LUGAL'), ht('-uš'))),
          wr('pár-ši-ia]', w(ht('pár-ši-ia'), de)),
          wr('¬¬¬', w(pe))
        ])
      });

    expect(parseTransliterationLine("14' # GAL DUMU.MEŠ ⸢É⸣.[GAL"))
      .toEqual({
        transliterationLineInput: "14' # GAL DUMU.MEŠ ⸢É⸣.[GAL",
        result: tl(14, [
          wr('GAL', w(sg('GAL'))),
          wr('DUMU.MEŠ', w(sg('DUMU.MEŠ'))),
          wr('⸢É⸣.[GAL', w(ls, sg('É'), le, sg('.'), ds, sg('GAL')))
        ])
      });

    expect(parseTransliterationLine("15' # °LÚ.MEŠ°GA[LA ¬¬¬"))
      .toEqual({
        transliterationLineInput: "15' # °LÚ.MEŠ°GA[LA ¬¬¬",
        result: tl(15, [
          wr('°LÚ.MEŠ°GA[LA', w(dt('LÚ.MEŠ'), sg('GA'), ds, sg('LA'))),
          wr('¬¬¬', w(pe))
        ])
      });

    expect(parseTransliterationLine("16' # ⸢na-aš⸣-k[án"))
      .toEqual({
        transliterationLineInput: "16' # ⸢na-aš⸣-k[án",
        result: tl(16, [
          wr('⸢na-aš⸣-k[án', w(ls, ht('na-aš'), le, ht('-k'), ds, ht('án')))
        ])
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
        result: tl(1, [
          wr('a-na', w(ht('a-na'))),
          wr('ša', w(ht('ša'))),
          wr('ki-ma', w(ht('ki-ma'))),
          wr('|'),
          wr('i-a-tí', w(ht('i-a-tí'))),
          wr('|'),
          wr('ù!', w(ht('ù'), sc)),
          wr('ku-li', w(ht('ku-li')))
        ], true)
      });

    expect(parseTransliterationLine("2 # a-na ku-li | qí-bi₄-ma | um-ma"))
      .toEqual({
        transliterationLineInput: "2 # a-na ku-li | qí-bi₄-ma | um-ma",
        result: tl(2, [
          wr('a-na', w(ht('a-na'))),
          wr('ku-li', w(ht('ku-li'))),
          wr('|'),
          wr('qí-bi₄-ma', w(ht('qí-bi'), nc('4', true), ht('-ma'))),
          wr('|'),
          wr('um-ma', w(ht('um-ma')))
        ], true)
      });

    expect(parseTransliterationLine("3 # a-šùr-e-na-ma 2 MA.NA 2 ⅔ GÍN"))
      .toEqual({
        transliterationLineInput: "3 # a-šùr-e-na-ma 2 MA.NA 2 ⅔ GÍN",
        result: tl(3, [
          wr('a-šùr-e-na-ma', w(ht('a-šùr-e-na-ma'))),
          wr('2', w(nc('2'))),
          wr('MA.NA', w(sg('MA.NA'))),
          wr('2', w(nc('2'))),
          wr('⅔'),
          wr('GÍN', w(sg('GÍN')))
        ], true)
      });

    expect(parseTransliterationLine("4 # KÙ.BABBAR | ša li-bi₄-kà | ša a-na MU 1.[ŠÈ]"))
      .toEqual({
        transliterationLineInput: "4 # KÙ.BABBAR | ša li-bi₄-kà | ša a-na MU 1.[ŠÈ]",
        result: tl(4, [
          wr('KÙ.BABBAR', w(sg('KÙ.BABBAR'))),
          wr('|'),
          wr('ša', w(ht('ša'))),
          wr('li-bi₄-kà', w(ht('li-bi'), nc('4', true), ht('-kà'))),
          wr('|'),
          wr('ša', w(ht('ša'))),
          wr('a-na', w(ht('a-na'))),
          wr('MU', w(sg('MU'))),
          wr('1.[ŠÈ]', w(nc('1'), sg('.'), ds, sg('ŠÈ'), de))
        ], true)
      });

    expect(parseTransliterationLine("5 # ša-qá-lìm | qá-bi₄-a-tí-ni"))
      .toEqual({
        transliterationLineInput: "5 # ša-qá-lìm | qá-bi₄-a-tí-ni",
        result: tl(5, [
          wr('ša-qá-lìm', w(ht('ša-qá-lìm'))),
          wr('|'),
          wr('qá-bi₄-a-tí-ni', w(ht('qá-bi'), nc('4', true), ht('-a-tí-ni')))
        ], true)
      });

    expect(parseTransliterationLine("6 # ITI 1°KAM° | ku-zal-li | li-mu-um"))
      .toEqual({
        transliterationLineInput: "6 # ITI 1°KAM° | ku-zal-li | li-mu-um",
        result: tl(6, [
          wr('ITI', w(sg('ITI'))),
          wr('1°KAM°', w(nc('1'), dt('KAM'))),
          wr('|'),
          wr('ku-zal-li', w(ht('ku-zal-li'))),
          wr('|'),
          wr('li-mu-um', w(ht('li-mu-um')))
        ], true)
      });

    expect(parseTransliterationLine("7 # am-ri-iš₈-tár DUMU ma-num-ba-lúm-a-šùr"))
      .toEqual({
        transliterationLineInput: "7 # am-ri-iš₈-tár DUMU ma-num-ba-lúm-a-šùr",
        result: tl(7, [
          wr('am-ri-iš₈-tár', w(ht('am-ri-iš'), nc('8', true), ht('-tár'))),
          wr('DUMU', w(sg('DUMU'))),
          wr('ma-num-ba-lúm-a-šùr', w(ht('ma-num-ba-lúm-a-šùr')))
        ], true)
      });

    expect(parseTransliterationLine("8 # i-na ṭup-pì-kà | a-šùr-mu-da-mì-i[q]"))
      .toEqual({
        transliterationLineInput: "8 # i-na ṭup-pì-kà | a-šùr-mu-da-mì-i[q]",
        result: tl(8, [
          wr('i-na', w(ht('i-na'))),
          wr('ṭup-pì-kà', w(ht('ṭup-pì-kà'))),
          wr('|'),
          wr('a-šùr-mu-da-mì-i[q]', w(ht('a-šùr-mu-da-mì-i'), ds, ht('q'), de))
        ], true)
      });

    expect(parseTransliterationLine("9 # DUMU sá-ak-lá-nim | ⸢ú e⸣-dí-na-a"))
      .toEqual({
        transliterationLineInput: "9 # DUMU sá-ak-lá-nim | ⸢ú e⸣-dí-na-a",
        result: tl(9, [
          wr('DUMU', w(sg('DUMU'))),
          wr('sá-ak-lá-nim', w(ht('sá-ak-lá-nim'))),
          wr('|'),
          wr('⸢ú', w(ls, ht('ú'))),
          wr('e⸣-dí-na-a', w(ht('e'), le, ht('-dí-na-a')))
        ], true)
      });

    expect(parseTransliterationLine("10 # [DU]MU a-a-a | kà-an-ku-ni 1 GÍN KÙ.BABBAR"))
      .toEqual({
        transliterationLineInput: "10 # [DU]MU a-a-a | kà-an-ku-ni 1 GÍN KÙ.BABBAR",
        result: tl(10, [
          wr('[DU]MU', w(ds, sg('DU'), de, sg('MU'))),
          wr('a-a-a', w(ht('a-a-a'))),
          wr('|'),
          wr('kà-an-ku-ni', w(ht('kà-an-ku-ni'))),
          wr('1', w(nc('1'))),
          wr('GÍN', w(sg('GÍN'))),
          wr('KÙ.BABBAR', w(sg('KÙ.BABBAR')))
        ], true)
      });

    expect(parseTransliterationLine("11 # lá tù-qá-ri-ba-am"))
      .toEqual({
        transliterationLineInput: "11 # lá tù-qá-ri-ba-am",
        result: tl(11, [
          wr('lá', w(ht('lá'))),
          wr('tù-qá-ri-ba-am', w(ht('tù-qá-ri-ba-am')))
        ], true)
      });

    expect(parseTransliterationLine("12 # i-na °d°UTU-ši na-áš-pì-ir-⸢tí⸣"))
      .toEqual({
        transliterationLineInput: "12 # i-na °d°UTU-ši na-áš-pì-ir-⸢tí⸣",
        result: tl(12, [
          wr('i-na', w(ht('i-na'))),
          wr('°d°UTU-ši', w(ml('d'), sg('UTU'), ht('-ši'))),
          wr('na-áš-pì-ir-⸢tí⸣', w(ht('na-áš-pì-ir-'), ls, ht('tí'), le))
        ], true)
      });

    expect(parseTransliterationLine("%u. Rd."))
      .toEqual({transliterationLineInput: "%u. Rd."});

    expect(parseTransliterationLine("13 # ta-ša-me-{Rasur}⸢ú⸣"))
      .toEqual({
        transliterationLineInput: "13 # ta-ša-me-{Rasur}⸢ú⸣",
        result: tl(13, [
          wr('ta-ša-me-{Rasur}⸢ú⸣')
        ], true)
      });

    /*
    expect(parseTransliterationLine("14 # x x x x x ["))
      .toEqual({
        transliterationLineInput: "14 # x x x x x [",
        result: tl(14, [w(ht('x')), w(ht('x')), w(ht('x')), w(ht('x')), w(ht('x')), w(ds)], true)
      });
     */
  });
});