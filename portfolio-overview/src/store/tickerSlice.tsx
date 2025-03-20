import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TickerData {
  s: string;
  quantity: number;
  currentPrice: number;
  totalValue: number;
  priceChange: number;
  priceChangePercent: number;
  baseAsset: string;
}

interface TickerState {
  data: Record<string, TickerData>; 
}

const initialState: TickerState = {
  data: {}
};

const tickerSlice = createSlice({
  name: "ticker",
  initialState,
  reducers: {
    updateTicker: (state, action: PayloadAction<TickerData>) => {
      const symbol = action.payload.s;
      state.data = { ...state.data, [symbol]: action.payload }; 
    },
    removeTicker: (state, action: PayloadAction<string>) => {
      delete state.data[action.payload];
    },
    removeData: (state) => {
      state.data = {};  
    },
  },
});

export const { updateTicker, removeTicker, removeData } = tickerSlice.actions;
export default tickerSlice.reducer;


