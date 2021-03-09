import {transliteration} from "./parser";
import {determinativ, determinativ as dt, materLectionis, materLectionis as ml,} from "../model/stringContent";
import {akkadogramm, sumerogramm} from "../model/multiStringContent";
import {markContent as mc, MarkType} from '../model/markContent';
import {inscribedLetter} from "../model/inscribedLetter";

describe('hittite', () => {
  const parser = transliteration.hittite;

  it('should parser hittite', () => {
    expect(parser.tryParse('abc')).toEqual('abc');
    expect(parser.tryParse('xyz')).toEqual('xyz');
  });
});

describe('akkadogramm', () => {
  const parser = transliteration.akkadogramm;

  it('should parse akkadogramms starting with _', () => {
    expect(parser.tryParse('_ABC')).toEqual(akkadogramm('_', 'ABC'));
    expect(parser.tryParse('_LUGAL')).toEqual(akkadogramm('_', 'LUGAL'));
    expect(parser.tryParse('_LUGxAL')).toEqual(akkadogramm('_', 'LUG', inscribedLetter('AL')));
    expect(parser.tryParse('_LUGxALx')).toEqual(akkadogramm('_', 'LUG', inscribedLetter('AL'), 'ₓ'));
  });

  it('should parse akkadogramms starting with -', () => {
    expect(parser.tryParse('-ABC')).toEqual(akkadogramm('-', 'ABC'));
    expect(parser.tryParse('-LUGAL')).toEqual(akkadogramm('-', 'LUGAL'));
    expect(parser.tryParse('-LUGxAL')).toEqual(akkadogramm('-', 'LUG', inscribedLetter('AL')));
    expect(parser.tryParse('-LUGxALx')).toEqual(akkadogramm('-', 'LUG', inscribedLetter('AL'), 'ₓ'));
  });
});

describe('sumerogramm', () => {
  const parser = transliteration.sumerogramm;

  it('should parse sumerogramms', () => {
    expect(parser.tryParse('ABC')).toEqual(sumerogramm('ABC'));
    expect(parser.tryParse('LUGAL')).toEqual(sumerogramm('LUGAL'));
    expect(parser.tryParse('GUx.MAḪ')).toEqual(sumerogramm('GU', 'ₓ', '.', 'MAḪ'))
  });

  it('should parse sumerogramms starting with --', () => {
    expect(parser.tryParse('--ABC')).toEqual(sumerogramm('ABC'));
    expect(parser.tryParse('--LUGAL')).toEqual(sumerogramm('LUGAL'));
    expect(parser.tryParse('--GUx.MAḪ')).toEqual(sumerogramm('GU', 'ₓ', '.', 'MAḪ'))
  });
});

describe('determinativ', () => {
  const parser = transliteration.determinativ;

  it('should parser a determinativ', () => {
    expect(parser.tryParse('°ABC°')).toEqual(dt('ABC'));
    expect(parser.tryParse('°XYZ°')).toEqual(dt('XYZ'));
  });

  it('should parse special determinatives', () => {
    expect(parser.tryParse('°m.D°')).toEqual(dt('m.D'));
    expect(parser.tryParse('°f.D°')).toEqual(dt('f.D'));
  })

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

  it('should parse special content as a determinativ', () => {
    expect(parser.tryParse('°m°')).toEqual(dt('m'));
    expect(parser.tryParse('°f°')).toEqual(dt('f'));
  })

  it('should not parse a determinativ', () => {
    expect(parser.parse('°ABC°').status).toBeFalsy();
    expect(parser.parse('°XYZ°').status).toBeFalsy();
  });
});

describe('stringContent', () => {
  const parser = transliteration.simpleWordContent;

  it('should parser hittite', () => {
    expect(parser.tryParse('abc')).toEqual('abc');
    expect(parser.tryParse('xyz')).toEqual('xyz');
  });

  it('should parser a determinativ', () => {
    expect(parser.tryParse('°ABC°')).toEqual(determinativ('ABC'));
    expect(parser.tryParse('°XYZ°')).toEqual(determinativ('XYZ'));
  });

  it('should parse a mater lectionis', () => {
    expect(parser.tryParse('°abc°')).toEqual(materLectionis('abc'));
    expect(parser.tryParse('°xyz°')).toEqual(materLectionis('xyz'));
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

describe('wordContent', () => {
  const parser = transliteration.wordContent;

  it('should parser hittite', () => {
    expect(parser.tryParse('abc')).toEqual('abc');
    expect(parser.tryParse('xyz')).toEqual('xyz');
  });

  it('should parser a determinativ', () => {
    expect(parser.tryParse('°ABC°')).toEqual(determinativ('ABC'));
    expect(parser.tryParse('°XYZ°')).toEqual(determinativ('XYZ'));
  });

  it('should parse a mater lectionis', () => {
    expect(parser.tryParse('°abc°')).toEqual(materLectionis('abc'));
    expect(parser.tryParse('°xyz°')).toEqual(materLectionis('xyz'));
  });

  it('should parse sumerogramms', () => {
    expect(parser.tryParse('ABC')).toEqual(sumerogramm('ABC'));
    expect(parser.tryParse('LUGAL')).toEqual(sumerogramm('LUGAL'));
    expect(parser.tryParse('GUx.MAḪ')).toEqual(sumerogramm('GU', 'ₓ', '.', 'MAḪ'))
  });

  it('should parse sumerogramms starting with --', () => {
    expect(parser.tryParse('--ABC')).toEqual(sumerogramm('ABC'));
    expect(parser.tryParse('--LUGAL')).toEqual(sumerogramm('LUGAL'));
    expect(parser.tryParse('--GUx.MAḪ')).toEqual(sumerogramm('GU', 'ₓ', '.', 'MAḪ'))
  });

  it('should parse akkadogramms starting with _', () => {
    expect(parser.tryParse('_ABC')).toEqual(akkadogramm('_', 'ABC'));
    expect(parser.tryParse('_LUGAL')).toEqual(akkadogramm('_', 'LUGAL'));
    expect(parser.tryParse('_LUGxALx')).toEqual(akkadogramm('_', 'LUG', inscribedLetter('AL'), 'ₓ'));
  });

  it('should parse akkadogramms starting with -', () => {
    expect(parser.tryParse('-ABC')).toEqual(akkadogramm('-', 'ABC'));
    expect(parser.tryParse('-LUGAL')).toEqual(akkadogramm('-', 'LUGAL'));
    expect(parser.tryParse('-LUGxALx')).toEqual(akkadogramm('-', 'LUG', inscribedLetter('AL'), 'ₓ'));
  });
})