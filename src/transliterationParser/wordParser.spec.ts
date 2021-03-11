import {transliteration} from "./parser";
import {determinativ as dt} from '../model/stringContent';
import {sumerogramm} from "../model/multiStringContent";
import {numeralContent as nc, WordContent} from "../model/oldTransliteration";
import {inscribedLetter} from "../model/inscribedLetter";
import {de} from "./testHelpers";

describe('wordParser', () => {
  const parser = transliteration.wordContents;

  it('should parse words...', () => {
    expect(parser.tryParse('GUx.MAḪ'))
      .toEqual<WordContent[]>([sumerogramm('GU', 'ₓ', '.', 'MAḪ')]);

    expect(parser.tryParse('LUGAL-uš'))
      .toEqual([sumerogramm('LUGAL'), '-uš']);

    expect(parser.tryParse('°m.D°30--SUM'))
      .toEqual([dt('m.D'), nc('30'), sumerogramm('SUM')]);

    expect(parser.tryParse('K]AxU'))
      .toEqual<WordContent[]>([sumerogramm('K', de, 'A', inscribedLetter('U'))]);

    /*
    expect(parser.tryParse('[x'))
      .toEqual<WordContent[]>([ds, illegibleContent]);

    expect(parser.tryParse('x]'))
      .toEqual<WordContent[]>([ds, illegibleContent]);
     */
  });
})