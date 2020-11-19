export const numeralContentRegex: RegExp = /\d+/;

export interface NumeralContent {
    type: 'NumeralContent';
    number: number;
}

export function NumeralContent(number: number): NumeralContent {
    return {type: 'NumeralContent', number};
}


export const subscriptNumeralContentRegex: RegExp = /[₀₁₂₃₄₅₆₇₈₉]+/

export interface SubscriptNumeralContent {
    type: 'SubscriptNumeralContent';
    number: number;
}

export function SubscriptNumeralContent(number: number): SubscriptNumeralContent {
    return {type: 'SubscriptNumeralContent', number};
}

export function SubscriptNumberContentFromString(numberStr: string): SubscriptNumeralContent {
    return SubscriptNumeralContent(
        parseInt(
            numberStr
                .split('')
                .map((char) => {
                    const charCode = char.charCodeAt(0);

                    if (8320 <= charCode && charCode <= 8329) {
                        return charCode % 10;
                    } else {
                        throw new Error('Illegal!');
                    }
                })
                .join('')
        )
    );

}
