import { DateTime } from 'luxon';
import { computeCapitalGain } from './capitalGain';
import { Transaction, TRANSACTION_TYPE } from './transaction';

function createTransaction(data: { asset: string; totalEurWithFees: number }): Transaction {
  return {
    ...data,
    timestamp: DateTime.fromMillis(0),
    type: TRANSACTION_TYPE.SELL,
    quantity: NaN,
    spotPrice: NaN,
    totalEur: NaN,
    fees: NaN,
  };
}

describe('Capital gain computation', () => {
  it('should return the difference between cash-in and cash-out for the complete sell of a mono-asset portfolio', () => {
    const portfolio = { cashIn: 5000, assets: { BTC: { quantity: 1, spotPrice: 10000 } } };
    const transaction = createTransaction({ asset: 'BTC', totalEurWithFees: 10000 });
    expect(computeCapitalGain(portfolio, transaction)).toEqual(5000);
  });

  it('should take into account the total value of a portfolio with multi-assets for a partial sell', () => {
    // example taken from https://finary.eu/blog/fiscalite-crypto-monnaie-le-guide/
    const portfolio = {
      cashIn: 10000,
      assets: { BTC: { quantity: 1, spotPrice: 10000 }, ETH: { quantity: 50, spotPrice: 250 } },
    };
    const btcTransaction = createTransaction({ asset: 'BTC', totalEurWithFees: 5000 });
    const ethTransaction = createTransaction({ asset: 'ETH', totalEurWithFees: 6250 });

    expect(
      computeCapitalGain(portfolio, btcTransaction) + computeCapitalGain(portfolio, ethTransaction)
    ).toEqual(6250);
  });
});
