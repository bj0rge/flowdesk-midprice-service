import { decodeRestResponse, encodeCryptoForRest } from "./codec";
import { getConfig } from "../../utils";
import type { Crypto, OrderbookEntries } from "../../types";

const {
  clients: { huobi },
} = getConfig();

// No listenOrderbook() method as the websocket seems not to be working
// Keeping the doc url for reference
// https://www.htx.com/en-us/opend/newApiPages/?id=8cb7c385-77b5-11ed-9966-0242ac110003

export async function getDepthOrderbookSnapshot({
  assets,
}: {
  assets: { baseAsset: Crypto; quoteAsset: Crypto };
}): Promise<OrderbookEntries> {
  const pair = `${encodeCryptoForRest(assets.baseAsset)}${encodeCryptoForRest(
    assets.quoteAsset
  )}`;
  const url = `${huobi.rest.baseUrl}/market/depth?symbol=${pair}&type=step0`;
  const response = await fetch(url);
  const jsonResponse = await response.json();

  return decodeRestResponse(jsonResponse);
}
