import { Transaction } from 'src/portfolio/transaction';

export interface Exchange {
  parse: () => Transaction[];
  getSpotPrice: ({ asset: string, date: DateTime }) => Promise<number>;
}
