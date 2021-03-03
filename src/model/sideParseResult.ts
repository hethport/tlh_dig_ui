import {ManuscriptColumn, ManuscriptColumnModifier, ManuscriptLanguage, ManuscriptSide} from "../generated/graphql";
import {LineParseResult} from "../transliterationParser/parser";

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