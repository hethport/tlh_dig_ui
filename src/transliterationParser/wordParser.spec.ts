import {transliteration} from "./parser";
import {ds, hittiteContentUnion as ht, illegibleContent, sumerogrammContentUnion as sg} from "./testHelpers";
import {Success} from "parsimmon";
import {WordContentInputUnion} from "../generated/graphql";

describe('wordParser', () => {
  const parser = transliteration.wordContent;

  it('should parse words...', () => {
    expect(parser.parse('GUₓ.MAḪ'))
      .toEqual<Success<WordContentInputUnion[]>>({status: true, value: [sg('GUₓ.MAḪ')]});

    expect(parser.tryParse('LUGAL-uš'))
      .toEqual([sg('LUGAL'), ht('-uš')]);

    expect(parser.parse('K]AxU'))
      .toEqual<Success<WordContentInputUnion[]>>({status: true, value: [sg('K', ds, 'A×U')]});

    expect(parser.parse('[x'))
      .toEqual<Success<WordContentInputUnion[]>>({status: true, value: [ds, illegibleContent]});

    expect(parser.tryParse('x]'))
      .toEqual<Success<WordContentInputUnion[]>>({status: true, value: [ds, illegibleContent]});
  });
})