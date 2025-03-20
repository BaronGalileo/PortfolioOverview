import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SymbolAndQuantity {
  symbol: string;
  quantity: number;
  quoteAsset: string;
  baseAsset: string;
}

interface SymbolQuantityState {
  symbolQuantity: Record<string, SymbolAndQuantity>;  
}

const initialState: SymbolQuantityState = {
  symbolQuantity: {},
};

const symbolQuantitySlice = createSlice({
  name: "symbolQuantity",
  initialState,
  reducers: {
    updateSymbolQuantity: (state, action: PayloadAction<SymbolAndQuantity>) => {
      const { symbol } = action.payload;
      state.symbolQuantity[symbol] = action.payload; 
    },
    removeSymbolQuantity: (state, action: PayloadAction<string>) => {
      delete state.symbolQuantity[action.payload]; 
    },
    clearSymbolQuantity: (state) => {
      state.symbolQuantity = {}; 
    },
  },
});

export const { updateSymbolQuantity, removeSymbolQuantity, clearSymbolQuantity } = symbolQuantitySlice.actions;
export default symbolQuantitySlice.reducer;