import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SymbolAndQuantity {
  symbol: string;
  quantity: number;
  quoteAsset: string;
  baseAsset: string;
}

interface SymbolQuantityState {
  symbolQuantity: Record<string, SymbolAndQuantity>;  // Вместо массива используем объект
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
      state.symbolQuantity[symbol] = action.payload; // Ключ - это symbol, а значение - объект
    },
    removeSymbolQuantity: (state, action: PayloadAction<string>) => {
      delete state.symbolQuantity[action.payload]; // Удаляем по ключу
    },
    clearSymbolQuantity: (state) => {
      state.symbolQuantity = {}; // Очищаем объект
    },
  },
});

export const { updateSymbolQuantity, removeSymbolQuantity, clearSymbolQuantity } = symbolQuantitySlice.actions;
export default symbolQuantitySlice.reducer;