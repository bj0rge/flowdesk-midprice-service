import {
  type Exchange,
  type OrderbookEntries,
  findBestOrders,
} from "../../domain";
import type { BestOrdersService } from "../bestOrdersService";

export const updateBestOrders = ({
  bestOrdersService,
  entries,
  exchange,
}: {
  bestOrdersService: BestOrdersService;
  entries: OrderbookEntries;
  exchange: Exchange;
}): void => {
  const { bestAsk, bestBid } = findBestOrders(entries);
  bestOrdersService.setBestAsk(exchange, bestAsk);
  bestOrdersService.setBestBid(exchange, bestBid);
};
