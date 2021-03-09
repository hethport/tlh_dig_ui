import {ManuscriptColumn, ManuscriptColumnModifier, ManuscriptSide} from "./manuscriptProperties/manuscriptProperties";
import {LineParseResult} from "../transliterationParser/parser";
import {ManuscriptLanguage} from "./manuscriptProperties/manuscriptLanugage";

interface SideBasics {
  side: ManuscriptSide;
  column: ManuscriptColumn;
  columnModifier: ManuscriptColumnModifier;
  language: ManuscriptLanguage;
}

export interface RawSideInput extends SideBasics {
  transliteration: string;
}

export interface SideParseResult extends SideBasics {
  lineResults: LineParseResult[];
}