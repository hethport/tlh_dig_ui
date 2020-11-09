export interface LineNumber {
    number: number;
    isAbsolute: boolean;
}


export interface Hittite {
    type: 'Hittite';
    content: string;
}

export function Hittite(content: string): Hittite {
    return {type: 'Hittite', content};
}


export interface Akadogramm {
    type: 'Akadogramm';
    content: string;
}

export function Akadogramm(content: string): Akadogramm {
    return {type: 'Akadogramm', content};
}


export interface Sumerogramm {
    type: 'Sumerogramm';
    content: string;
}

export function Sumerogramm(content: string): Sumerogramm {
    return {type: 'Sumerogramm', content};
}


export interface Determinativ {
    type: 'Determinativ';
    content: string;
}

export function Determinativ(content: string): Determinativ {
    return {type: 'Determinativ', content};
}


export type StringTransliterationLineContent = Hittite | Akadogramm | Sumerogramm | Determinativ;

// UnCertain

export interface UnCertain {
    type: 'UnCertain';
    content: StringTransliterationLineContent;
}

export function UnCertain(content: StringTransliterationLineContent): UnCertain {
    return {type: 'UnCertain', content};
}

export function isUnCertain(sc: SupplementContent): sc is UnCertain {
    return 'type' in sc && sc.type === 'UnCertain';
}


// Supplemented

export type SupplementContent = UnCertain | StringTransliterationLineContent;

export interface Supplemented {
    type: 'Supplemented';
    content: SupplementContent;
}

export function Supplemented(content: SupplementContent): Supplemented {
    return {type: 'Supplemented', content};
}

export function isSupplemented(tlc: TransliterationLineContent): tlc is Supplemented {
    return 'type' in tlc && tlc.type === 'Supplemented';
}


export type TransliterationLineContent = Supplemented | SupplementContent;


export interface TransliterationLine {
    lineNumber: LineNumber;
    content: TransliterationLineContent[];
}
