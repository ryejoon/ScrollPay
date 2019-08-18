
export class TxItem<T> {
  transaction: string;
  block?: Block;
  pushdata: T;

  // for chronos
  timeago?: string;
  timestamp?: string;

  // for neon genesis
  order?: number;
}

export class NeonResponse<T> {
  c: Array<TxItem<T>> = [];
  u: Array<TxItem<T>> = [];
}

export class NeonScrollPayResponse extends NeonResponse<ScrollPayData> {
}

// const data = [
//    Const.SCROLLPAY_PROTOCOL,
//    scrollpay.title,
//    scrollpay.description,
//    scrollpay.preview,
//    scrollpay.chunkSha256Hashes.toString(),
//    '|',
//    Const.SPLIT_PROTOCOL,
//    split.payToAddress,
//    split.splitType,
//    split.rangeStart,
//    split.rangeEnd,
//    split.priceUnit,
//    split.price
//    ];
export class ScrollPayData {
  // Scrollpay Protocol
  title?: string;
  description: string;
  preview?: string;
  chunkHashes?: string;

  // Split Protocol
  paytoAddress?: string;
  rangeStart?: string;
  rangeEnd?: string;
  priceUnit?: string;
  price?: string;
}

export class Block {
  h: string;
  i: number;
  t: number;
}
