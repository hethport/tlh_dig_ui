export const determinativRegex = /°(\p{Lu}+)°/u;

/**
 * - automatisch für Großbuchstaben markiert durch ° … ° (davor oder dahinter jeweils ein Spatium oder Bindestrich)
 * - bei mehreren Determinativen nacheinander Doppelsetzung (°°.°°)
 */
export interface Determinativ {
    type: 'Determinativ',
    content: string
}

export function Determinativ(content: string): Determinativ {
    return {type: 'Determinativ', content};
}