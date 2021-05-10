import { DateTime } from 'luxon';
import { getSpotPriceHistory } from '../coinbase';
import { computeCapitalGain } from './capitalGain';
import { Portfolio } from './portfolio';
import { Transaction, TRANSACTION_TYPE } from './transaction';

const addSpotPrices = async (assets: Portfolio['assets'], date: DateTime): Promise<void> => {
  for (const asset of Object.keys(assets)) {
    assets[asset].spotPrice = await getSpotPriceHistory(asset, date);
  }
};

const copyPortfolio = ({ assets, cashIn }: Portfolio): Portfolio => ({
  assets: Object.keys(assets).reduce((acc, curr) => {
    acc[curr] = { ...assets[curr], spotPrice: NaN };
    return acc;
  }, {}),
  cashIn,
});

export const processTransaction = async (
  currentPortfolio: Portfolio,
  transaction: Transaction
): Promise<Portfolio> => {
  let { assets, cashIn } = copyPortfolio(currentPortfolio);
  const newAsset = assets[transaction.asset] ?? {
    quantity: 0,
    spotPrice: 0,
  };
  if (transaction.type === TRANSACTION_TYPE.RECEIVE || transaction.type === TRANSACTION_TYPE.BUY) {
    newAsset.quantity += transaction.quantity;
    cashIn += !isNaN(transaction.totalEurWithFees)
      ? transaction.totalEur
      : transaction.quantity * transaction.spotPrice;
  }
  if (transaction.type === TRANSACTION_TYPE.SELL) {
    const cashOut = transaction.totalEurWithFees;
    // TODO: consume Coinbase API to compute portfolio value then
    // - benefice / loss on transaction
    // - updated cash-in
    await addSpotPrices(assets, transaction.timestamp);
    const capitalGain = computeCapitalGain({ assets, cashIn }, transaction);
    console.log(
      `[${transaction.timestamp.toFormat('yyyy')}]Plus-value[${transaction.asset}]: ${capitalGain}`
    );
    newAsset.spotPrice = transaction.spotPrice;
    newAsset.quantity -= transaction.quantity;
    cashIn -= transaction.totalEurWithFees - capitalGain;
  }
  assets[transaction.asset] = newAsset;
  return {
    assets,
    cashIn,
  };
};
