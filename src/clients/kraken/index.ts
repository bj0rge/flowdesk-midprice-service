import {
  decodeRestResponse,
  decodeWsResponse,
  encodeCryptoForRest,
  encodeCryptoForWs,
} from "./codec";
import { getConfig, listenOrderbookWebsocket } from "../../utils";
import type { Assets, OrderbookEntries } from "../../domain";

const {
  clients: { kraken },
} = getConfig();

export async function listenOrderbook({
  assets,
  cb,
}: {
  assets: Assets;
  cb: (entries: OrderbookEntries) => void;
}): Promise<void> {
  const baseAsset = encodeCryptoForWs(assets.baseAsset);
  const quoteAsset = encodeCryptoForWs(assets.quoteAsset);
  const wsUri = `${kraken.websocket.baseUrl}`;

  await listenOrderbookWebsocket({
    assets: { baseAsset, quoteAsset },
    wsUri,
    message: {
      method: "subscribe",
      params: {
        channel: "book",
        symbol: [`${baseAsset}/${quoteAsset}`],
      },
    },
    channel: "book",
    client: "Kraken",
    decoder: decodeWsResponse,
    cb,
  });
}

export async function getDepthOrderbookSnapshot({
  assets,
}: {
  assets: Assets;
}): Promise<OrderbookEntries> {
  const pair = `${encodeCryptoForRest(assets.baseAsset)}${encodeCryptoForRest(
    assets.quoteAsset
  )}`;
  const url = `${kraken.rest.baseUrl}/Depth?pair=${pair}`;
  const response = await fetch(url);
  const jsonResponse = await response.json();

  return decodeRestResponse(pair)(jsonResponse);
}
