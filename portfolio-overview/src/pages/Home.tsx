import { useEffect, useState } from "react";
import { FormAdd } from "../components/FormAdd/FormAdd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { TickerComponent } from "../components/Test";
import { clearSymbolQuantity, updateSymbolQuantity } from "../store/symbolQuantitySlice";

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
  const wsSockeds = useSelector((state: RootState) => state.websocket)
  const dispatch = useDispatch();

  useEffect(() => {
  }, [symbolQuantity, isAddAction])


  function show () {
    console.log("wsSockeds: ",wsSockeds)
    console.log("symbolQuantity: ", symbolQuantity);
  }



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
    <div>
      <button onClick={() => deleteSubscription()}>Удалить все подписки</button>
      <button onClick={show}>Показать подписки</button>
      <button onClick={() => setIsAddAction(rev => !rev)}>ЖМЫХ</button>
      {isAddAction &&
      <FormAdd toggleAction={addSymbolQuantity}/>}
      {Object.values(symbolQuantity).map((symbol) => (
        <div key={symbol.symbol}>
          <TickerComponent symbol={symbol.symbol} quantity={symbol.quantity} quoteAsset={symbol.quoteAsset} baseAsset={symbol.baseAsset}/>
        </div>
      )

      )}
    </div>
  );
};