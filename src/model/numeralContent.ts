export const numeralContentRegex: RegExp = /\d+/;
export const subscriptNumeralContentRegex: RegExp = /[₀₁₂₃₄₅₆₇₈₉]+/

export interface NumeralContent {
    type: 'NumeralContent';
    isSubscript: boolean;
    content: string;
}

export function numeralContent(content: string, isSubscript: boolean = false): NumeralContent {
    return {type: 'NumeralContent', content, isSubscript};
}
