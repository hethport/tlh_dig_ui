import {parseTransliterationLine} from './parser';
import {
  TransliterationTextLineParseResult,
  transliterationWord as w
} from '../model/transliterationTextLineParseResult';
import {
  akkadogrammContentUnion as ag,
  de,
  determinativContentUnion as dt,
  dpe,
  ds,
  el,
  hittiteContentUnion as ht,
  illegibleContent,
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
  us
} from './testHelpers';
import {MarkType} from '../generated/graphql';

describe('The transliteration parser', () => {

  it('should do what simtex does', () => {
    expect(parseTransliterationLine("1# ta LUGAL-uš A-NA DUTU AN-E x GUx.MAḪ pa-a-i {K:34}"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(1, true, [
          // <w>ta</w>
          w('ta', ht('ta')),
          // <w><sGr>LUGAL</sGr>-uš</w>
          w('LUGAL-uš', sg('LUGAL'), ht('-uš')),
          // <w><sGr>A</sGr><aGr>-NA</aGr></w>
          w('A-NA', sg('A'), ag('-NA')),
          // <w><sGr>DUTU</sGr></w>
          w('DUTU', sg('DUTU')),
          // <w><sGr>AN</sGr><aGr>-E</aGr></w>
          w('AN-E', sg('AN'), ag('-E')),
          // x
          w('x', illegibleContent),
          // <w><sGr>GUₓ.MAḪ</sGr></w>
          w('GUx.MAḪ', sg('GUₓ.MAḪ')),
          // <w>pa-a-i</w>
          w('pa-a-i', ht('pa-a-i')),
          // <w><SP___AO_3a_-KolonMark>K:34</SP___AO_3a_-KolonMark></w>
          w('{K:34}', mc(MarkType.Colon, '34'))
        ])
      );

    expect(parseTransliterationLine("1'# [ ... ] ⸢ú?-e?-te-na-an-za⸣"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(1, false, [
          // <w><del_in/></w>
          w('[', ds),
          // <w><sGr>...</sGr></w>
          w('...', sg('...')),
          // <w><del_fin/></w>
          w(']', de),
          // <w><laes_in/>ú<corr c='?'/>-e<corr c='?'/>-te-na-an-za<laes_fin/></w>
          w('⸢ú?-e?-te-na-an-za⸣', ls, ht('ú'), uc, ht('-e'), uc, ht('-te-na-an-za'), le)
        ])
      );

    expect(parseTransliterationLine("2'# [ ... ] ⸢nu⸣ LÚKÚR ku-e-da-ni pé-di"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(
          2, false, [
            // <w><del_in/></w>
            w('[', ds),
            // <w><sGr>...</sGr></w>
            w('...', sg('...')),
            // <w><del_fin/></w>
            w(']', de),
            // <w><laes_in/>nu<laes_fin/></w>
            w('⸢nu⸣', ls, ht('nu'), le),
            // <w><sGr>LÚKÚR</sGr></w>
            w('LÚKÚR', sg('LÚKÚR')),
            // <w>ku-e-da-ni</w>
            w('ku-e-da-ni', ht('ku-e-da-ni')),
            // <w>pé-di</w>
            w('pé-di', ht('pé-di'))
          ])
      );

    expect(parseTransliterationLine("3'# [ ... wa-ar-pa da-a]-iš* *na-aš-kán a-pé-e-ez"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(3, false, [
          // <w><del_in/></w>
          w('[', ds),
          // <w><sGr>...</sGr></w>
          w('...', sg('...')),
          // <w>wa-ar-pa</w>
          w('wa-ar-pa', ht('wa-ar-pa')),
          // <w>da-a<del_fin/>-iš<ras_in/></w>
          w('da-a]-iš*', ht('da-a'), de, ht('-iš'), r),
          //  <w><ras_fin/>na-aš-kán</w>
          w('*na-aš-kán', r, ht('na-aš-kán')),
          // <w>a-pé-e-ez</w>
          w('a-pé-e-ez', ht('a-pé-e-ez'))
        ])
      );

    expect(parseTransliterationLine("4'# [ ... mdu-ut-ḫa-l]i-ia-aš GAL ME-ŠE-DI"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(4, false, [
          // <w><del_in/></w>
          w('[', ds),
          // <w><sGr>...</sGr></w>
          w('...', sg('...')),
          // <w>mdu-ut-ḫa-l<del_fin/>i-ia-aš</w>
          w('mdu-ut-ḫa-l]i-ia-aš', ht('mdu-ut-ḫa-l'), de, ht('i-ia-aš')),
          // <w><sGr>GAL</sGr></w>
          w('GAL', sg('GAL')),
          // <w><sGr>ME</sGr><aGr>-ŠE-DI</aGr></w>
          w('ME-ŠE-DI', sg('ME'), ag('-ŠE-DI'))
        ])
      );

    expect(parseTransliterationLine("5'# [ ... -uš-m]a-⸢aš-ši⸣ ku-i-e-eš"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(5, false, [
          // <w><del_in/></w>
          w('[', ds),
          // <w><sGr>...</sGr></w>
          w('...', sg('...')),
          // <w>-uš-m<del_fin/>a-<laes_in/>aš-ši<laes_fin/></w>
          w('-uš-m]a-⸢aš-ši⸣', ht('-uš-m'), de, ht('a-'), ls, ht('aš-ši'), le),
          // <w>ku-i-e-eš</w>
          w('ku-i-e-eš', ht('ku-i-e-eš'))
        ])
      );

    expect(parseTransliterationLine("6'# [ ... pa-ra-a] da-a-aš ¬¬¬"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(6, false, [
          // <w><del_in/></w>
          w('[', ds),
          // <w><sGr>...</sGr></w>
          w('...', sg('...')),
          // <w>pa-ra-a<del_fin/></w>
          w('pa-ra-a]', ht('pa-ra-a'), de),
          // <w>da-a-aš</w>
          w('da-a-aš', ht('da-a-aš')),
          // </s></p><parsep/><p><s>
          w('¬¬¬', pe)
        ])
      );

    expect(parseTransliterationLine("7'# [ ... ] x  °m°mur-ši--DINGIR-LIM °MUNUS°ŠU.GI LÚ°MEŠ° DINGIR°MEŠ°-aš"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(7, false, [
          // <w><del_in/></w>
          w('[', ds),
          // <w><sGr>...</sGr></w>
          w('...', sg('...')),
          // <w><del_fin/></w>
          w(']', de),
          // x
          w('x', illegibleContent),
          // <w><d>m</d>mur-ši-<sGr>DINGIR</sGr><aGr>-LIM</aGr></w>
          w('°m°mur-ši--DINGIR-LIM', dt('m'), ht('mur-ši'), sg('DINGIR'), ag('-LIM')),
          // <w><d>MUNUS</d><sGr>ŠU.GI</sGr></w>
          w('°MUNUS°ŠU.GI', dt('MUNUS'), sg('ŠU.GI')),
          // <w><sGr>LÚ</sGr><d>MEŠ</d></w>
          w('LÚ°MEŠ°', sg('LÚ'), dt('MEŠ')),
          // <w><sGr>DINGIR</sGr><d>MEŠ</d>-aš</w>
          w('DINGIR°MEŠ°-aš', sg('DINGIR'), dt('MEŠ'), ht('-aš'))
        ])
      );

    expect(parseTransliterationLine("8'# [ ] °m°°.°°D°30--SUM  ù °m.D°30--SUM{F: Problem mit den Punkten in Determinativen.}"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(8, false, [
          // <w><del_in/></w>
          w('[', ds),
          // <w><del_fin/></w>
          w(']', de),
          // <w><d>m.D</d><sGr>30</sGr>-<sGr>SUM</sGr></w>
          w('°m°°.°°D°30--SUM', dt('m.D'), sg('30'), ht('-'), sg('SUM')),
          // <w>ù</w>
          w('ù', ht('ù')),
          // <w><SP___AO_3a_MaterLect>m.D</SP___AO_3a_MaterLect><num>30</num>-<sGr>SUM</sGr><note  n='1'  c="   &lt;P_f_Footnote&gt;Problem mit den Punkten in Determinativen.&lt;/P_f_Footnote&gt;"  /></w>
          w('°m.D°30--SUM{F: Problem mit den Punkten in Determinativen.}', ml('m.D'), nc('30'), ht('-'), sg('SUM'), mc(MarkType.FootNote, 'Problem mit den Punkten in Determinativen.'))
        ])
      );

    expect(parseTransliterationLine("9' # °URU°?ša-mu-ḫa °URU°!ša-*mu-ḫa*   °URU?°ša?-mu-ḫa °URU!°ša-mu!-ḫa"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(9, false, [
          // <w><d>URU</d><corr c='?'/>ša-mu-ḫa</w>
          w('°URU°?ša-mu-ḫa', dt('URU'), uc, ht('ša-mu-ḫa')),
          // <w><d>URU</d><corr c='!'/>ša-<ras_in/>mu-ḫa<ras_fin/></w>
          w('°URU°!ša-*mu-ḫa*', dt('URU'), sc, ht('ša-'), r, ht('mu-ḫa'), r),
          // <w><SP___AO_3a_MaterLect>URU?</SP___AO_3a_MaterLect>ša<corr c='?'/>-mu-ḫa</w>
          w('°URU?°ša?-mu-ḫa'/*, TODO: ml('URU?'), ht('ša'), uc, ht('-mu-ḫa')*/),
          // <w><SP___AO_3a_MaterLect>URU!</SP___AO_3a_MaterLect>ša-mu<corr c='!'/>-ḫa</w>
          w('°URU!°ša-mu!-ḫa' /* TODO:, ml('URU!'), ht('ša-mu'), sc, ht('-ḫa'))*/)
        ])
      );

    expect(parseTransliterationLine("10# BLABLA-ṢU _ŠI-PÁT"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(10, true, [
          // <w><sGr>BLABLA</sGr><aGr>-ṢU</aGr></w>
          w('BLABLA-ṢU', sg('BLABLA'), ag('-ṢU')),
          // <w><aGr>ŠI-PÁT</aGr></w>
          w('_ŠI-PÁT', ag('ŠI-PÁT'))
        ])
      );

    expect(parseTransliterationLine("11 # šaṭ-rat°at° °MUNUS.MEŠ°kat°at°-re-eš {G: fünf Zeichen abgebr.} kar-°di°dim-mi-ia-az §§"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(11, true, [
          // <w>šaṭ-rat<SP___AO_3a_MaterLect>at</SP___AO_3a_MaterLect></w>
          w('šaṭ-rat°at°', ht('šaṭ-rat'), ml('at')),
          //  <w><d>MUNUS.MEŠ</d>kat<SP___AO_3a_MaterLect>at</SP___AO_3a_MaterLect>-re-eš</w>
          w('°MUNUS.MEŠ°kat°at°-re-eš', dt('MUNUS.MEŠ'), ht('kat'), ml('at'), ht('-re-eš')),
          //  <gap c="fünf Zeichen abgebr."/>
          w('{G: fünf Zeichen abgebr.}', mc(MarkType.TextGap, 'fünf Zeichen abgebr.')),
          // <w>kar-<SP___AO_3a_MaterLect>di</SP___AO_3a_MaterLect>dim-mi-ia-az</w>
          w('kar-°di°dim-mi-ia-az', ht('kar-'), ml('di'), ht('dim-mi-ia-az')),
          // </s></p><parsep_dbl/><p><s>
          w('§§', dpe)
        ])
      );

    expect(parseTransliterationLine("12 # GU4 ka4 ubx ub[x K]AxU §"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(12, true, [
          // <w><sGr>GU₄</sGr></w>
          w('GU4', sg('GU₄')),
          // <w>ka₄</w>
          w('ka4', ht('ka₄')),
          // <w>ubₓ</w>
          w('ubx', ht('ubₓ')),
          // <w>ub<del_in/>ₓ</w>
          w('ub[x', ht('ub'), ds, ht('ₓ')),
          // <w><sGr>K<del_fin/>A×U</sGr></w>
          w('K]AxU', sg('K', ds, 'A×U')),
          // </s></p><parsep/><p><s>
          w('§')
        ])
      );

    expect(parseTransliterationLine("13 # 4 GU4"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(13, true, [
          // <w><num>4</num></w>
          w('4', nc('4')),
          // <w><sGr>GU₄</sGr></w>
          w('GU4', sg('GU₄'))
        ])
      );

    expect(parseTransliterationLine("14 # 4 GU4"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(14, true, [
          // <w><num>4</num></w>
          w('4', nc('4')),
          // <w><sGr>GU₄</sGr></w>
          w('GU4', sg('GU₄'))
        ])
      );

    expect(parseTransliterationLine("15 # DUB 2°KAM°"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(15, true, [
          // <w><sGr>DUB</sGr></w>
          w('DUB', sg('DUB')),
          // <w><num>2</num><d>KAM</d></w>
          w('2°KAM°', nc('2'), dt('KAM'))
        ])
      );
  });

  it('should parse complete document', () => {
    expect(parseTransliterationLine("1' # [(x)] x ⸢zi⸣ x [",))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(1, false, [
          w('[(x)]', ds, us, ht('x'), ue, de),
          w('x', illegibleContent),
          w('⸢zi⸣', ls, ht('zi'), le),
          w('x', illegibleContent),
          w('[', ds)
        ])
      );

    expect(parseTransliterationLine("2' # [DUMU?].MUNUS?-ma e-ša-⸢a⸣-[ri"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(2, false, [
          w('[DUMU?].MUNUS?-ma', ds, sg('DUMU'), uc, de, sg('.MUNUS'), uc, ht('-ma')),
          w('e-ša-⸢a⸣-[ri', ht('e-ša-'), ls, ht('a'), le, ht('-'), ds, ht('ri'))
        ])
      );

    expect(parseTransliterationLine("3' # az-zi-ik-ki-it-[tén"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(3, false, [
          w('az-zi-ik-ki-it-[tén', ht('az-zi-ik-ki-it-'), ds, ht('tén'))
        ])
      );

    expect(parseTransliterationLine("4' # nu ḫu-u-ma-an az-[zi-ik-ki- ¬¬¬"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(4, false, [
          w('nu', ht('nu')),
          w('ḫu-u-ma-an', ht('ḫu-u-ma-an')),
          w('az-[zi-ik-ki-', ht('az-'), ds, ht('zi-ik-ki-')),
          w('¬¬¬', pe)
        ])
      );

    expect(parseTransliterationLine("5' # [k]u-it-ma-an-aš-ma x ["))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(5, false, [
          w('[k]u-it-ma-an-aš-ma', ds, ht('k'), de, ht('u-it-ma-an-aš-ma')),
          w('x', illegibleContent),
          w('[', ds)
        ])
      );

    expect(parseTransliterationLine("6' # [n]a-aš-kán GIŠ.NÁ ["))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(6, false, [
          w('[n]a-aš-kán', ds, ht('n'), de, ht('a-aš-kán')),
          w('GIŠ.NÁ', sg('GIŠ.NÁ')),
          w('[', ds)
        ])
      );

    expect(parseTransliterationLine("7' # [nu-u]š-ši ša-aš-t[a-"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(7, false, [
          w('[nu-u]š-ši', ds, ht('nu-u'), de, ht('š-ši')),
          w('ša-aš-t[a-', ht('ša-aš-t'), ds, ht('a-'))
        ])
      );

    expect(parseTransliterationLine("8' # [da?]-⸢a?⸣ nu-uš-ši x ["))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(8, false, [
          w('[da?]-⸢a?⸣', ds, ht('da'), uc, de, ht('-'), ls, ht('a'), uc, le),
          w('nu-uš-ši', ht('nu-uš-ši')),
          w('x', illegibleContent),
          w('[', ds)
        ])
      );

    expect(parseTransliterationLine("9' # [nu-u]š-ši im-ma(-)["))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(9, false, [
          w('[nu-u]š-ši', ds, ht('nu-u'), de, ht('š-ši')),
          w('im-ma(-)[', ht('im-ma'), us, ht('-'), ue, ds)
        ])
      );

    expect(parseTransliterationLine("10' # [x-x]-TE°MEŠ° ⸢e⸣-["))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(10, false, [
          w('[x-x]-TE°MEŠ°', ds, ht('x-x'), de, ag('-TE'), dt('MEŠ')),
          w('⸢e⸣-[', ls, ht('e'), le, ht('-'), ds)
        ])
      );

    expect(parseTransliterationLine("11' # [x (x)]-ri-⸢ia⸣-[ ¬¬¬"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(11, false, [
          w('[x', ds, ht('x')),
          w('(x)]-ri-⸢ia⸣-[', us, ht('x'), ue, de, ht('-ri-'), ls, ht('ia'), le, ht('-'), ds),
          w('¬¬¬', pe)
        ])
      );

    expect(parseTransliterationLine("12' # [x x] x ["))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(12, false, [
          w('[x', ds, ht('x')),
          w('x]', ht('x'), de),
          w('x', illegibleContent),
          w('[', ds)
        ])
      );

    expect(parseTransliterationLine("1' # [ … ] x ¬¬¬"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(1, false, [
          w('[', ds),
          w('…', el),
          w(']', de),
          w('x', illegibleContent),
          w('¬¬¬', pe)
        ])
      );

    expect(parseTransliterationLine("2' # [ … °MUNUS.MEŠ°zi-i]n-tu-ḫi-e-eš"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(2, false, [
          w('[', ds),
          w('…', el),
          w('°MUNUS.MEŠ°zi-i]n-tu-ḫi-e-eš', dt('MUNUS.MEŠ'), ht('zi-i'), de, ht('n-tu-ḫi-e-eš'))
        ])
      );

    expect(parseTransliterationLine("3' # [ … -i]a-u-an-zi tar-kum-mi-ia-iz-zi ¬¬¬"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(3, false, [
          w('[', ds),
          w('…', el),
          w('-i]a-u-an-zi', ht('-i'), de, ht('a-u-an-zi')),
          w('tar-kum-mi-ia-iz-zi', ht('tar-kum-mi-ia-iz-zi')),
          w('¬¬¬', pe)
        ])
      );

    expect(parseTransliterationLine("4' # [ … °G]IŠ°BANŠUR °GIŠ°BANŠUR an-da"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(4, false, [
          w('[', ds),
          w('…', el),
          w('°G]IŠ°BANŠUR'),
          w('°GIŠ°BANŠUR', dt('GIŠ'), sg('BANŠUR')),
          w('an-da', ht('an-da'))
        ])
      );

    expect(parseTransliterationLine("5' # [ … ] ⸢6⸣ NINDA.GUR₄.RA°ḪI.A° ki-an-da"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(5, false, [
          w('[', ds),
          w('…', el),
          w(']', de),
          w('⸢6⸣', ls, nc('6'), le),
          w('NINDA.GUR₄.RA°ḪI.A°', sg('NINDA.GUR'), nc('4', true), sg('.RA'), dt('ḪI.A')),
          w('ki-an-da', ht('ki-an-da'))
        ])
      );

    expect(parseTransliterationLine("6' # [ … -t]i-ia še-er pé-ra-an da-a-i ¬¬¬"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(6, false, [
          w('[', ds),
          w('…', el),
          w('-t]i-ia', ht('-t'), de, ht('i-ia')),
          w('še-er', ht('še-er')),
          w('pé-ra-an', ht('pé-ra-an')),
          w('da-a-i', ht('da-a-i')),
          w('¬¬¬', pe)
        ])
      );

    expect(parseTransliterationLine("7' # [ … pé-r]a-an ḫu-u-wa-a-i"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(7, false, [
          w('[', ds),
          w('…', el),
          w('pé-r]a-an', ht('pé-r'), de, ht('a-an')),
          w('ḫu-u-wa-a-i', ht('ḫu-u-wa-a-i'))
        ])
      );

    expect(parseTransliterationLine("8' # [ … °MUNUS.MEŠ°zi]-⸢in-tu-ḫi⸣-e-eš an-da {Rasur}"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(8, false, [
          w('[', ds),
          w('…', el),
          w('°MUNUS.MEŠ°zi]-⸢in-tu-ḫi⸣-e-eš', dt('MUNUS.MEŠ'), ht('zi'), de, ht('-'), ls, ht('in-tu-ḫi'), le, ht('-e-eš')),
          w('an-da', ht('an-da')),
          w('{Rasur}')
        ])
      );

    expect(parseTransliterationLine("9' # [ú-wa-an-zi … k]i?-an-ta ¬¬¬"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(9, false, [
          w('[ú-wa-an-zi', ds, ht('ú-wa-an-zi')),
          w('…', el),
          w('k]i?-an-ta', ht('k'), de, ht('i'), uc, ht('-an-ta')),
          w('¬¬¬', pe)
        ])
      );

    expect(parseTransliterationLine("10' # [ … ] x-zi ¬¬¬"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(10, false, [
          w('[', ds),
          w('…', el),
          w(']', de),
          w('x-zi', ht('x-zi')),
          w('¬¬¬', pe)
        ])
      );

    expect(parseTransliterationLine("11' # [ … ]-da"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(11, false, [
          w('[', ds),
          w('…', el),
          w(']-da', de, ht('-da'))
        ])
      );

    expect(parseTransliterationLine("12' # [ … °LÚ°ALAM.Z]U₉"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(12, false, [
          w('[', ds),
          w('…', el),
          w('°LÚ°ALAM.Z]U₉', dt('LÚ'), sg('ALAM.Z'), de, sg('U'), nc('9', true))
        ])
      );

    expect(parseTransliterationLine("13' # [ … -z]i ¬¬¬"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(13, false, [
          w('[', ds),
          w('…', el),
          w('-z]i', ht('-z'), de, ht('i')),
          w('¬¬¬', pe)
        ])
      );

    expect(parseTransliterationLine("1' # [x x] x x [ ¬¬¬"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(1, false, [
          w('[x', ds, ht('x')),
          w('x]', ht('x'), de),
          w('x', illegibleContent),
          w('x', illegibleContent),
          w('[', ds),
          w('¬¬¬', pe)
        ])
      );

    expect(parseTransliterationLine("2' # LUGAL-uš GUB-[aš"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(2, false, [
          w('LUGAL-uš', sg('LUGAL'), ht('-uš')),
          w('GUB-[aš', sg('GUB'), ht('-'), ds, ht('aš'))
        ])
      );

    expect(parseTransliterationLine("3' # °D°UTU °D°U ⸢°D°⸣["))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(3, false, [
          w('°D°UTU', dt('D'), sg('UTU')),
          w('°D°U', dt('D'), sg('U')),
          w('⸢°D°⸣[', ls, dt('D'), le, ds)
        ])
      );

    expect(parseTransliterationLine("4' # °D°zi-in-t[u-ḫi ¬¬¬"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(4, false, [
          w('°D°zi-in-t[u-ḫi', dt('D'), ht('zi-in-t'), ds, ht('u-ḫi')),
          w('¬¬¬', pe)
        ])
      );

    expect(parseTransliterationLine("5' # °LÚ°SAGI.A 1 NINDA.G[UR₄.RA _EM-ṢA]"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(5, false, [
          w('°LÚ°SAGI.A', dt('LÚ'), sg('SAGI.A')),
          w('1', nc('1')),
          w('NINDA.G[UR₄.RA', sg('NINDA.G'), ds, sg('UR'), nc('4', true), sg('.RA')),
          w('_EM-ṢA]', ag('EM-ṢA'), de)
        ])
      );

    expect(parseTransliterationLine("6' # LUGAL-i pa-a-i LUGAL-u[š pár-ši-ia] ¬¬¬"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(6, false, [
          w('LUGAL-i', sg('LUGAL'), ht('-i')),
          w('pa-a-i', ht('pa-a-i')),
          w('LUGAL-u[š', sg('LUGAL'), ht('-u'), ds, ht('š')),
          w('pár-ši-ia]', ht('pár-ši-ia'), de),
          w('¬¬¬', pe)
        ])
      );

    expect(parseTransliterationLine("7' # ta-aš-ta °MUNUS.MEŠ°zi-[in-tu-ḫi-e-eš"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(7, false, [
          w('ta-aš-ta', ht('ta-aš-ta')),
          w('°MUNUS.MEŠ°zi-[in-tu-ḫi-e-eš', dt('MUNUS.MEŠ'), ht('zi-'), ds, ht('in-tu-ḫi-e-eš'))
        ])
      );

    expect(parseTransliterationLine("8' # pa-ra-a [ ¬¬¬"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(8, false, [
          w('pa-ra-a', ht('pa-ra-a')),
          w('[', ds),
          w('¬¬¬', pe)
        ])
      );

    expect(parseTransliterationLine("9' # pár-aš-na-a-u-<aš>-kán °LÚ°SAG[I.A ¬¬¬"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(9, false, [
          w('pár-aš-na-a-u-<aš>-kán', ht('pár-aš-na-a-u-'), supS, ht('aš'), supE, ht('-kán')),
          w('°LÚ°SAG[I.A', dt('LÚ'), sg('SAG'), ds, sg('I.A')),
          w('¬¬¬', pe)
        ])
      );

    expect(parseTransliterationLine("10' # LUGAL-uš TUŠ-aš <°D°>iz-zi-i[š?-ta?-nu?"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(10, false, [
          w('LUGAL-uš', sg('LUGAL'), ht('-uš')),
          w('TUŠ-aš', sg('TUŠ'), ht('-aš')),
          w('<°D°>iz-zi-i[š?-ta?-nu?', supS, dt('D'), supE, ht('iz-zi-i'), ds, ht('š'), uc, ht('-ta'), uc, ht('-nu'), uc)
        ])
      );

    expect(parseTransliterationLine("11' # e-ku-zi GIŠ ⸢°D°⸣[INANNA ¬¬¬"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(11, false, [
          w('e-ku-zi', ht('e-ku-zi')),
          w('GIŠ', sg('GIŠ')),
          w('⸢°D°⸣[INANNA', ls, dt('D'), le, ds, sg('INANNA')),
          w('¬¬¬', pe)
        ])
      );

    expect(parseTransliterationLine("12' # °LÚ°SAGI.A [1 NINDA.GUR₄.RA EM-ṢA]"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(12, false, [
          w('°LÚ°SAGI.A', dt('LÚ'), sg('SAGI.A')),
          w('[1', ds, nc('1')),
          w('NINDA.GUR₄.RA', sg('NINDA.GUR'), nc('4', true), sg('.RA')),
          w('EM-ṢA]', sg('EM'), ag('-ṢA'), de)
        ])
      );

    expect(parseTransliterationLine("13' # LUGAL-i pa-a-i [LUGAL-uš pár-ši-ia] ¬¬¬"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(13, false, [
          w('LUGAL-i', sg('LUGAL'), ht('-i')),
          w('pa-a-i', ht('pa-a-i')),
          w('[LUGAL-uš', ds, sg('LUGAL'), ht('-uš')),
          w('pár-ši-ia]', ht('pár-ši-ia'), de),
          w('¬¬¬', pe)
        ])
      );

    expect(parseTransliterationLine("14' # GAL DUMU.MEŠ ⸢É⸣.[GAL"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(14, false, [
          w('GAL', sg('GAL')),
          w('DUMU.MEŠ', sg('DUMU.MEŠ')),
          w('⸢É⸣.[GAL', ls, sg('É'), le, sg('.'), ds, sg('GAL'))
        ])
      );

    expect(parseTransliterationLine("15' # °LÚ.MEŠ°GA[LA ¬¬¬"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(15, false, [
          w('°LÚ.MEŠ°GA[LA', dt('LÚ.MEŠ'), sg('GA'), ds, sg('LA')),
          w('¬¬¬', pe)
        ])
      );

    expect(parseTransliterationLine("16' # ⸢na-aš⸣-k[án"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(16, false, [
          w('⸢na-aš⸣-k[án', ls, ht('na-aš'), le, ht('-k'), ds, ht('án'))
        ])
      );

    expect(parseTransliterationLine("1 # a-na ša ki-ma | i-a-tí | ù! ku-li"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(1, true, [
          w('a-na', ht('a-na')),
          w('ša', ht('ša')),
          w('ki-ma', ht('ki-ma')),
          w('|'),
          w('i-a-tí', ht('i-a-tí')),
          w('|'),
          w('ù!', ht('ù'), sc),
          w('ku-li', ht('ku-li'))
        ])
      );

    expect(parseTransliterationLine("2 # a-na ku-li | qí-bi₄-ma | um-ma"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(2, true, [
          w('a-na', ht('a-na')),
          w('ku-li', ht('ku-li')),
          w('|'),
          w('qí-bi₄-ma', ht('qí-bi'), nc('4', true), ht('-ma')),
          w('|'),
          w('um-ma', ht('um-ma'))
        ])
      );

    expect(parseTransliterationLine("3 # a-šùr-e-na-ma 2 MA.NA 2 ⅔ GÍN"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(3, true, [
          w('a-šùr-e-na-ma', ht('a-šùr-e-na-ma')),
          w('2', nc('2')),
          w('MA.NA', sg('MA.NA')),
          w('2', nc('2')),
          w('⅔'),
          w('GÍN', sg('GÍN'))
        ])
      );

    expect(parseTransliterationLine("4 # KÙ.BABBAR | ša li-bi₄-kà | ša a-na MU 1.[ŠÈ]"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(4, true, [
          w('KÙ.BABBAR', sg('KÙ.BABBAR')),
          w('|'),
          w('ša', ht('ša')),
          w('li-bi₄-kà', ht('li-bi'), nc('4', true), ht('-kà')),
          w('|'),
          w('ša', ht('ša')),
          w('a-na', ht('a-na')),
          w('MU', sg('MU')),
          w('1.[ŠÈ]', nc('1'), sg('.'), ds, sg('ŠÈ'), de)
        ])
      );

    expect(parseTransliterationLine("5 # ša-qá-lìm | qá-bi₄-a-tí-ni"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(5, true, [
          w('ša-qá-lìm', ht('ša-qá-lìm')),
          w('|'),
          w('qá-bi₄-a-tí-ni', ht('qá-bi'), nc('4', true), ht('-a-tí-ni'))
        ])
      );

    expect(parseTransliterationLine("6 # ITI 1°KAM° | ku-zal-li | li-mu-um"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(6, true, [
          w('ITI', sg('ITI')),
          w('1°KAM°', nc('1'), dt('KAM')),
          w('|'),
          w('ku-zal-li', ht('ku-zal-li')),
          w('|'),
          w('li-mu-um', ht('li-mu-um'))
        ])
      );

    expect(parseTransliterationLine("7 # am-ri-iš₈-tár DUMU ma-num-ba-lúm-a-šùr"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(7, true, [
          w('am-ri-iš₈-tár', ht('am-ri-iš'), nc('8', true), ht('-tár')),
          w('DUMU', sg('DUMU')),
          w('ma-num-ba-lúm-a-šùr', ht('ma-num-ba-lúm-a-šùr'))
        ])
      );

    expect(parseTransliterationLine("8 # i-na ṭup-pì-kà | a-šùr-mu-da-mì-i[q]"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(8, true, [
          w('i-na', ht('i-na')),
          w('ṭup-pì-kà', ht('ṭup-pì-kà')),
          w('|'),
          w('a-šùr-mu-da-mì-i[q]', ht('a-šùr-mu-da-mì-i'), ds, ht('q'), de)
        ])
      );

    expect(parseTransliterationLine("9 # DUMU sá-ak-lá-nim | ⸢ú e⸣-dí-na-a"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(9, true, [
          w('DUMU', sg('DUMU')),
          w('sá-ak-lá-nim', ht('sá-ak-lá-nim')),
          w('|'),
          w('⸢ú', ls, ht('ú')),
          w('e⸣-dí-na-a', ht('e'), le, ht('-dí-na-a'))
        ])
      );

    expect(parseTransliterationLine("10 # [DU]MU a-a-a | kà-an-ku-ni 1 GÍN KÙ.BABBAR"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(10, true, [
          w('[DU]MU', ds, sg('DU'), de, sg('MU')),
          w('a-a-a', ht('a-a-a')),
          w('|'),
          w('kà-an-ku-ni', ht('kà-an-ku-ni')),
          w('1', nc('1')),
          w('GÍN', sg('GÍN')),
          w('KÙ.BABBAR', sg('KÙ.BABBAR'))
        ])
      );

    expect(parseTransliterationLine("11 # lá tù-qá-ri-ba-am"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(11, true, [
          w('lá', ht('lá')),
          w('tù-qá-ri-ba-am', ht('tù-qá-ri-ba-am'))
        ])
      );

    expect(parseTransliterationLine("12 # i-na °d°UTU-ši na-áš-pì-ir-⸢tí⸣"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(12, true, [
          w('i-na', ht('i-na')),
          w('°d°UTU-ši', ml('d'), sg('UTU'), ht('-ši')),
          w('na-áš-pì-ir-⸢tí⸣', ht('na-áš-pì-ir-'), ls, ht('tí'), le)
        ])
      );

    expect(parseTransliterationLine("13 # ta-ša-me-{Rasur}⸢ú⸣"))
      .toEqual<TransliterationTextLineParseResult>(
        new TransliterationTextLineParseResult(13, true, [
          w('ta-ša-me-{Rasur}⸢ú⸣')
        ])
      );

  });
});