import {transliteration} from "./parser";
import {
  akkadogramm as ag,
  determinativ as dt,
  hittite as ht,
  materLectionis as ml,
  sumerogramm as sg
} from "../model/stringContent";
import {markContent as mc} from '../model/markContent';
import {MarkType} from "../generated/graphql";
import {
  akkadogrammContentUnion,
  determinativContentUnion,
  hittiteContentUnion,
  materLectionisContentUnion,
  sumerogrammContentUnion
} from "./testHelpers";
import {alt, oneOf, regexp} from "parsimmon";
import {upperTextRegex} from "./singleParsers";

describe('hittite', () => {
  const parser = transliteration.hittite;

  expect(alt(regexp(upperTextRegex), oneOf('-ₓ')).tryParse('ₓ')).toEqual('ₓ');

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
    expect(parser.tryParse('_LUGₓAL')).toEqual(ag('LUGₓAL'));
  });

  it('should parse akkadogramms starting with -', () => {
    expect(parser.tryParse('-ABC')).toEqual(ag('-ABC'));
    expect(parser.tryParse('-LUGAL')).toEqual(ag('-LUGAL'));
    expect(parser.tryParse('-LUGₓAL')).toEqual(ag('-LUGₓAL'));
  });
});

describe('sumerogramm', () => {
  const parser = transliteration.sumerogramm;

  it('should parse sumerogramms', () => {
    expect(parser.tryParse('ABC')).toEqual(sg('ABC'));
    expect(parser.tryParse('LUGAL')).toEqual(sg('LUGAL'));

    expect(parser.tryParse('GUₓ.MAḪ')).toEqual(sg('GUₓ.MAḪ'))
  });

  it('should parse sumerogramms starting with --', () => {
    expect(parser.tryParse('--ABC')).toEqual(sg('ABC'));
    expect(parser.tryParse('--LUGAL')).toEqual(sg('LUGAL'));

    expect(parser.tryParse('--GUₓ.MAḪ')).toEqual(sg('GUₓ.MAḪ'))
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
  const parser = transliteration.stringContent;

  it('should parser hittite', () => {
    expect(parser.tryParse('abc')).toEqual(hittiteContentUnion('abc'));
    expect(parser.tryParse('xyz')).toEqual(hittiteContentUnion('xyz'));
  });

  it('should parser a determinativ', () => {
    expect(parser.tryParse('°ABC°')).toEqual(determinativContentUnion('ABC'));
    expect(parser.tryParse('°XYZ°')).toEqual(determinativContentUnion('XYZ'));
  });

  it('should parse a mater lectionis', () => {
    expect(parser.tryParse('°abc°')).toEqual(materLectionisContentUnion('abc'));
    expect(parser.tryParse('°xyz°')).toEqual(materLectionisContentUnion('xyz'));
  });

  it('should parse sumerogramms', () => {
    expect(parser.tryParse('ABC')).toEqual(sumerogrammContentUnion('ABC'));
    expect(parser.tryParse('LUGAL')).toEqual(sumerogrammContentUnion('LUGAL'));

    expect(parser.tryParse('GUₓ.MAḪ')).toEqual(sumerogrammContentUnion('GUₓ.MAḪ'))
  });

  it('should parse sumerogramms starting with --', () => {
    expect(parser.tryParse('--ABC')).toEqual(sumerogrammContentUnion('ABC'));
    expect(parser.tryParse('--LUGAL')).toEqual(sumerogrammContentUnion('LUGAL'));
  });

  it('should parse akkadogramms starting with _', () => {
    expect(parser.tryParse('_ABC')).toEqual(akkadogrammContentUnion('ABC'));
    expect(parser.tryParse('_LUGAL')).toEqual(akkadogrammContentUnion('LUGAL'));
  });

  it('should parse akkadogramms starting with -', () => {
    expect(parser.tryParse('-ABC')).toEqual(akkadogrammContentUnion('-ABC'));
    expect(parser.tryParse('-LUGAL')).toEqual(akkadogrammContentUnion('-LUGAL'));
  });
});

describe('markType', () => {
  const parser = transliteration.markType;

  it('should parse mark types', () => {
    expect(parser.tryParse('S')).toEqual(MarkType.Sign);
    expect(parser.tryParse('G')).toEqual(MarkType.TextGap);
    expect(parser.tryParse('F')).toEqual(MarkType.FootNote);
    expect(parser.tryParse('K')).toEqual(MarkType.Colon);
  });
});

describe('markContent', () => {
  const parser = transliteration.markContent;

  it('should parse mark contents', () => {
    expect(parser.tryParse('{S:AN}')).toEqual(mc(MarkType.Sign, 'AN'))
    expect(parser.tryParse('{K:AN}')).toEqual(mc(MarkType.Colon, 'AN'))
    expect(parser.tryParse('{F:AN}')).toEqual(mc(MarkType.FootNote, 'AN'))
    expect(parser.tryParse('{G:AN}')).toEqual(mc(MarkType.TextGap, 'AN'))

    expect(parser.tryParse('{S:Anderer Text}')).toEqual(mc(MarkType.Sign, 'Anderer Text'))
    expect(parser.tryParse('{K:Anderer Text}')).toEqual(mc(MarkType.Colon, 'Anderer Text'))
    expect(parser.tryParse('{F:Anderer Text}')).toEqual(mc(MarkType.FootNote, 'Anderer Text'))
    expect(parser.tryParse('{G:Anderer Text}')).toEqual(mc(MarkType.TextGap, 'Anderer Text'))
  });
});