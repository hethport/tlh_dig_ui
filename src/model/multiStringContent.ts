import {ContentOfMultiStringContent, xmlify} from "./oldTransliteration";

export abstract class MultiStringContent {
  protected constructor(public contents: ContentOfMultiStringContent[]) {
  }

  abstract cssClass(): string;

  protected abstract getTag(): string;

  xmlify(): string {
    return `<${this.getTag()}>${this.contents.map(xmlify).join('')}</${this.getTag()}>`;
  }
}

// Akadogramm: automatisch für Zeichen in VERSALIEN, denen ein `-` oder `_` vorausgeht

export class Akkadogramm extends MultiStringContent {
  constructor(contents: ContentOfMultiStringContent[]) {
    super(contents);
  }

  cssClass(): string {
    return 'akkadogramm';
  }

  protected getTag(): string {
    return 'aGr';
  }
}

export function akkadogramm(...contents: ContentOfMultiStringContent[]): MultiStringContent {
  return new Akkadogramm(contents);
}

// Sumerogramm:
// - automatisch für Versalien
// - im Wortinnern durch vorausgehendes `--` markiert

export class Sumerogramm extends MultiStringContent {
  constructor(contents: ContentOfMultiStringContent[]) {
    super(contents);
  }

  cssClass(): string {
    return 'sumerogramm';
  }

  protected getTag(): string {
    return 'sGr';
  }
}

export function sumerogramm(...contents: ContentOfMultiStringContent[]): MultiStringContent {
  return new Sumerogramm(contents);
}
