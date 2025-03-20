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
    setTicker: (state, action: PayloadAction<Ticker>) => {
      state.tickers[action.payload.s] = action.payload;
    },
    removeTicker: (state, action: PayloadAction<string>) => {
      delete state.tickers[action.payload];
    },
    setTickers: (state, action: PayloadAction<{ [key: string]: Ticker }>) => {
      state.tickers = action.payload;
    },
  },
});

export const { setTicker, removeTicker, setTickers } = tickersSlice.actions;

export default tickersSlice.reducer;
