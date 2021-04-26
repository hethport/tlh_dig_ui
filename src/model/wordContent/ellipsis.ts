export const Ellipsis = {
  type: 'AOEllipsis'
};

export type Ellipsis = typeof Ellipsis;

/*
const ellipsisFormat: XmlFormat<typeof Ellipsis> = {
  read: (el) => Ellipsis,
  write: () => {
    throw new Error('Not yet defined!')
    // return '…';
  }
}
 */