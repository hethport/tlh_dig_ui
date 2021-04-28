import {transliteration} from "./parser";
import {determinativ as dt} from '../model/wordContent/determinativ';
import {numeralContent as nc} from '../model/wordContent/numeralContent';
import {sumerogramm} from "../model/wordContent/multiStringContent";
import {inscribedLetter} from "../model/wordContent/inscribedLetter";
import {de} from "./testHelpers";
import {AOWordContent} from "../model/wordContent/wordContent";

describe.skip('wordParser', () => {
  const parser = transliteration.wordContents;

  it('should parse words...', () => {
    expect(parser.tryParse('GUx.MAḪ'))
      .toEqual<AOWordContent[]>([sumerogramm('GU', 'ₓ', '.', 'MAḪ')]);

    expect(parser.tryParse('LUGAL-uš'))
      .toEqual([sumerogramm('LUGAL'), '-uš']);

    expect(parser.tryParse('°m.D°30--SUM'))
      .toEqual([dt('m.D'), nc('30'), sumerogramm('SUM')]);

    expect(parser.tryParse('K]AxU'))
      .toEqual<AOWordContent[]>([sumerogramm('K', de, 'A', inscribedLetter('U'))]);

    /*
    expect(parser.tryParse('[x'))
      .toEqual<WordContent[]>([ds, illegibleContent]);

    expect(parser.tryParse('x]'))
      .toEqual<WordContent[]>([ds, illegibleContent]);
     */
  });
})