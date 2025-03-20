import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Ticker = {
  s: string;
  baseAsset: string;
  quantity: number;
  currentPrice: number;
  totalValue: number;
  priceChangePercent: number;
  valueInUSD: number | null;
};

interface TickersState {
  tickers: { [key: string]: Ticker };
}

const initialState: TickersState = {
  tickers: {},
};

export const tickersSlice = createSlice({
  name: "tickers",
  initialState,
  reducers: {
    updateTicker: (state, action: PayloadAction<Ticker>) => {
      state.tickers[action.payload.s] = action.payload;
    },
    removeTicker: (state, action: PayloadAction<string>) => {
      delete state.tickers[action.payload];
    },
    removeAllTicker: (state) => {
      state.tickers = {};
    },
  },
});

export const { updateTicker, removeTicker, removeAllTicker } = tickersSlice.actions;

export default tickersSlice.reducer;
