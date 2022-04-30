// Each key of the object is an asset
export type Portfolio = {
  assets: Record<string, { quantity: number; spotPrice: number } | undefined>;
  totalCashIn: number;
  cashIn: number;
};
