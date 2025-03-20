import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTicker, removeData, removeTicker } from "../store/tickerSlice";
import { 
  addWebSocketConnection, 
  handleRemoveWebSocketConnection, 
  removeAllWebSocketConnections, 
  removeWebSocketConnection 
} from "../store/webSocketSlice";
import { persistor, RootState } from "../store";
import { useAppDispatch } from "./useAppDispatch";
import axios from "axios";

export const useBinanceTicker = (symbols: string[], quantity: number = 1.0) => {
  const dispatch = useDispatch();
  const dispatchAsync = useAppDispatch();
  const wsConnections = useSelector((state: RootState) => state.websocket); // WebSocket URL из Redux
  const [isRender, setIsRender] = useState<boolean>(false)

  useEffect(() => {
    console.log("symbolssymbols", symbols)
      symbols.map(symbol => {
        if(!wsConnections[symbol]){
        dispatch(addWebSocketConnection({
          s: symbol,
          url: `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`,
          readyState: 1,
        }));
      }
    })
  }, [symbols])



  const wsInstances = useMemo(() => {

    const instances: { [key: string]: WebSocket } = {};

    Object.keys(wsConnections)
    .forEach((symbol) => {
      const connection = wsConnections[symbol];
      if (connection && connection.url && connection.readyState === 1) {
        console.log(`✅ Создаю WebSocket для ${symbol}`);
        const ws = new WebSocket(connection.url);

        ws.onopen = async () => {
          console.log(`🟢 WebSocket открыт для ${symbol}`);
          try {
            const res = await axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol.toUpperCase()}`);
            console.log("📊 Данные получены сразу после открытия WS:", res.data);
        
            dispatch(updateTicker({
              s: res.data.s,
              quantity,
              currentPrice: parseFloat(res.data.c),
              totalValue: parseFloat(res.data.c) * quantity,
              priceChange: parseFloat(res.data.p),
              priceChangePercent: parseFloat(res.data.P),
              baseAsset: symbol.replace("USDT", ""),
            }));
          } catch (error) {
            console.error("Ошибка при получении данных через REST API:", error);
          }
        };

        ws.onmessage = (event) => {
          const response = JSON.parse(event.data);
          if (response.s) {
            const currentPrice = parseFloat(response.c);
            const priceChange = parseFloat(response.p);
            const priceChangePercent = parseFloat(response.P);
            const totalValue = currentPrice * quantity;
            const baseAsset = "BTCUSDT".replace("USDT", "");

            dispatch(updateTicker({
              s: response.s,
              quantity,
              currentPrice,
              totalValue,
              priceChange,
              priceChangePercent,
              baseAsset,
            }));
          }
        };

        ws.onerror = (error) => console.error(`Ошибка WebSocket для ${symbol}:`, error);

        ws.onclose = () => {
          console.log(`❌ WebSocket закрыт для ${symbol}`);
          dispatchAsync(handleRemoveWebSocketConnection(symbol))
        };

        instances[symbol] = ws;
      }
    });
    return instances;
  }, [wsConnections, quantity, isRender]);

  const disconnectWebSocket = (symbol?: string) => {
    debugger
    if (symbol) {
      dispatchAsync(handleRemoveWebSocketConnection(symbol))
      persistor.purge();
      console.log(`❌ WebSocket отключен для ${symbol}`);
    } else {
      Object.keys(wsInstances).forEach((key) => {
        wsInstances[key]?.close(); // Закрываем все соединения
        dispatch(removeWebSocketConnection(key)); // Удаляем из Redux
      });
      dispatch(removeData());
      dispatch(removeAllWebSocketConnections());
      persistor.purge();
      console.log("❌ Все WebSocket соединения отключены");
    }
  };

  return { disconnectWebSocket };
};

