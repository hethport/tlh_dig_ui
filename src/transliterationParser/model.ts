export interface LineNumber {
  number: number;
  isAbsolute: boolean;
}


export class Hittite {
  constructor(public content: string) {
  }
}

export class Akadogramm {
  constructor(public content: string) {
  }
}

export class Sumerogramm {
  constructor(public content: string) {
  }
}

export class Determinativ {
  constructor(public content: string) {
  }
}


export type StringTransliterationLineContent = Hittite | Akadogramm | Sumerogramm | Determinativ;


export class UnCertain {
  constructor(public content: StringTransliterationLineContent) {
  }
}


export type SupplementContent = UnCertain | StringTransliterationLineContent;

export class Supplemented {
  constructor(public content: SupplementContent) {
  }
}


export type TransliterationLineContent = Supplemented | SupplementContent;


export interface TransliterationLine {
  lineNumber: LineNumber;
  content: TransliterationLineContent[];
}
