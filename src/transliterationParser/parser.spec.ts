import {TransliterationLine} from "./model";
import {transliteration} from './parser';
import {Akkadogramm} from "../model/akkadogramm";
import {Sumerogramm} from "../model/sumerogramm";
import {Determinativ} from "../model/determinativ";
import {
    DeletionEnd as de,
    DeletionStart as ds,
    LesionEnd as le,
    LesionStart as ls,
    RasureEnd as re,
    RasureStart as rs,
    UnknownBracketStart as us,
    UnknownBracketEnd as ue
} from "../model/damages";
import {UnsureCorrection as uc} from "../model/corrections";

/*
const x = `
$ Bo 2019/1 # KBo 71.91 • Datierung jh. • CTH 470 • Duplikate – • Fundort Büyükkale, westliche Befestigungsmauer, Schutt der Altgrabungen Planquadrat 338/348; 8,99-2,85; –-–; Niveau 1104,71 • Fund-Nr. 19-5000-5004 • Maße 62 x 45 x 22 mm
1' # [(x)] x ⸢zi⸣ x [
2' # [DUMU?].MUNUS?-ma e-ša-⸢a⸣-[ri
3' # az-zi-ik-ki-it-[tén
4' # nu ḫu-u-ma-an az-[zi-ik-ki- ¬¬¬
5' # [k]u-it-ma-an-aš-ma x [
6' # [n]a-aš-kán GIŠ.NÁ [
7' # [nu-u]š-ši ša-aš-t[a-
8' # [da?]-⸢a?⸣ nu-uš-ši x [
9' # [nu-u]š-ši im-ma(-)[
10' # [x-x]-TE°MEŠ° ⸢e⸣-[
11' # [x (x)]-ri-⸢ia⸣-[ ¬¬¬
12' # [x x] x [
`
 */

describe('test', () => {
    it('should parse hittite', () => {
        expect(transliteration.hittite.tryParse('het'))
            .toEqual('het');
        expect(transliteration.hittite.tryParse('tén'))
            .toEqual('tén');
    });

    it('should parse akadogramms', () => {
        expect(transliteration.akkadogramm.tryParse('_ABC'))
            .toEqual(new Akkadogramm('ABC'));

        expect(transliteration.akkadogramm.tryParse('-ABC'))
            .toEqual(new Akkadogramm('ABC'));
    });

    it('should parse sumerogramms', () => {
        expect(transliteration.sumerogramm.tryParse('ABC'))
            .toEqual(new Sumerogramm('ABC'));
    });

    it('should parse determinatives', () => {
        expect(transliteration.determinativ.tryParse('°ABC°'))
            .toEqual(new Determinativ('ABC'));
    });

    it('should parse lines', () => {
        const parser = transliteration.transliterationLine;

        expect(parser.tryParse("1' # [(x)] x ⸢zi⸣ x ["))
            .toEqual<TransliterationLine>({
                lineNumber: {number: 1, isAbsolute: false},
                content: [ds, us, 'x', ue, de, 'x', ls, 'zi', le, 'x', ds]
            });

        expect(parser.tryParse("2' # [DUMU?].MUNUS?-ma e-ša-⸢a⸣-[ri"))
            .toEqual<TransliterationLine>({
                lineNumber: {number: 2, isAbsolute: false},
                content: [ds, new Sumerogramm('DUMU'), uc, de, new Sumerogramm('.MUNUS'), uc, '-ma', 'e-ša-', ls, 'a', le, '-', ds, 'ri']
            });

        expect(parser.tryParse("3' # az-zi-ik-ki-it-[tén"))
            .toEqual<TransliterationLine>({
                lineNumber: {number: 3, isAbsolute: false},
                content: ['az-zi-ik-ki-it-', ds, 'tén']
            });

        expect(parser.tryParse("4' # nu ḫu-u-ma-an az-[zi-ik-ki- ¬¬¬"))
            .toEqual<TransliterationLine>({
                lineNumber: {number: 4, isAbsolute: false},
                content: ['nu', 'ḫu-u-ma-an', 'az-', ds, 'zi-ik-ki-', '¬¬¬']
            });

        expect(parser.tryParse("9' # [nu-u]š-ši im-ma(-)["))
            .toEqual<TransliterationLine>({
                lineNumber: {number: 9, isAbsolute: false},
                content: [ds, 'nu-u', de, 'š-ši', 'im-ma', us, '-', ue, ds]
            })

        expect(parser.tryParse("10' # [x-x]-TE°MEŠ° ⸢e⸣-["))
            .toEqual<TransliterationLine>({
                lineNumber: {number: 10, isAbsolute: false},
                content: [ds, 'x-x', de, '-', new Sumerogramm('TE'), new Determinativ('MEŠ'), ls, 'e', le, '-', ds]
            });
    });
});
