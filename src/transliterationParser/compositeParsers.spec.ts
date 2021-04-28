import {transliteration} from "./parser";
import {akkadogramm, AOAkkadogramm, AOSumerogramm, sumerogramm} from "../model/wordContent/multiStringContent";
import {inscribedLetter} from "../model/wordContent/inscribedLetter";
import {AOWordContent} from "../model/wordContent/wordContent";
import {Parser} from "parsimmon";
import {
  testParseCorrections,
  testParseDamages,
  testParseDeterminativ,
  testParseFootNote,
  testParseHittite,
  testParseInscribedLetter,
  testParseKolonMark,
  testParseMaterLectionis,
  testParseNumeralContent,
  testParseSignContent
} from "./singleParsers.spec";

function testParseContentOfMultiContent(parser: Parser<AOWordContent>): void {
  testParseHittite(parser);
  testParseCorrections(parser);
  testParseDamages(parser);
  testParseInscribedLetter(parser);
}

describe('contentOfMultiStringContentParser', () => testParseContentOfMultiContent(transliteration.contentOfMultiStringContent));

function testParseSimpleWordContent(parser: Parser<AOWordContent>): void {
  testParseContentOfMultiContent(parser);
  testParseDeterminativ(parser);
  testParseMaterLectionis(parser);
  testParseNumeralContent(parser);
  testParseFootNote(parser);
  testParseSignContent(parser);
  testParseKolonMark(parser);
  //  testParseIllegibleContent(parser);
}

describe('simpleWordContentParser', () => testParseSimpleWordContent(transliteration.simpleWordContent));

// Akkadogramm

function testParseAkkadogramm(parser: Parser<AOWordContent>): void {
  const cases: [string, AOAkkadogramm][] = [
    ['_ABC', akkadogramm('_', 'ABC')],
    ['_LUGAL', akkadogramm('_', 'LUGAL')],
    ['_LUGxAL', akkadogramm('_', 'LUG', inscribedLetter('AL'))],
    // TODO: ['_LUGxALx', akkadogramm('_', 'LUG', inscribedLetter('AL'), 'ₓ')],
    ['-ABC', akkadogramm('-', 'ABC')],
    ['-LUGAL', akkadogramm('-', 'LUGAL')],
    ['-LUGxAL', akkadogramm('-', 'LUG', inscribedLetter('AL'))],
    // TODO: ['-LUGxALx', akkadogramm('-', 'LUG', inscribedLetter('AL'), 'ₓ')]
  ];

  test.each(cases)(
    'should parse %p as an akkadogramm',
    (toParse, expected) => expect(parser.tryParse(toParse)).toEqual(expected)
  );
}

describe('akkadogramm', () => testParseAkkadogramm(transliteration.akkadogramm));

// Sumerogramm

function testParseSumerogramm(parser: Parser<AOWordContent>): void {
  const cases: [string, AOSumerogramm][] = [
    ['ABC', sumerogramm('ABC')],
    ['LUGAL', sumerogramm('LUGAL')],
    // TODO: ['GUx.MAḪ', sumerogramm('GU', 'ₓ', '.', 'MAḪ')],
    ['--ABC', sumerogramm('ABC')],
    ['--LUGAL', sumerogramm('LUGAL')],
    // TODO: ['--GUx.MAḪ', sumerogramm('GU', 'ₓ', '.', 'MAḪ')]
  ];

  test.each(cases)(
    'should parse %p as sumerogramm',
    (toParse, expected) => expect(parser.tryParse(toParse)).toEqual(expected)
  );
}

describe('sumerogramm', () => testParseSumerogramm(transliteration.sumerogramm));

// Word Content

function testParseWordContent(parser: Parser<AOWordContent>): void {
  testParseAkkadogramm(parser);
  testParseSumerogramm(parser);
  testParseSimpleWordContent(parser);
//  testParseIllegibleContent(parser);
}

describe('wordContent', () => testParseWordContent(transliteration.wordContent));