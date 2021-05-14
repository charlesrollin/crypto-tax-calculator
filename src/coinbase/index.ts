import axios from 'axios';
import * as path from 'path';
import * as fse from 'fs-extra';
import { DateTime } from 'luxon';

// { BTC: { "1970-01-01": 1000 } }
type PriceCache = Record<string, Record<string, number>>;

const priceCache: PriceCache = fse.readJSONSync(
  path.resolve(__dirname, '../../cache/spotPricesCache.json')
);

interface SpotPriceResult {
  data: {
    base: string;
    currency: string;
    amount: string;
  };
}

const updateCache = (asset: string, date: DateTime, price: number) => {
  if (priceCache[asset] === undefined) {
    priceCache[asset] = { [date.toISO()]: price };
  } else {
    priceCache[asset][date.toISO()] = price;
  }
  fse.writeJSONSync(path.resolve(__dirname, '../../cache/spotPricesCache.json'), priceCache);
};

export async function getSpotPriceHistory(asset: string, date: DateTime) {
  const cachedPrice = priceCache[asset]?.[date.toISO()];
  if (cachedPrice) {
    return cachedPrice;
  }
  const result = await axios.get<SpotPriceResult>(
    `https://api.coinbase.com/v2/prices/${asset}-EUR/spot?date=${date.toISO()}`
  );
  const price = parseFloat(result.data.data.amount);
  updateCache(asset, date, price);
  return price;
}
