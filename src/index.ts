import { parseCsv } from './parser';
import { processTransaction } from './portfolio';
import { Portfolio } from './portfolio/portfolio';

const run = async () => {
  const transactions = parseCsv();
  const portfolios: Record<string, Portfolio> = {};
  await transactions.reduce(async (acc, curr) => {
    portfolios[curr.timestamp.toISO()] = await acc;
    return processTransaction(await acc, curr);
  }, Promise.resolve({ assets: {}, cashIn: 0 }));
};

run();
