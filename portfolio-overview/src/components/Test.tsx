import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import useWebSocket from "react-use-websocket";
import { removeSymbolQuantity } from "../store/symbolQuantitySlice";
import axios from "axios";

type Ticker = {
  s: string;
  baseAsset: string;
  quantity: number;
  currentPrice: number;
  totalValue: number;
  priceChangePercent: number;
};

type TickerProps = {
  symbol: string;
  quantity:number;
  baseAsset:string,
  quoteAsset: string,
};



export const TickerComponent= ({symbol,quantity, baseAsset, quoteAsset}: TickerProps ) => {
  const [tickers, setTickers] = useState<{ [key: string]: Ticker }>({});
  const dispatch = useDispatch()
  const socketUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`;

  const { lastJsonMessage, getWebSocket } = useWebSocket(socketUrl, {
    shouldReconnect: () => true,

    onMessage: (message) => {
      console.log("J<<<", symbol)
      const data = JSON.parse(message.data);
      const newTicker: Ticker = {
        s: data.s,
        baseAsset: data.s,
        quantity: quantity,
        currentPrice: parseFloat(data.c),
        totalValue: parseFloat(data.c) * quantity,
        priceChangePercent: parseFloat(data.P),
      };
      setTickers((prev) => ({
        ...prev,
        [data.s]: newTicker,
      }));
    },
  });

  const disconnectWebSocket = (symbol: string) => {
    const socket = getWebSocket();
    dispatch(removeSymbolQuantity(symbol))
    if (socket) {
      socket.close();
      setTickers((prev) => {
        const newTickers = { ...prev };
        delete newTickers[symbol];
        return newTickers;
      });
    }
  };

  const currencySymbols: { [key: string]: string } = {
    BTC: "₿",
    ETH: "Ξ",
    USDT: "$",
    BNB: "⚡",
    EUR: "€",
    RUB: "₽",
  };
  
  const getCurrencySymbol = (symbol: string) => currencySymbols[symbol] || "";

  const actinSymbol = getCurrencySymbol(baseAsset)
  const currency = getCurrencySymbol(quoteAsset)
  useEffect(() => {
    const path = `https://api.binance.com/api/v3/ticker/price?symbol=${symbol.toUpperCase()}`
    axios.get(path).then(res => {
      setTickers((prev) => ({
        ...prev,
        [symbol]: {
          s: symbol,
          baseAsset: baseAsset,
          quantity: quantity,
          currentPrice: parseFloat(res.data.price),
          totalValue: parseFloat(res.data.price) * quantity,
          priceChangePercent: 0, 
        },
      }))}
    ).catch (error => {
      console.error("Error fetching initial data:", error);
    })
  }, [])

  return (
    <div>
      {Object.values(tickers).map((ws) => (
        <div key={ws.s}>
          <h2>Данные для {ws.baseAsset} {actinSymbol} за {currency}</h2>
          <p>Количество: {ws.quantity}</p>
          <p>Текущая цена: {ws.currentPrice} {currency}</p>
          <p>Общая стоимость: {ws.totalValue} {currency}</p>
          <p>Процент изменения за 24 часа: {ws.priceChangePercent}%</p>
          <button onClick={() => disconnectWebSocket(ws.s)}>Убрать {ws.baseAsset} {actinSymbol}</button>
        </div>
      ))}
    </div>
  );
};
