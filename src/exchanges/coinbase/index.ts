import axios from 'axios';
import * as path from 'path';
import * as fse from 'fs-extra';
import * as parse from 'csv-parse/lib/sync';
import { DateTime } from 'luxon';
import { Exchange } from '../exchange';
import { priceCache, updateCache } from '../priceCache';

interface SpotPriceResult {
  data: {
    base: string;
    currency: string;
    amount: string;
  };
}

export const coinbaseExchange: Exchange = {
  parse: () => {
    const csvContent = fse.readFileSync(path.resolve(__dirname, '../../../data/coinbase.csv'));
    const records: any[] = parse(csvContent, { fromLine: 9 });
    return records
      .map(
        ([timestamp, type, asset, quantity, _, spotPrice, totalEur, totalEurWithFees, fees]) => ({
          timestamp: DateTime.fromISO(timestamp),
          type,
          asset,
          quantity: parseFloat(quantity),
          spotPrice: parseFloat(spotPrice),
          totalEur: parseFloat(totalEur),
          totalEurWithFees: parseFloat(totalEurWithFees),
          fees: parseFloat(fees),
        })
      )
      .sort((t1, t2) => t1.timestamp.toMillis() - t2.timestamp.toMillis());
  },
  getSpotPrice: async ({ asset, date }: { asset: string; date: DateTime }) => {
    {
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
  },
};
