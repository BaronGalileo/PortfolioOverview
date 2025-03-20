import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useWebSocket from "react-use-websocket";
import axios from "axios";
import { removeSymbolQuantity } from "../../store/symbolQuantitySlice";
import { RootState } from "../../store";
import { removeTicker, updateTicker } from "../../store/tickerSlice";

type TickerProps = {
  symbol: string;
  quantity: number;
  baseAsset: string;
  quoteAsset: string;
};

export const TickerComponent = ({ symbol, quantity, baseAsset, quoteAsset }: TickerProps) => {
  const dispatch = useDispatch();
  const tickers = useSelector((state: RootState) => state.tickers.tickers);
  const [portfolioShare, setPortfolioShare] = useState<number>(0);
  const [priceInUSD, setPriceInUsd] = useState<number>(0)

  const socketUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`;

  useWebSocket(socketUrl, {
    shouldReconnect: () => true,
    onMessage: (message) => {
      const data = JSON.parse(message.data);
    
      if (tickers[data.s] && tickers[data.s].currentPrice === parseFloat(data.c)) return;
      
      dispatch(
        updateTicker({
          s: data.s,
          baseAsset,
          quantity,
          currentPrice: parseFloat(data.c),
          totalValue: parseFloat(data.c) * quantity,
          priceChangePercent: parseFloat(data.P),
          valueInUSD: tickers[symbol]?.valueInUSD || null,
        })
      );
    },
  });

  const getPriceInUSD = async (symbol: string): Promise<number | null> => {
    try {
      const { data } = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`);
      return parseFloat(data.price);
    } catch (error) {
      console.warn(`Не удалось получить цену для ${symbol}:`, error);
      return null;
    }
  };

  useEffect(() => {
    if (tickers[symbol]) return;

    const fetchInitialPrice = async () => {
      try {
        const { data } = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol.toUpperCase()}`);
        const usdPrice = await getPriceInUSD(baseAsset);

        dispatch(
            updateTicker({
                s: symbol,
                baseAsset,
                quantity,
                currentPrice: parseFloat(data.price),
                totalValue: parseFloat(data.price) * quantity,
                priceChangePercent: 0,
                valueInUSD: usdPrice ? usdPrice * quantity : null,
            })
        );
      } catch (error) {
        console.error("Ошибка при получении начальных данных:", error);
      }
    };

    fetchInitialPrice();
  }, []);

  const totalPortfolioValue = Object.values(tickers).reduce((acc, ticker) => acc + (ticker.valueInUSD || 0), 0);

  useEffect(() => {
    const ticker = tickers[symbol];
    if (ticker?.valueInUSD !== null && typeof ticker?.valueInUSD === "number" && totalPortfolioValue > 0) {
      setPortfolioShare(Number(((ticker.valueInUSD / totalPortfolioValue) * 100).toFixed(2)));
    }
    if(ticker?.valueInUSD !== null) {
      setPriceInUsd(ticker?.valueInUSD)
    }
  }, [tickers, symbol, totalPortfolioValue]);

  const disconnectWebSocket = (symbol: string) => {
    dispatch(removeSymbolQuantity(symbol));
    dispatch(removeTicker(symbol));
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


  return (
    <div className="ticker-container">
        {tickers[symbol]?.s &&
        <div className="ticker-card" key={tickers[symbol].s}>
            <h2>Данные для {tickers[symbol].baseAsset} {actinSymbol} в {currency}</h2>
            <p>Количество: {tickers[symbol].quantity}</p>
            <p>Текущая цена: {tickers[symbol].currentPrice} {currency}</p>
            <p>Общая стоимость: {tickers[symbol].totalValue} {currency}</p>
            {priceInUSD && <p>Стоимость в USD: {priceInUSD} $</p>}
            <p>Процент изменения за 24 часа: {tickers[symbol].priceChangePercent}%</p>
            {portfolioShare&&
            <p>Доля в портфеле: {portfolioShare}%</p>}
            <button className="remove-button" onClick={() => disconnectWebSocket(tickers[symbol].s)}>
            Убрать {tickers[symbol].baseAsset}
            </button>
        </div>}
    </div>
  );
};


