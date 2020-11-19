/**
 * vor und nach der Mater Lectionis (Kleinbuchstaben markiert durch ° … °; davor oder dahinter jeweils ein Spatium oder Bindestrich)
 */
export interface MaterLectionis {
    type: 'MaterLectionis';
    content: string;
}

export function MaterLectionis(content: string): MaterLectionis {
    return {type: 'MaterLectionis', content};
}

