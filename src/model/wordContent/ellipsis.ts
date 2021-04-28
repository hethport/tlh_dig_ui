import {AOWordContent} from "./wordContent";

export interface Ellipsis {
  type: 'AOEllipsis'
}

export const aoEllipsis: Ellipsis = {type: 'AOEllipsis'};

export function isEllipsis(c: AOWordContent): c is Ellipsis {
  return typeof c !== 'string' && 'type' in c && c.type === 'AOEllipsis';
}

/*
const ellipsisFormat: XmlFormat<typeof Ellipsis> = {
  read: (el) => Ellipsis,
  write: () => {
    throw new Error('Not yet defined!')
    // return '…';
  }
}
 */