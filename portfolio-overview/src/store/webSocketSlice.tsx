// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface WebSocketState {
//   [symbol: string]: WebSocket | null; 
// }

// const initialState: WebSocketState = {};

// const webSocketSlice = createSlice({
//   name: 'websocket',
//   initialState,
//   reducers: {
//     addWebSocketConnection: (state, action: PayloadAction<{ symbol: string, ws: WebSocket }>) => {
//       state[action.payload.symbol] = action.payload.ws;
//     },
//     removeWebSocketConnection: (state, action: PayloadAction<string>) => {
//       delete state[action.payload];
//     },
//     removeAllWebSocketConnections: (state) => {
//       return {};
//     }
//   }
// });

// export const { addWebSocketConnection, removeWebSocketConnection, removeAllWebSocketConnections } = webSocketSlice.actions;

// export default webSocketSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { removeTicker, removeData } from './tickerSlice';
import { AppDispatch } from '../store';

interface WebSocketState {
  [symbol: string]: WebSocketData | null; // Сохраняем URL и состояние WebSocket

}

interface WebSocketData {
    s: string;
    url: string;
    readyState: number;
}

const initialState: WebSocketState = {};



const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    addWebSocketConnection: (state, action: PayloadAction<WebSocketData>) => {
        state[action.payload.s] = action.payload;
    },
    removeWebSocketConnection: (state, action: PayloadAction<string>) => {
      const symbol = action.payload;
      delete state[action.payload];
    },
    removeAllWebSocketConnections: (state) => {
      return {};
    }
  }
});

export const handleRemoveWebSocketConnection = (symbol: string) => {
  return (dispatch: AppDispatch) => {
    dispatch(removeWebSocketConnection(symbol));  
    dispatch(removeTicker(symbol));                                     
  };
};

export const { addWebSocketConnection, removeWebSocketConnection, removeAllWebSocketConnections } = websocketSlice.actions;

export default websocketSlice.reducer;