import {transliteration} from "./parser";
import {de, ds, illegibleContent,} from "./testHelpers";
import {determinativ as dt} from "../model/determinativ";
import {sumerogramm} from "../model/multiStringContent";
import {numeralContent as nc} from "../model/numeralContent";
import {WordContent} from "../model/oldTransliteration";
import {inscribedLetter} from "../model/inscribedLetter";

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