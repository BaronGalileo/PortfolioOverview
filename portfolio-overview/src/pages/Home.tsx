import { useEffect, useState } from "react";
import { FormAdd } from "../components/FormAdd/FormAdd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { clearSymbolQuantity, updateSymbolQuantity } from "../store/symbolQuantitySlice";
import { TickerComponent } from "../components/TickerComponent/TickerComponent";
import axios from "axios";
import { removeAllTicker } from "../store/tickerSlice";

interface SymbolAndQuantity {
  symbol: string;
  quantity: number;
  quoteAsset: string,
  baseAsset:string,
}

interface SymbolInfo {
  symbol:string,
  quoteAsset: string,
  baseAsset: string,
}

interface ExchangeInfoResponse {
  symbols: SymbolInfo[];
}

export const Home = () => {

  const symbolQuantity = useSelector((state: RootState) => state.symbolQuantity.symbolQuantity);
  const tickers = useSelector((state: RootState) => state.tickers.tickers);
  const [isAddAction, setIsAddAction] = useState<boolean>(false)
  const dispatch = useDispatch();
  const totalPortfolioValue = Math.round(
    Object.values(tickers).reduce((acc, ticker) => acc + (ticker.valueInUSD || 0), 0) * 100
  ) / 100;

  useEffect(() => {

  }, [])

  useEffect(() => {

  }, [symbolQuantity, isAddAction])

  const getPriceInUSD = async (symbol: string): Promise<number | null> => {
    const pathСonvert = `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`;
    
    try {
        const { data } = await axios.get(pathСonvert);
        return parseFloat(data.price);
    } catch (error) {
        console.warn(`Не удалось получить цену для ${symbol}:`, error);
        return null;
    }
};




  function addSymbolQuantity(quantity: number = 0, symbolInfo?: SymbolInfo) {
    if (quantity > 0 && symbolInfo) {

      const symbolQuantity: SymbolAndQuantity = {
        symbol: symbolInfo.symbol,
        quantity: quantity,
        quoteAsset: symbolInfo.quoteAsset,
        baseAsset:symbolInfo.baseAsset,
      }

      dispatch(updateSymbolQuantity(symbolQuantity))

    }
    setIsAddAction((prev) => !prev);
  }

  const deleteSubscription = () => {
    dispatch(clearSymbolQuantity())
    dispatch(removeAllTicker())
  }



  return (
    <div className="home-container">
    <div className="header">
      <h1 className="title">Portfolio Overview</h1>
      <button className="add-button" onClick={() => setIsAddAction((prev) => !prev)}>Добавить</button>
    </div>
    {Object.keys(symbolQuantity).length > 0 && 
      <button className="remove-button" onClick={deleteSubscription}>Удалить все подписки</button>}
      <div className="total-value">Общая сумма: {totalPortfolioValue} $</div>

    {isAddAction && <FormAdd toggleAction={addSymbolQuantity} />}

    <div className="ticker-grid">
      {Object.values(symbolQuantity).map((symbol, ind) => {
        return (
          <TickerComponent
            key={symbol.symbol}
            symbol={symbol.symbol}
            quantity={symbol.quantity}
            baseAsset={symbol.baseAsset}
            quoteAsset={symbol.quoteAsset}
            totalPortfolioValue={totalPortfolioValue}
          />
        );
      })}
    </div>
  </div>
  );
};