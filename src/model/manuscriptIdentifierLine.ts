export const manuscriptIdentifierRegex = /[\w.]*/u;


export interface TextPublicationIdentifier {
    type: 'TextPublicationIdentifier';
    identifier: string;
}

export function TextPublicationIdentifier(identifier: string): TextPublicationIdentifier {
    return {type: 'TextPublicationIdentifier', identifier};
}


export interface InventoryNumberIdentifier {
    type: 'InventoryNumberIdentifer';
    identifier: string;
}

export function InventoryNumberIdentifier(identifier: string): InventoryNumberIdentifier {
    return {type: 'InventoryNumberIdentifer', identifier}
}


export type ManuscriptIdentifierLineContent = TextPublicationIdentifier | InventoryNumberIdentifier;

export interface ManuscriptIdentifierLine {
    type: 'ManuscriptIdentifierLine';
    content: ManuscriptIdentifierLineContent[];
}

export function ManuscriptIdentifierLine(content: ManuscriptIdentifierLineContent[]): ManuscriptIdentifierLine {
    return {type: 'ManuscriptIdentifierLine', content};
}