import {HasSimtexStyleName, JsonFormat} from "./basics";

interface IMaterLectionis {
    type: 'MaterLectionis';
    content: string;
}

/**
 * vor und nach der Mater Lectionis (Kleinbuchstaben markiert durch ° … °; davor oder dahinter jeweils ein Spatium oder Bindestrich)
 */
export class MaterLectionis implements HasSimtexStyleName {
    constructor(public readonly content: string) {
    }

    styleName(): string {
        return 'AO:MaterLect';
    }
}

export const materLectionisFormat: JsonFormat<IMaterLectionis, MaterLectionis> = {
    fromJson(t: IMaterLectionis): MaterLectionis {
        return new MaterLectionis(t.content);
    },
    toJson(u: MaterLectionis): IMaterLectionis {
        return {type: 'MaterLectionis', content: u.content}
    }
}