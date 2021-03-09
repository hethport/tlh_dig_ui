import {
  getXmlNameForManuscriptSide,
  ManuscriptColumn,
  ManuscriptColumnModifier,
  ManuscriptSide
} from "./manuscriptProperties/manuscriptProperties";
import {getAbbreviationForManuscriptLanguage, ManuscriptLanguage} from "./manuscriptProperties/manuscriptLanugage";
import {Word} from "./oldTransliteration";

export class TransliterationTextLineParseResult {
  constructor(
    public lineNumber: number,
    public lineNumberIsAbsolute: boolean = false,
    public words: Word[]
  ) {
  }

  xmlify(textId: string, side: ManuscriptSide, language: ManuscriptLanguage, column: ManuscriptColumn, columnModifier: ManuscriptColumnModifier, paragraphNumber: number = 1): string {
    // FIXME: paragraphNumber!
    const sideName = getXmlNameForManuscriptSide(side);
    const lang = getAbbreviationForManuscriptLanguage(language);

    const x = `<lb txtid="${textId}" lnr="${sideName} ${paragraphNumber} ${this.lineNumber}" lg="${lang}"/>\n\n`
    return x + this.words.map((tw) => tw.xmlify()).join(' ');
  }
}

