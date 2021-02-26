import {transliteration} from "./parser";
import {
  akkadogramm as ag,
  determinativ as dt,
  hittite as ht,
  materLectionis as ml,
  sumerogramm as sg
} from "../model/stringContent";

describe('hittite', () => {
  const parser = transliteration.hittite;

  it('should parser hittite', () => {
    expect(parser.tryParse('abc')).toEqual(ht('abc'));
    expect(parser.tryParse('xyz')).toEqual(ht('xyz'));
  });
});

describe('akkadogramm', () => {
  const parser = transliteration.akkadogramm;

  it('should parse akkadogramms starting with _', () => {
    expect(parser.tryParse('_ABC')).toEqual(ag('ABC'));
    expect(parser.tryParse('_LUGAL')).toEqual(ag('LUGAL'));
  });

  it('should parse akkadogramms starting with -', () => {
    expect(parser.tryParse('-ABC')).toEqual(ag('ABC'));
    expect(parser.tryParse('-LUGAL')).toEqual(ag('LUGAL'));
  });
});

describe('sumerogramm', () => {
  const parser = transliteration.sumerogramm;

  it('should parse sumerogramms', () => {
    expect(parser.tryParse('ABC')).toEqual(sg('ABC'));
    expect(parser.tryParse('LUGAL')).toEqual(sg('LUGAL'));
  });

  it('should parse sumerogramms starting with --', () => {
    expect(parser.tryParse('--ABC')).toEqual(sg('ABC'));
    expect(parser.tryParse('--LUGAL')).toEqual(sg('LUGAL'));
  });
});

describe('determinativ', () => {
  const parser = transliteration.determinativ;

  it('should parser a determinativ', () => {
    expect(parser.tryParse('°ABC°')).toEqual(dt('ABC'));
    expect(parser.tryParse('°XYZ°')).toEqual(dt('XYZ'));
  });

  it('should not parse a mater lectionis', () => {
    expect(parser.parse('°abc°').status).toBeFalsy();
    expect(parser.parse('°xyz°').status).toBeFalsy();
  });
});

describe('materLectionis', () => {
  const parser = transliteration.materLectionis;

  it('should parse a mater lectionis', () => {
    expect(parser.tryParse('°abc°')).toEqual(ml('abc'));
    expect(parser.tryParse('°xyz°')).toEqual(ml('xyz'));
  });

  it('should not parse a determinativ', () => {
    expect(parser.parse('°ABC°').status).toBeFalsy();
    expect(parser.parse('°XYZ°').status).toBeFalsy();
  });
});

describe('stringContent', () => {
  it('should parser hittite', () => {
    expect(transliteration.stringContent.tryParse('abc')).toEqual(ht('abc'));
    expect(transliteration.stringContent.tryParse('xyz')).toEqual(ht('xyz'));
  });

  it('should parser a determinativ', () => {
    expect(transliteration.stringContent.tryParse('°ABC°')).toEqual(dt('ABC'));
    expect(transliteration.stringContent.tryParse('°XYZ°')).toEqual(dt('XYZ'));
  });

  it('should parse a mater lectionis', () => {
    expect(transliteration.stringContent.tryParse('°abc°')).toEqual(ml('abc'));
    expect(transliteration.stringContent.tryParse('°xyz°')).toEqual(ml('xyz'));
  });

  it('should parse sumerogramms', () => {
    expect(transliteration.stringContent.tryParse('ABC')).toEqual(sg('ABC'));
    expect(transliteration.stringContent.tryParse('LUGAL')).toEqual(sg('LUGAL'));
  });

  it('should parse akkadogramms starting with _', () => {
    expect(transliteration.stringContent.tryParse('_ABC')).toEqual(ag('ABC'));
    expect(transliteration.stringContent.tryParse('_LUGAL')).toEqual(ag('LUGAL'));
  });

  it('should parse sumerogramms starting with --', () => {
    expect(transliteration.stringContent.tryParse('--ABC')).toEqual(sg('ABC'));
    expect(transliteration.stringContent.tryParse('--LUGAL')).toEqual(sg('LUGAL'));
  });

  it('should parse akkadogramms starting with -', () => {
    expect(transliteration.stringContent.tryParse('-ABC')).toEqual(ag('ABC'));
    expect(transliteration.stringContent.tryParse('-LUGAL')).toEqual(ag('LUGAL'));
  });
});
