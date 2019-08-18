export interface SplitPayOption {
  payToAddress: string;
  splitType: 'infinite' | 'inventory' | 'range';
  price: number;

  /**
   * Only for inventory type
   */
  inventory?: number;

  /**
   * Only for range type
   */
  // Inclusive
  rangeStart?: number;
  // Exclusive
  rangeEnd?: number;
  priceUnit?: number;
}
