import {HasSimtexStyleName, JsonFormat} from "./basics";

export const determinativRegex = /°(\p{Lu}+)°/u;

interface IDeterminativ {
    type: 'Determinativ';
    content: string;
}

/**
 * - automatisch für Großbuchstaben markiert durch ° … ° (davor oder dahinter jeweils ein Spatium oder Bindestrich)
 * - bei mehreren Determinativen nacheinander Doppelsetzung (°°.°°)
 */
export class Determinativ implements HasSimtexStyleName {
    constructor(public readonly content: string) {
    }

    styleName(): string {
        return 'AO:Determ'
    }
}

export const determinativFormat: JsonFormat<IDeterminativ, Determinativ> = {
    fromJson(t: IDeterminativ): Determinativ {
        return new Determinativ(t.content);
    },
    toJson(u: Determinativ): IDeterminativ {
        return {type: 'Determinativ', content: u.content};
    }
}