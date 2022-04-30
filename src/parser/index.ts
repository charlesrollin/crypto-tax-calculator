import * as path from 'path';
import * as fse from 'fs-extra';
import * as parse from 'csv-parse/lib/sync';
import { Transaction } from 'src/portfolio/transaction';
import { DateTime } from 'luxon';

export function parseCsv(): Transaction[] {
  const csvContent = fse.readFileSync(path.resolve(__dirname, '../../data/coinbase.csv'));
  const records: any[] = parse(csvContent, { fromLine: 9 });
  return records
    .map(([timestamp, type, asset, quantity, _, spotPrice, totalEur, totalEurWithFees, fees]) => ({
      timestamp: DateTime.fromISO(timestamp),
      type,
      asset,
      quantity: parseFloat(quantity),
      spotPrice: parseFloat(spotPrice),
      totalEur: parseFloat(totalEur),
      totalEurWithFees: parseFloat(totalEurWithFees),
      fees: parseFloat(fees),
    }))
    .sort((t1, t2) => t1.timestamp.toMillis() - t2.timestamp.toMillis());
}
