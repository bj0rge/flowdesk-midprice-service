export type Order = {
  price: number;
  quantity: number;
};

export type OrderbookEntries = {
  firstUpdateId?: number;
  lastUpdateId: number;
  bids: Order[];
  asks: Order[];
};
