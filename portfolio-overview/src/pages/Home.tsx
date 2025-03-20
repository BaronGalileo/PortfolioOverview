import { useEffect, useState } from "react";
import { FormAdd } from "../components/FormAdd/FormAdd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { clearSymbolQuantity, updateSymbolQuantity } from "../store/symbolQuantitySlice";
import { TickerComponent } from "../components/TickerComponent/TickerComponent";
import axios from "axios";

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
  const [isAddAction, setIsAddAction] = useState<boolean>(false)
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("getPriceInUSD(BTC)",getPriceInUSD("ETH"))
    // const pathСonvert = "https://api.binance.com/api/v3/ticker/price"
    // axios.get(pathСonvert)

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
  }

  return (
    <div className="home-container">
    <div className="header">
      <h1 className="title">Portfolio Overview</h1>
      <button className="add-button" onClick={() => setIsAddAction((prev) => !prev)}>Добавить</button>
    </div>
    {Object.keys(symbolQuantity).length > 0 && 
      <button className="remove-button" onClick={deleteSubscription}>Удалить все подписки</button>}

    {isAddAction && <FormAdd toggleAction={addSymbolQuantity} />}

    <div className="ticker-grid">
      {Object.values(symbolQuantity).map((symbol) => (
        <TickerComponent
          key={symbol.symbol}
          symbol={symbol.symbol}
          quantity={symbol.quantity}
          quoteAsset={symbol.quoteAsset}
          baseAsset={symbol.baseAsset}
        />
      ))}
    </div>
  </div>
  );
};