import { decodeRestResponse, decodeWsResponse } from "./codec";
import { getConfig, listenOrderbookWebsocket } from "../../utils";
import type { Crypto, OrderbookEntries } from "../../types";

const {
  clients: { binance },
} = getConfig();

export async function listenOrderbook({
  assets,
  cb,
}: {
  assets: { baseAsset: Crypto; quoteAsset: Crypto };
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
  assets: { baseAsset: Crypto; quoteAsset: Crypto };
}): Promise<OrderbookEntries> {
  const url = `${binance.rest.baseUrl}/depth?symbol=${assets.baseAsset}${assets.quoteAsset}&limit=1000`;
  const response = await fetch(url);
  const jsonResponse = await response.json();

  return decodeRestResponse(jsonResponse);
}
