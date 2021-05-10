import { DateTime } from 'luxon';

export enum TRANSACTION_TYPE {
  RECEIVE = 'Receive',
  BUY = 'Buy',
  SELL = 'Sell',
}

export interface Transaction {
  timestamp: DateTime;
  type: TRANSACTION_TYPE;
  asset: string;
  quantity: number;
  spotPrice: number;
  totalEur: number;
  totalEurWithFees: number;
  fees: number;
}
