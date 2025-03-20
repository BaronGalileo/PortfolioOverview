import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useWebSocket from "react-use-websocket";
import axios from "axios";
import { removeSymbolQuantity } from "../../store/symbolQuantitySlice";
import { RootState } from "../../store";
import { removeTicker, setTicker } from "../../store/tickerSlice";

type TickerProps = {
  symbol: string;
  quantity: number;
  baseAsset: string;
  quoteAsset: string;
};

export const TickerComponent = ({ symbol, quantity, baseAsset, quoteAsset }: TickerProps) => {
  const dispatch = useDispatch();
  const tickers = useSelector((state: RootState) => state.tickers.tickers);

  const socketUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`;

  useWebSocket(socketUrl, {
    shouldReconnect: () => true,
    onMessage: (message) => {
      const data = JSON.parse(message.data);
      
      // Проверяем, изменились ли данные перед диспетчингом
      if (tickers[data.s] && tickers[data.s].currentPrice === parseFloat(data.c)) return;
      
      dispatch(
        setTicker({
          s: data.s,
          baseAsset,
          quantity,
          currentPrice: parseFloat(data.c),
          totalValue: parseFloat(data.c) * quantity,
          priceChangePercent: parseFloat(data.P),
          valueInUSD: tickers[data.s]?.valueInUSD || null, // Сохраняем старое значение
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
    // Проверяем, есть ли уже тикер в store перед выполнением запроса
    if (tickers[symbol]) return;

    const fetchInitialPrice = async () => {
      try {
        const { data } = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol.toUpperCase()}`);
        const usdPrice = await getPriceInUSD(baseAsset);

        dispatch(
          setTicker({
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
  }, [symbol, baseAsset, quantity, dispatch, tickers]);

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

  const totalPortfolioValue = Object.values(tickers).reduce((acc, ticker) => acc + (ticker.valueInUSD || 0), 0);

  return (
    <div className="ticker-container">
      {Object.values(tickers).map((ws) => (
        <div className="ticker-card" key={ws.s}>
          <h2>Данные для {ws.baseAsset} {actinSymbol} в {currency}</h2>
          <p>Количество: {ws.quantity}</p>
          <p>Текущая цена: {ws.currentPrice} {currency}</p>
          <p>Общая стоимость: {ws.totalValue} {currency}</p>
          <p>Стоимость в USD: {ws.valueInUSD ? `$${ws.valueInUSD.toFixed(2)}` : "—"}</p>
          <p>Процент изменения за 24 часа: {ws.priceChangePercent}%</p>
          {totalPortfolioValue > 0 && ws.valueInUSD !== null && (
            <p>Доля в портфеле: {((ws.valueInUSD / totalPortfolioValue) * 100).toFixed(2)}%</p>
          )}
          <button className="remove-button" onClick={() => disconnectWebSocket(ws.s)}>
            Убрать {ws.baseAsset}
          </button>
        </div>
      ))}

      {totalPortfolioValue > 0 && (
        <div className="portfolio-summary">
          <h3>Общая стоимость портфеля: ${totalPortfolioValue.toFixed(2)}</h3>
        </div>
      )}
    </div>
  );
};


