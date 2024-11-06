import { getConfig } from "../utils";

const {
  service: {
    globalPriceIndex: { handledCryptos },
  },
} = getConfig();

export type Crypto = (typeof handledCryptos)[number];
export type Assets = { baseAsset: Crypto; quoteAsset: Crypto };

export type Pair = `${Crypto}/${Crypto}`;
export const supportedPairs: Pair[] = ["BTC/USDT"] as const;
export type SupportedPair = (typeof supportedPairs)[number];
export const isSupportedPair = (pair: Assets): boolean => {
  return supportedPairs.includes(`${pair.baseAsset}/${pair.quoteAsset}`);
};
