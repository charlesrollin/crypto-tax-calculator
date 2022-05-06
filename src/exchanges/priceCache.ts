import * as path from 'path';
import * as fse from 'fs-extra';
import { DateTime } from 'luxon';

// { BTC: { "1970-01-01": 1000 } }
type PriceCache = Record<string, Record<string, number>>;

export const priceCache: PriceCache = fse.readJSONSync(
  path.resolve(__dirname, '../../cache/spotPricesCache.json')
);

export const updateCache = (asset: string, date: DateTime, price: number) => {
  if (priceCache[asset] === undefined) {
    priceCache[asset] = { [date.toISO()]: price };
  } else {
    priceCache[asset][date.toISO()] = price;
  }
  fse.writeJSONSync(path.resolve(__dirname, '../../cache/spotPricesCache.json'), priceCache);
};
