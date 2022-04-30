import { Portfolio } from './portfolio';
import { Transaction } from './transaction';

const evaluatePortfolio = (portfolio: Portfolio): number => {
  return Object.keys(portfolio.assets).reduce((value, asset) => {
    const assetPortfolio = portfolio.assets[asset];
    return value + assetPortfolio.quantity * assetPortfolio.spotPrice;
  }, 0);
};

export const computeCapitalGain = (portfolio: Portfolio, transaction: Transaction) => {
  const totalValue = evaluatePortfolio(portfolio);
  const cashOut = transaction.totalEurWithFees;
  const equivalentBuyPrice = (portfolio.cashIn * cashOut) / totalValue;
  const capitalGain = cashOut - equivalentBuyPrice;
  const lines = [
    { key: 'Date de la transaction (ligne 211)', value: transaction.timestamp.toLocaleString() },
    { key: 'Valeur du portefeuille à date (ligne 212)', value: totalValue },
    { key: 'Montant de la cession (ligne 213 & 217)', value: transaction.totalEur },
    { key: 'Frais (ligne 214)', value: transaction.fees },
    {
      key: 'Montant de la cession net de frais (ligne 215 & 218)',
      value: transaction.totalEurWithFees,
    },
    { key: "Prix total d'acquisition (ligne 220)", value: portfolio.totalCashIn },
    {
      key: "Fraction de capital initial dans prix d'acquisition (ligne 221)",
      value: portfolio.totalCashIn - portfolio.cashIn,
    },
    { key: "Valeur d'achat du portefeuille à date (ligne 222)", value: portfolio.cashIn },
    { key: 'Plus value', value: capitalGain },
  ];
  console.log(
    `[${transaction.timestamp.toLocaleString()}] ${transaction.asset} transaction:\n\t${lines
      .map(({ key, value }) => `${key}: ${value}`)
      .join('\n\t')}`
  );
  return capitalGain;
};
