import { Portfolio } from './portfolio';
import { Transaction } from './transaction';

const evaluatePortfolio = (portfolio: Portfolio): number => {
  return Object.keys(portfolio.assets).reduce((value, asset) => {
    const assetPortfolio = portfolio.assets[asset];
    return value + assetPortfolio.quantity * assetPortfolio.spotPrice;
  }, 0);
};

export const computeCapitalGain = (portfolio: Portfolio, transation: Transaction) => {
  const totalValue = evaluatePortfolio(portfolio);
  const cashOut = transation.totalEurWithFees;
  return cashOut - (portfolio.cashIn * cashOut) / totalValue;
};
