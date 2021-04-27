import {transliteration} from "./parser";
import {determinativ} from "../model/wordContent/determinativ";
import {akkadogramm, sumerogramm} from "../model/wordContent/multiStringContent";
import {inscribedLetter} from "../model/wordContent/inscribedLetter";
import {materLectionis} from "../model/wordContent/materLectionis";

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
    expect(parser.tryParse('°ABC°')).toEqual(determinativ('ABC'));
    expect(parser.tryParse('°XYZ°')).toEqual(determinativ('XYZ'));
  });

  it('should parse special determinatives', () => {
    expect(parser.tryParse('°m.D°')).toEqual(determinativ('m.D'));
    expect(parser.tryParse('°f.D°')).toEqual(determinativ('f.D'));
  })

  it('should not parse a mater lectionis', () => {
    expect(parser.parse('°abc°').status).toBeFalsy();
    expect(parser.parse('°xyz°').status).toBeFalsy();
  });
});

describe('materLectionis', () => {
  const parser = transliteration.materLectionis;

  it('should parse a mater lectionis', () => {
    expect(parser.tryParse('°abc°')).toEqual(materLectionis('abc'));
    expect(parser.tryParse('°xyz°')).toEqual(materLectionis('xyz'));
  });

  it('should parse special content as a determinativ', () => {
    expect(parser.tryParse('°m°')).toEqual(determinativ('m'));
    expect(parser.tryParse('°f°')).toEqual(determinativ('f'));
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

/*
describe('markContent', () => {
  const parser = transliteration.markContent;

  it('should parse mark contents', () => {
    expect(parser.tryParse('{S:AN}')).toEqual(aoSign('AN'))
    expect(parser.tryParse('{K:AN}')).toEqual(aoKolonMark('AN'))
    expect(parser.tryParse('{F:AN}')).toEqual(aoNote('AN', '-1'))
    expect(parser.tryParse('{G:AN}')).toEqual(aoGap('AN'))

    expect(parser.tryParse('{S:Anderer Text}')).toEqual(aoSign('Anderer Text'))
    expect(parser.tryParse('{K:Anderer Text}')).toEqual(aoKolonMark('Anderer Text'))
    expect(parser.tryParse('{F:Anderer Text}')).toEqual(aoNote('Anderer Text', '-1'))
    expect(parser.tryParse('{G:Anderer Text}')).toEqual(aoGap('Anderer Text'))
  });
});
 */

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