import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { removeSymbolQuantity } from "../../store/symbolQuantitySlice";
import { removeTicker } from "../../store/tickerSlice";
import { Button } from "../../ui/Button/Button";
import { Input } from "../../ui/Input/Input";
import { Select } from "../../ui/Select/Select";

interface ChildProps {
    toggleAction: (quantity?: number, symbol?: SymbolInfo) => void;
}

interface SymbolInfo {
    symbol: string;
    quoteAsset: string;
    baseAsset: string;
}

interface ExchangeInfoResponse {
    symbols: SymbolInfo[];
}

export const FormAdd = ({ toggleAction }: ChildProps) => {
    const [quantity, setQuantity] = useState<number>(0);
    const [isReady, setIsReady] = useState<boolean>(false);
    const [dataAction, setDataAction] = useState<SymbolInfo[]>([]);
    const [targetAction, setTargetAction] = useState<SymbolInfo | null>(null);
    const tickers = useSelector((state: RootState) => state.tickers.tickers);
    const [tickerSymbol, setTickerSymbol] = useState<string[]>([])
    const [filterBase, setFilterBase] = useState<string>(""); 
    const [filterQuote, setFilterQuote] = useState<string>("");
    const dispatch = useDispatch() 

    useEffect(() => {

        axios.get<ExchangeInfoResponse>("https://api.binance.com/api/v3/exchangeInfo")
            .then((res) => {
                const mapSymbols = res.data.symbols.map((symbol) => ({
                    symbol: symbol.symbol,
                    baseAsset: symbol.baseAsset,
                    quoteAsset: symbol.quoteAsset,
                }));
                setDataAction(mapSymbols);
            })
            .catch((error) => {
                console.error("Ошибка при получении данных:", error);
            });
    }, []);

    useEffect(() => {
        if (targetAction && quantity) {
            setIsReady(true);
        }
    }, [targetAction, quantity]);

    useEffect(() => {
        const tickerData = Object.keys(tickers)
        setTickerSymbol(tickerData)
    }, [tickers])

    const handleSubmit = () => {
        if (targetAction) {
            toggleAction(quantity, targetAction);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if(value > 0 && !isNaN(value)) {
            setQuantity(value);
        }
    };

    const uniqueQuoteAssets = Array.from(new Set(dataAction.map((s) => s.quoteAsset)));

    const filteredData = dataAction.filter((symbol) =>
        symbol.baseAsset.toLowerCase().startsWith(filterBase.toLowerCase()) &&
        (filterQuote === "" || symbol.quoteAsset === filterQuote) && (!tickerSymbol.includes(symbol.symbol))
    );

    const filterTickerSubctibe = tickers[`${filterBase.toUpperCase()}${filterQuote}`] ? tickers[`${filterBase.toUpperCase()}${filterQuote}`] : null

    function deleteSubscriptionFilter (symbol: string) {
        dispatch(removeSymbolQuantity(symbol));
        dispatch(removeTicker(symbol));
    }


    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <Button className="close-button" onClick={() => toggleAction()}>X</Button>
                {targetAction ? (
                    <h1>Купить {quantity} {targetAction.baseAsset} за {targetAction.quoteAsset}</h1>
                ) : (
                    <h1>Валютные пары</h1>
                )}

                {targetAction && <button onClick={() => setTargetAction(null)}>Назад к списку</button>}

                {targetAction &&
                <Button className='add-subscribe' onClick={handleSubmit} disabled={!isReady}>Добавить подписку</Button>}
                <Input type="number" onChange={handleChange} placeholder="Введите сумму"/>

                {!targetAction && (
                    <Input
                        type="text"
                        placeholder="Введите название валюты"
                        value={filterBase}
                        onChange={(e) => setFilterBase(e.target.value)}
                    />
                )}
                {!targetAction && (
                    <Select 
                    value={filterQuote}
                    onChange={(e) => setFilterQuote}
                    options = {[
                        { value: "", label: "За эту валюту покупаем" },
                        ...uniqueQuoteAssets.map((asset) => ({ value: asset, label: asset }))
                        ]}
                    />
                )}
                {filterTickerSubctibe && 
                    <ul>
                        <li>
                            <Button className="add-subscribe danger" onClick={() =>deleteSubscriptionFilter(filterTickerSubctibe?.s)}>
                                Отписаться от {filterTickerSubctibe.quantity}  {filterTickerSubctibe.baseAsset}</Button>
                        </li>
                    </ul>}

                <ul>
                    {!targetAction && filteredData.map((symbol, index) => (
                        <li key={index}>
                            <Button onClick={() => setTargetAction({
                                symbol: symbol.symbol,
                                quoteAsset: symbol.quoteAsset,
                                baseAsset: symbol.baseAsset
                            })}>
                                Купить {symbol.baseAsset} за {symbol.quoteAsset}

                            </Button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

