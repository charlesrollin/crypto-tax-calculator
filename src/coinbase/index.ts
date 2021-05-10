import axios from 'axios';
import { DateTime } from 'luxon';

interface SpotPriceResult {
  data: {
    base: string;
    currency: string;
    amount: string;
  };
}

export async function getSpotPriceHistory(asset: string, date: DateTime) {
  const result = await axios.get<SpotPriceResult>(
    `https://api.coinbase.com/v2/prices/${asset}-EUR/spot?date=${date.toISO()}`
  );
  return parseFloat(result.data.data.amount);
}
