import {transliteration} from './parser';
import {akkadogramm as ag, determinativ as dt, hittite as ht, sumerogramm as sg} from "../model/stringContent";

describe('test', () => {
  it('should parse hittite', () => {
    expect(transliteration.hittite.tryParse('het'))
      .toEqual(ht('het'));
    expect(transliteration.hittite.tryParse('tén'))
      .toEqual(ht('tén'));
  });

  it('should parse akadogramms', () => {
    expect(transliteration.akkadogramm.tryParse('_ABC'))
      .toEqual(ag('ABC'));

    expect(transliteration.akkadogramm.tryParse('-ABC'))
      .toEqual(ag('ABC'));
  });

  it('should parse sumerogramms', () => {
    expect(transliteration.sumerogramm.tryParse('ABC'))
      .toEqual(sg('ABC'));
  });

  it('should parse determinatives', () => {
    expect(transliteration.determinativ.tryParse('°ABC°'))
      .toEqual(dt('ABC'));
  });
});
