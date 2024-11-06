import { decodeRestResponse, decodeWsResponse } from "./codec";
import { getConfig, listenOrderbookWebsocket } from "../../utils";
import type { Assets, OrderbookEntries } from "../../domain";

const {
  clients: { binance },
} = getConfig();

export async function listenOrderbook({
  assets,
  cb,
}: {
  assets: Assets;
  cb: (entries: OrderbookEntries) => void;
}): Promise<void> {
  const baseAsset = assets.baseAsset.toLowerCase();
  const quoteAsset = assets.quoteAsset.toLowerCase();
  const wsUri = `${binance.websocket.baseUrl}/${baseAsset}${quoteAsset}@depth`;

  await listenOrderbookWebsocket({
    assets: { baseAsset, quoteAsset },
    wsUri,
    client: "Binance",
    decoder: decodeWsResponse,
    cb,
  });
}

export async function getDepthOrderbookSnapshot({
  assets,
}: {
  assets: Assets;
}): Promise<OrderbookEntries> {
  const url = `${binance.rest.baseUrl}/depth?symbol=${assets.baseAsset}${assets.quoteAsset}&limit=1000`;
  const response = await fetch(url);
  const jsonResponse = await response.json();

  return decodeRestResponse(jsonResponse);
}
