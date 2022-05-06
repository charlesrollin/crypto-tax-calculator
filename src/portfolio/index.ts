import { DateTime } from 'luxon';
import { coinbaseExchange } from '../exchanges';
import { computeCapitalGain } from './capitalGain';
import { Portfolio } from './portfolio';
import { Transaction, TRANSACTION_TYPE } from './transaction';

const addSpotPrices = async (assets: Portfolio['assets'], date: DateTime): Promise<void> => {
  for (const asset of Object.keys(assets)) {
    assets[asset].spotPrice = await coinbaseExchange.getSpotPrice({ asset, date });
  }
};

const copyPortfolio = ({ assets, cashIn, totalCashIn }: Portfolio): Portfolio => ({
  assets: Object.keys(assets).reduce((acc, curr) => {
    acc[curr] = { ...assets[curr], spotPrice: NaN };
    return acc;
  }, {}),
  cashIn,
  totalCashIn,
});

export const processTransaction = async (
  currentPortfolio: Portfolio,
  transaction: Transaction
): Promise<Portfolio> => {
  let { assets, cashIn, totalCashIn } = copyPortfolio(currentPortfolio);
  const newAsset = assets[transaction.asset] ?? {
    quantity: 0,
    spotPrice: 0,
  };
  if (transaction.type === TRANSACTION_TYPE.RECEIVE || transaction.type === TRANSACTION_TYPE.BUY) {
    newAsset.quantity += transaction.quantity;
    totalCashIn += !isNaN(transaction.totalEurWithFees)
      ? transaction.totalEurWithFees
      : transaction.quantity * transaction.spotPrice;
    cashIn += !isNaN(transaction.totalEurWithFees)
      ? transaction.totalEurWithFees
      : transaction.quantity * transaction.spotPrice;
  }
  if (transaction.type === TRANSACTION_TYPE.SELL) {
    await addSpotPrices(assets, transaction.timestamp);
    const capitalGain = computeCapitalGain({ assets, cashIn, totalCashIn }, transaction);
    newAsset.spotPrice = transaction.spotPrice;
    newAsset.quantity -= transaction.quantity;
    cashIn -= transaction.totalEurWithFees - capitalGain;
  }
  assets[transaction.asset] = newAsset;
  return {
    assets,
    cashIn,
    totalCashIn,
  };
};
