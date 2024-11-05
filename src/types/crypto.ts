import { getConfig } from "../utils";

const {
  service: {
    globalPriceIndex: { handledCryptos },
  },
} = getConfig();

export type Crypto = (typeof handledCryptos)[number];
