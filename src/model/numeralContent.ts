import {NumeralContentInput} from "../generated/graphql";

export const numeralContentRegex: RegExp = /\d+/;
export const subscriptNumeralContentRegex: RegExp = /[₀₁₂₃₄₅₆₇₈₉]+/

export function numeralContent(content: string, isSubscript: boolean = false): NumeralContentInput {
  return {content, isSubscript};
}
