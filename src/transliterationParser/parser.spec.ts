import {parseTransliterationLine} from './parser';
import {
  TransliterationTextLineParseResult,
  transliterationWord as w
} from '../model/transliterationTextLineParseResult';
import {
  akkadogrammContentUnion as ag,
  de,
  determinativContentUnion as dt,
  ds,
  el,
  hittiteContentUnion as ht,
  le,
  ls,
  markContentUnion as mc,
  materLectionisContentUnion as ml,
  numeralContentUnion as nc,
  pe,
  r,
  sc,
  sumerogrammContentUnion as sg,
  supE,
  supS,
  uc,
  ue,
  us,
  wordResult as wr
} from './testHelpers';
import {MarkType} from '../generated/graphql';

describe('The transliteration parser', () => {

  it('should do what simtex does', () => {
    expect(parseTransliterationLine("1# ta LUGAL-uš A-NA DUTU AN-E x GUx.MAḪ pa-a-i {K:34}"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(1, true, [
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
        ])
      );

    expect(parseTransliterationLine("1'# [ ... ] ⸢ú?-e?-te-na-an-za⸣"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(1, false, [
          // <w><del_in/></w> <w><sGr>...</sGr></w>
          wr('[', w(ds)), wr('...', w(sg('...'))),
          // <w><del_fin/></w>
          wr(']', w(de)),
          // <w><laes_in/>ú<corr c='?'/>-e<corr c='?'/>-te-na-an-za<laes_fin/></w>
          wr('⸢ú?-e?-te-na-an-za⸣', w(ls, ht('ú'), uc, ht('-e'), uc, ht('-te-na-an-za'), le))
        ])
      );

    expect(parseTransliterationLine("2'# [ ... ] ⸢nu⸣ LÚKÚR ku-e-da-ni pé-di"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(
          2, false, [
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
      );

    expect(parseTransliterationLine("3'# [ ... wa-ar-pa da-a]-iš* *na-aš-kán a-pé-e-ez"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(3, false, [
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
      );

    expect(parseTransliterationLine("4'# [ ... Mdu-ut-ḫa-l]i-ia-aš GAL ME-ŠE-DI"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(4, false, [
          // <w><del_in/></w> <w><sGr>...</sGr></w>
          wr('[', w(ds)), wr('...', w(sg('...'))),
          // <w>mdu-ut-ḫa-l<del_fin/>i-ia-aš</w>
          wr('Mdu-ut-ḫa-l]i-ia-aš', w(ht('mdu-ut-ḫa-l'), ds, ht('i-ia-aš'))),
          // <w><sGr>GAL</sGr></w>
          wr('GAL', w(sg('GAL'))),
          // <w><sGr>ME</sGr><aGr>-ŠE-DI</aGr></w>
          wr('ME-ŠE-DI', w(sg('ME'), ag('ŠE-DI')))
        ])
      );

    expect(parseTransliterationLine("5'# [ ... -uš-m]a-⸢aš-ši⸣ ku-i-e-eš"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(5, false, [
          // <w><del_in/></w> <w><sGr>...</sGr></w>
          wr('[', w(ds)), wr('...', w(sg('...'))),
          // <w>-uš-m<del_fin/>a-<laes_in/>aš-ši<laes_fin/></w>
          wr('-uš-m]a-⸢aš-ši⸣', w(ht('-uš-m'), de, ht('a-'), ls, ht('aš-ši'), le)),
          // <w>ku-i-e-eš</w>
          wr('ku-i-e-eš', w(ht('ku-i-e-eš')))
        ])
      );

    expect(parseTransliterationLine("6'# [ ... pa-ra-a] da-a-aš ¬¬¬"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(6, false, [
          // <w><del_in/></w> <w><sGr>...</sGr></w>
          wr('[', w(ds)), wr('...', w(sg('...'))),
          // <w>pa-ra-a<del_fin/></w>
          wr('pa-ra-a]', w(ht('pa-ra-a'), de)),
          // <w>da-a-aš</w>
          wr('da-a-aš', w(ht('da-a-aš'))),
          // </s></p><parsep/><p><s>
          wr('¬¬¬', w(pe))
        ])
      );

    expect(parseTransliterationLine("7'# [ ... ] x  °m°mur-ši--DINGIR-LIM °MUNUS°ŠU.GI LÚ°MEŠ° DINGIR°MEŠ°-aš"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(7, false, [
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
      );

    expect(parseTransliterationLine("8'# [ ] °m°°.°°D°30--SUM  ù °m.D°30--SUM{F: Problem mit den Punkten in Determinativen.}"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(8, false, [
          // <w><del_in/></w> <w><del_fin/></w>
          wr('[', w(ds)), wr(']', w(de)),
          // <w><d>m.D</d><sGr>30</sGr>-<sGr>SUM</sGr></w>
          wr('°m°°.°°D°30--SUM', w(dt('m.D'), sg('30'), ht('-'), sg('SUM'))),
          // <w>ù</w>
          wr('ù', w(ht('ù'))),
          // <w><SP___AO_3a_MaterLect>m.D</SP___AO_3a_MaterLect><num>30</num>-<sGr>SUM</sGr><note  n='1'  c="   &lt;P_f_Footnote&gt;Problem mit den Punkten in Determinativen.&lt;/P_f_Footnote&gt;"  /></w>
          wr('°m.D°30--SUM{F: Problem mit den Punkten in Determinativen.}', w(ml('m.D'), nc('30'), ht('-'), sg('SUM'), '<note  n=\'1\'  c="   &lt;P_f_Footnote&gt;Problem mit den Punkten in Determinativen.&lt;/P_f_Footnote&gt;"  />'))
        ])
      );

    expect(parseTransliterationLine("9' # °URU°?ša-mu-ḫa °URU°!ša-*mu-ḫa*   °URU?°ša?-mu-ḫa °URU!°ša-mu!-ḫa"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(9, false, [
          // <w><d>URU</d><corr c='?'/>ša-mu-ḫa</w>
          wr('°URU°?ša-mu-ḫa', w(dt('URU'), uc, ht('ša-mu-ḫa'))),
          // <w><d>URU</d><corr c='!'/>ša-<ras_in/>mu-ḫa<ras_fin/></w>
          wr('°URU°!ša-*mu-ḫa*', w(dt('URU'), sc, ht('ša-'), r, ht('mu-ḫa'), r)),
          // <w><SP___AO_3a_MaterLect>URU?</SP___AO_3a_MaterLect>ša<corr c='?'/>-mu-ḫa</w>
          wr('°URU?°ša?-mu-ḫa'/*, TODO: w(ml('URU?'), ht('ša'), uc, ht('-mu-ḫa')*/),
          // <w><SP___AO_3a_MaterLect>URU!</SP___AO_3a_MaterLect>ša-mu<corr c='!'/>-ḫa</w>
          wr('°URU!°ša-mu!-ḫa' /* TODO:, w(ml('URU!'), ht('ša-mu'), sc, ht('-ḫa'))*/)
        ])
      );

    expect(parseTransliterationLine("10# BLABLA-ṢU _ŠI-PÁT"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(10, true, [
          // <w><sGr>BLABLA</sGr><aGr>-ṢU</aGr></w>
          wr('BLABLA-ṢU', w(sg('BLABLA'), ag('-ṢU'))),
          // <w><aGr>ŠI-PÁT</aGr></w>
          wr('_ŠI-PÁT', w(ag('ŠI-PÁT')))
        ])
      );

    expect(parseTransliterationLine("11 # šaṭ-rat°at° °MUNUS.MEŠ°kat°at°-re-eš {G: fünf Zeichen abgebr.} kar-°di°dim-mi-ia-az §§"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(11, true, [
          // <w>šaṭ-rat<SP___AO_3a_MaterLect>at</SP___AO_3a_MaterLect></w>
          wr('šaṭ-rat°at°', w(ht('šaṭ-rat'), ml('at'))),
          //  <w><d>MUNUS.MEŠ</d>kat<SP___AO_3a_MaterLect>at</SP___AO_3a_MaterLect>-re-eš</w>
          wr('°MUNUS.MEŠ°kat°at°-re-eš', w(dt('MUNUS.MEŠ'), ht('kat'), ml('at'), ht('-re-eš'))),
          //  <gap c="fünf Zeichen abgebr."/>
          wr('{G: fünf Zeichen abgebr.}', w('<gap c="fünf Zeichen abgebr."/>')),
          // <w>kar-<SP___AO_3a_MaterLect>di</SP___AO_3a_MaterLect>dim-mi-ia-az</w> </s></p><parsep_dbl/><p><s>
          wr('kar-°di°dim-mi-ia-az', w(ht('kar-'), ml('di'), ht('dim-mi-ia-az'))),
          wr('§§', w('</s></p><parsep_dbl/><p>'))
        ])
      );

    expect(parseTransliterationLine("12 # GU4 ka4 ubx ub[x K]AxU §"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(12, true, [
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
        ])
      );

    expect(parseTransliterationLine("13 # 4 GU4"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(13, true, [
          // <w><num>4</num></w>
          wr('4', w(nc('4'))),
          // <w><sGr>GU₄</sGr></w>
          wr('GU4', w(sg('GU₄')))
        ])
      );

    expect(parseTransliterationLine("14 # 4 GU4"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(14, true, [
          // <w><num>4</num></w>
          wr('4', w(nc('4'))),
          // <w><sGr>GU₄</sGr></w>
          wr('GU4', w(sg('GU₄')))
        ])
      );

    expect(parseTransliterationLine("15 # DUB 2°KAM°"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(15, true, [
          // <w><sGr>DUB</sGr></w>
          wr('DUB', w(sg('DUB'))),
          // <w><num>2</num><d>KAM</d></w>
          wr('2°KAM°', w(nc('2'), dt('KAM')))
        ])
      );
  });

  it('should parse complete document', () => {
    expect(parseTransliterationLine("1' # [(x)] x ⸢zi⸣ x [",))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(1, false, [
          wr('[(x)]', w(ds, us, ht('x'), ue, de)),
          wr('x', w(ht('x'))),
          wr('⸢zi⸣', w(ls, ht('zi'), le)),
          wr('x', w(ht('x'))),
          wr('[', w(ds))
        ])
      );

    expect(parseTransliterationLine("2' # [DUMU?].MUNUS?-ma e-ša-⸢a⸣-[ri"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(2, false, [
          wr('[DUMU?].MUNUS?-ma', w(ds, sg('DUMU'), uc, de, sg('.MUNUS'), uc, ht('-ma'))),
          wr('e-ša-⸢a⸣-[ri', w(ht('e-ša-'), ls, ht('a'), le, ht('-'), ds, ht('ri')))
        ])
      );

    expect(parseTransliterationLine("3' # az-zi-ik-ki-it-[tén"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(3, false, [
          wr('az-zi-ik-ki-it-[tén', w(ht('az-zi-ik-ki-it-'), ds, ht('tén')))
        ])
      );

    expect(parseTransliterationLine("4' # nu ḫu-u-ma-an az-[zi-ik-ki- ¬¬¬"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(4, false, [
          wr('nu', w(ht('nu'))),
          wr('ḫu-u-ma-an', w(ht('ḫu-u-ma-an'))),
          wr('az-[zi-ik-ki-', w(ht('az-'), ds, ht('zi-ik-ki-'))),
          wr('¬¬¬', w(pe))
        ])
      );

    expect(parseTransliterationLine("5' # [k]u-it-ma-an-aš-ma x ["))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(5, false, [
          wr('[k]u-it-ma-an-aš-ma', w(ds, ht('k'), de, ht('u-it-ma-an-aš-ma'))),
          wr('x', w(ht('x'))),
          wr('[', w(ds))
        ])
      );

    expect(parseTransliterationLine("6' # [n]a-aš-kán GIŠ.NÁ ["))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(6, false, [
          wr('[n]a-aš-kán', w(ds, ht('n'), de, ht('a-aš-kán'))),
          wr('GIŠ.NÁ', w(sg('GIŠ.NÁ'))),
          wr('[', w(ds))
        ])
      );

    expect(parseTransliterationLine("7' # [nu-u]š-ši ša-aš-t[a-"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(7, false, [
          wr('[nu-u]š-ši', w(ds, ht('nu-u'), de, ht('š-ši'))),
          wr('ša-aš-t[a-', w(ht('ša-aš-t'), ds, ht('a-')))
        ])
      );

    expect(parseTransliterationLine("8' # [da?]-⸢a?⸣ nu-uš-ši x ["))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(8, false, [
          wr('[da?]-⸢a?⸣', w(ds, ht('da'), uc, de, ht('-'), ls, ht('a'), uc, le)),
          wr('nu-uš-ši', w(ht('nu-uš-ši'))),
          wr('x', w(ht('x'))),
          wr('[', w(ds))
        ])
      );

    expect(parseTransliterationLine("9' # [nu-u]š-ši im-ma(-)["))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(9, false, [
          wr('[nu-u]š-ši', w(ds, ht('nu-u'), de, ht('š-ši'))),
          wr('im-ma(-)[', w(ht('im-ma'), us, ht('-'), ue, ds))
        ])
      );

    expect(parseTransliterationLine("10' # [x-x]-TE°MEŠ° ⸢e⸣-["))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(10, false, [
          wr('[x-x]-TE°MEŠ°', w(ds, ht('x-x'), de, ag('TE'), dt('MEŠ'))),
          wr('⸢e⸣-[', w(ls, ht('e'), le, ht('-'), ds))
        ])
      );

    expect(parseTransliterationLine("11' # [x (x)]-ri-⸢ia⸣-[ ¬¬¬"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(11, false, [
          wr('[x', w(ds, ht('x'))),
          wr('(x)]-ri-⸢ia⸣-[', w(us, ht('x'), ue, de, ht('-ri-'), ls, ht('ia'), le, ht('-'), ds)),
          wr('¬¬¬', w(pe))
        ])
      );

    expect(parseTransliterationLine("12' # [x x] x ["))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(12, false, [
          wr('[x', w(ds, ht('x'))),
          wr('x]', w(ht('x'), de)),
          wr('x', w(ht('x'))),
          wr('[', w(ds))
        ])
      );

    expect(parseTransliterationLine("1' # [ … ] x ¬¬¬"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(1, false, [
          wr('[', w(ds)),
          wr('…', w(el)),
          wr(']', w(de)),
          wr('x', w(ht('x'))),
          wr('¬¬¬', w(pe))
        ])
      );

    expect(parseTransliterationLine("2' # [ … °MUNUS.MEŠ°zi-i]n-tu-ḫi-e-eš"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(2, false, [
          wr('[', w(ds)),
          wr('…', w(el)),
          wr('°MUNUS.MEŠ°zi-i]n-tu-ḫi-e-eš', w(dt('MUNUS.MEŠ'), ht('zi-i'), de, ht('n-tu-ḫi-e-eš')))
        ])
      );

    expect(parseTransliterationLine("3' # [ … -i]a-u-an-zi tar-kum-mi-ia-iz-zi ¬¬¬"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(3, false, [
          wr('[', w(ds)),
          wr('…', w(el)),
          wr('-i]a-u-an-zi', w(ht('-i'), de, ht('a-u-an-zi'))),
          wr('tar-kum-mi-ia-iz-zi', w(ht('tar-kum-mi-ia-iz-zi'))),
          wr('¬¬¬', w(pe))
        ])
      );

    expect(parseTransliterationLine("4' # [ … °G]IŠ°BANŠUR °GIŠ°BANŠUR an-da"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(4, false, [
          wr('[', w(ds)),
          wr('…', w(el)),
          wr('°G]IŠ°BANŠUR'),
          wr('°GIŠ°BANŠUR', w(dt('GIŠ'), sg('BANŠUR'))),
          wr('an-da', w(ht('an-da')))
        ])
      );

    expect(parseTransliterationLine("5' # [ … ] ⸢6⸣ NINDA.GUR₄.RA°ḪI.A° ki-an-da"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(5, false, [
          wr('[', w(ds)),
          wr('…', w(el)),
          wr(']', w(de)),
          wr('⸢6⸣', w(ls, nc('6'), le)),
          wr('NINDA.GUR₄.RA°ḪI.A°', w(sg('NINDA.GUR'), nc('4', true), sg('.RA'), dt('ḪI.A'))),
          wr('ki-an-da', w(ht('ki-an-da')))
        ])
      );

    expect(parseTransliterationLine("6' # [ … -t]i-ia še-er pé-ra-an da-a-i ¬¬¬"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(6, false, [
          wr('[', w(ds)),
          wr('…', w(el)),
          wr('-t]i-ia', w(ht('-t'), de, ht('i-ia'))),
          wr('še-er', w(ht('še-er'))),
          wr('pé-ra-an', w(ht('pé-ra-an'))),
          wr('da-a-i', w(ht('da-a-i'))),
          wr('¬¬¬', w(pe))
        ])
      );

    expect(parseTransliterationLine("7' # [ … pé-r]a-an ḫu-u-wa-a-i"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(7, false, [
          wr('[', w(ds)),
          wr('…', w(el)),
          wr('pé-r]a-an', w(ht('pé-r'), de, ht('a-an'))),
          wr('ḫu-u-wa-a-i', w(ht('ḫu-u-wa-a-i')))
        ])
      );

    expect(parseTransliterationLine("8' # [ … °MUNUS.MEŠ°zi]-⸢in-tu-ḫi⸣-e-eš an-da {Rasur}"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(8, false, [
          wr('[', w(ds)),
          wr('…', w(el)),
          wr('°MUNUS.MEŠ°zi]-⸢in-tu-ḫi⸣-e-eš', w(dt('MUNUS.MEŠ'), ht('zi'), de, ht('-'), ls, ht('in-tu-ḫi'), le, ht('-e-eš'))),
          wr('an-da', w(ht('an-da'))),
          wr('{Rasur}')
        ])
      );

    expect(parseTransliterationLine("9' # [ú-wa-an-zi … k]i?-an-ta ¬¬¬"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(9, false, [
          wr('[ú-wa-an-zi', w(ds, ht('ú-wa-an-zi'))),
          wr('…', w(el)),
          wr('k]i?-an-ta', w(ht('k'), de, ht('i'), uc, ht('-an-ta'))),
          wr('¬¬¬', w(pe))
        ])
      );

    expect(parseTransliterationLine("10' # [ … ] x-zi ¬¬¬"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(10, false, [
          wr('[', w(ds)),
          wr('…', w(el)),
          wr(']', w(de)),
          wr('x-zi', w(ht('x-zi'))),
          wr('¬¬¬', w(pe))
        ])
      );

    expect(parseTransliterationLine("11' # [ … ]-da"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(11, false, [
          wr('[', w(ds)),
          wr('…', w(el)),
          wr(']-da', w(de, ht('-da')))
        ])
      );

    expect(parseTransliterationLine("12' # [ … °LÚ°ALAM.Z]U₉"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(12, false, [
          wr('[', w(ds)),
          wr('…', w(el)),
          wr('°LÚ°ALAM.Z]U₉', w(dt('LÚ'), sg('ALAM.Z'), de, sg('U'), nc('9', true)))
        ])
      );

    expect(parseTransliterationLine("13' # [ … -z]i ¬¬¬"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(13, false, [
          wr('[', w(ds)),
          wr('…', w(el)),
          wr('-z]i', w(ht('-z'), de, ht('i'))),
          wr('¬¬¬', w(pe))
        ])
      );

    expect(parseTransliterationLine("1' # [x x] x x [ ¬¬¬"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(1, false, [
          wr('[x', w(ds, ht('x'))),
          wr('x]', w(ht('x'), de)),
          wr('x', w(ht('x'))),
          wr('x', w(ht('x'))),
          wr('[', w(ds)),
          wr('¬¬¬', w(pe))
        ])
      );

    expect(parseTransliterationLine("2' # LUGAL-uš GUB-[aš"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(2, false, [
          wr('LUGAL-uš', w(sg('LUGAL'), ht('-uš'))),
          wr('GUB-[aš', w(sg('GUB'), ht('-'), ds, ht('aš')))
        ])
      );

    expect(parseTransliterationLine("3' # °D°UTU °D°U ⸢°D°⸣["))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(3, false, [
          wr('°D°UTU', w(dt('D'), sg('UTU'))),
          wr('°D°U', w(dt('D'), sg('U'))),
          wr('⸢°D°⸣[', w(ls, dt('D'), le, ds))
        ])
      );

    expect(parseTransliterationLine("4' # °D°zi-in-t[u-ḫi ¬¬¬"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(4, false, [
          wr('°D°zi-in-t[u-ḫi', w(dt('D'), ht('zi-in-t'), ds, ht('u-ḫi'))),
          wr('¬¬¬', w(pe))
        ])
      );

    expect(parseTransliterationLine("5' # °LÚ°SAGI.A 1 NINDA.G[UR₄.RA _EM-ṢA]"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(5, false, [
          wr('°LÚ°SAGI.A', w(dt('LÚ'), sg('SAGI.A'))),
          wr('1', w(nc('1'))),
          wr('NINDA.G[UR₄.RA', w(sg('NINDA.G'), ds, sg('UR'), nc('4', true), sg('.RA'))),
          wr('_EM-ṢA]', w(ag('EM-ṢA'), de))
        ])
      );

    expect(parseTransliterationLine("6' # LUGAL-i pa-a-i LUGAL-u[š pár-ši-ia] ¬¬¬"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(6, false, [
          wr('LUGAL-i', w(sg('LUGAL'), ht('-i'))),
          wr('pa-a-i', w(ht('pa-a-i'))),
          wr('LUGAL-u[š', w(sg('LUGAL'), ht('-u'), ds, ht('š'))),
          wr('pár-ši-ia]', w(ht('pár-ši-ia'), de)),
          wr('¬¬¬', w(pe))
        ])
      );

    expect(parseTransliterationLine("7' # ta-aš-ta °MUNUS.MEŠ°zi-[in-tu-ḫi-e-eš"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(7, false, [
          wr('ta-aš-ta', w(ht('ta-aš-ta'))),
          wr('°MUNUS.MEŠ°zi-[in-tu-ḫi-e-eš', w(dt('MUNUS.MEŠ'), ht('zi-'), ds, ht('in-tu-ḫi-e-eš')))
        ])
      );

    expect(parseTransliterationLine("8' # pa-ra-a [ ¬¬¬"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(8, false, [
          wr('pa-ra-a', w(ht('pa-ra-a'))),
          wr('[', w(ds)),
          wr('¬¬¬', w(pe))
        ])
      );

    expect(parseTransliterationLine("9' # pár-aš-na-a-u-<aš>-kán °LÚ°SAG[I.A ¬¬¬"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(9, false, [
          wr('pár-aš-na-a-u-<aš>-kán', w(ht('pár-aš-na-a-u-'), supS, ht('aš'), supE, ht('-kán'))),
          wr('°LÚ°SAG[I.A', w(dt('LÚ'), sg('SAG'), ds, sg('I.A'))),
          wr('¬¬¬', w(pe))
        ])
      );

    expect(parseTransliterationLine("10' # LUGAL-uš TUŠ-aš <°D°>iz-zi-i[š?-ta?-nu?"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(10, false, [
          wr('LUGAL-uš', w(sg('LUGAL'), ht('-uš'))),
          wr('TUŠ-aš', w(sg('TUŠ'), ht('-aš'))),
          wr('<°D°>iz-zi-i[š?-ta?-nu?', w(supS, dt('D'), supE, ht('iz-zi-i'), ds, ht('š'), uc, ht('-ta'), uc, ht('-nu'), uc))
        ])
      );

    expect(parseTransliterationLine("11' # e-ku-zi GIŠ ⸢°D°⸣[INANNA ¬¬¬"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(11, false, [
          wr('e-ku-zi', w(ht('e-ku-zi'))),
          wr('GIŠ', w(sg('GIŠ'))),
          wr('⸢°D°⸣[INANNA', w(ls, dt('D'), le, ds, sg('INANNA'))),
          wr('¬¬¬', w(pe))
        ])
      );

    expect(parseTransliterationLine("12' # °LÚ°SAGI.A [1 NINDA.GUR₄.RA EM-ṢA]"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(12, false, [
          wr('°LÚ°SAGI.A', w(dt('LÚ'), sg('SAGI.A'))),
          wr('[1', w(ds, nc('1'))),
          wr('NINDA.GUR₄.RA', w(sg('NINDA.GUR'), nc('4', true), sg('.RA'))),
          wr('EM-ṢA]', w(sg('EM'), ag('ṢA'), de))
        ])
      );

    expect(parseTransliterationLine("13' # LUGAL-i pa-a-i [LUGAL-uš pár-ši-ia] ¬¬¬"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(13, false, [
          wr('LUGAL-i', w(sg('LUGAL'), ht('-i'))),
          wr('pa-a-i', w(ht('pa-a-i'))),
          wr('[LUGAL-uš', w(ds, sg('LUGAL'), ht('-uš'))),
          wr('pár-ši-ia]', w(ht('pár-ši-ia'), de)),
          wr('¬¬¬', w(pe))
        ])
      );

    expect(parseTransliterationLine("14' # GAL DUMU.MEŠ ⸢É⸣.[GAL"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(14, false, [
          wr('GAL', w(sg('GAL'))),
          wr('DUMU.MEŠ', w(sg('DUMU.MEŠ'))),
          wr('⸢É⸣.[GAL', w(ls, sg('É'), le, sg('.'), ds, sg('GAL')))
        ])
      );

    expect(parseTransliterationLine("15' # °LÚ.MEŠ°GA[LA ¬¬¬"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(15, false, [
          wr('°LÚ.MEŠ°GA[LA', w(dt('LÚ.MEŠ'), sg('GA'), ds, sg('LA'))),
          wr('¬¬¬', w(pe))
        ])
      );

    expect(parseTransliterationLine("16' # ⸢na-aš⸣-k[án"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(16, false, [
          wr('⸢na-aš⸣-k[án', w(ls, ht('na-aš'), le, ht('-k'), ds, ht('án')))
        ])
      );

    expect(parseTransliterationLine("1 # a-na ša ki-ma | i-a-tí | ù! ku-li"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(1, true, [
          wr('a-na', w(ht('a-na'))),
          wr('ša', w(ht('ša'))),
          wr('ki-ma', w(ht('ki-ma'))),
          wr('|'),
          wr('i-a-tí', w(ht('i-a-tí'))),
          wr('|'),
          wr('ù!', w(ht('ù'), sc)),
          wr('ku-li', w(ht('ku-li')))
        ])
      );

    expect(parseTransliterationLine("2 # a-na ku-li | qí-bi₄-ma | um-ma"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(2, true, [
          wr('a-na', w(ht('a-na'))),
          wr('ku-li', w(ht('ku-li'))),
          wr('|'),
          wr('qí-bi₄-ma', w(ht('qí-bi'), nc('4', true), ht('-ma'))),
          wr('|'),
          wr('um-ma', w(ht('um-ma')))
        ])
      );

    expect(parseTransliterationLine("3 # a-šùr-e-na-ma 2 MA.NA 2 ⅔ GÍN"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(3, true, [
          wr('a-šùr-e-na-ma', w(ht('a-šùr-e-na-ma'))),
          wr('2', w(nc('2'))),
          wr('MA.NA', w(sg('MA.NA'))),
          wr('2', w(nc('2'))),
          wr('⅔'),
          wr('GÍN', w(sg('GÍN')))
        ])
      );

    expect(parseTransliterationLine("4 # KÙ.BABBAR | ša li-bi₄-kà | ša a-na MU 1.[ŠÈ]"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(4, true, [
          wr('KÙ.BABBAR', w(sg('KÙ.BABBAR'))),
          wr('|'),
          wr('ša', w(ht('ša'))),
          wr('li-bi₄-kà', w(ht('li-bi'), nc('4', true), ht('-kà'))),
          wr('|'),
          wr('ša', w(ht('ša'))),
          wr('a-na', w(ht('a-na'))),
          wr('MU', w(sg('MU'))),
          wr('1.[ŠÈ]', w(nc('1'), sg('.'), ds, sg('ŠÈ'), de))
        ])
      );

    expect(parseTransliterationLine("5 # ša-qá-lìm | qá-bi₄-a-tí-ni"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(5, true, [
          wr('ša-qá-lìm', w(ht('ša-qá-lìm'))),
          wr('|'),
          wr('qá-bi₄-a-tí-ni', w(ht('qá-bi'), nc('4', true), ht('-a-tí-ni')))
        ])
      );

    expect(parseTransliterationLine("6 # ITI 1°KAM° | ku-zal-li | li-mu-um"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(6, true, [
          wr('ITI', w(sg('ITI'))),
          wr('1°KAM°', w(nc('1'), dt('KAM'))),
          wr('|'),
          wr('ku-zal-li', w(ht('ku-zal-li'))),
          wr('|'),
          wr('li-mu-um', w(ht('li-mu-um')))
        ])
      );

    expect(parseTransliterationLine("7 # am-ri-iš₈-tár DUMU ma-num-ba-lúm-a-šùr"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(7, true, [
          wr('am-ri-iš₈-tár', w(ht('am-ri-iš'), nc('8', true), ht('-tár'))),
          wr('DUMU', w(sg('DUMU'))),
          wr('ma-num-ba-lúm-a-šùr', w(ht('ma-num-ba-lúm-a-šùr')))
        ])
      );

    expect(parseTransliterationLine("8 # i-na ṭup-pì-kà | a-šùr-mu-da-mì-i[q]"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(8, true, [
          wr('i-na', w(ht('i-na'))),
          wr('ṭup-pì-kà', w(ht('ṭup-pì-kà'))),
          wr('|'),
          wr('a-šùr-mu-da-mì-i[q]', w(ht('a-šùr-mu-da-mì-i'), ds, ht('q'), de))
        ])
      );

    expect(parseTransliterationLine("9 # DUMU sá-ak-lá-nim | ⸢ú e⸣-dí-na-a"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(9, true, [
          wr('DUMU', w(sg('DUMU'))),
          wr('sá-ak-lá-nim', w(ht('sá-ak-lá-nim'))),
          wr('|'),
          wr('⸢ú', w(ls, ht('ú'))),
          wr('e⸣-dí-na-a', w(ht('e'), le, ht('-dí-na-a')))
        ])
      );

    expect(parseTransliterationLine("10 # [DU]MU a-a-a | kà-an-ku-ni 1 GÍN KÙ.BABBAR"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(10, true, [
          wr('[DU]MU', w(ds, sg('DU'), de, sg('MU'))),
          wr('a-a-a', w(ht('a-a-a'))),
          wr('|'),
          wr('kà-an-ku-ni', w(ht('kà-an-ku-ni'))),
          wr('1', w(nc('1'))),
          wr('GÍN', w(sg('GÍN'))),
          wr('KÙ.BABBAR', w(sg('KÙ.BABBAR')))
        ])
      );

    expect(parseTransliterationLine("11 # lá tù-qá-ri-ba-am"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(11, true, [
          wr('lá', w(ht('lá'))),
          wr('tù-qá-ri-ba-am', w(ht('tù-qá-ri-ba-am')))
        ])
      );

    expect(parseTransliterationLine("12 # i-na °d°UTU-ši na-áš-pì-ir-⸢tí⸣"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(12, true, [
          wr('i-na', w(ht('i-na'))),
          wr('°d°UTU-ši', w(ml('d'), sg('UTU'), ht('-ši'))),
          wr('na-áš-pì-ir-⸢tí⸣', w(ht('na-áš-pì-ir-'), ls, ht('tí'), le))
        ])
      );

    expect(parseTransliterationLine("13 # ta-ša-me-{Rasur}⸢ú⸣"))
      .toEqual <TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(13, true, [
          wr('ta-ša-me-{Rasur}⸢ú⸣')
        ])
      );

  });
});