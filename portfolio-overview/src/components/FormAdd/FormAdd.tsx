import { useEffect, useState } from "react";
import axios from "axios";

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

    const [filterBase, setFilterBase] = useState<string>(""); 
    const [filterQuote, setFilterQuote] = useState<string>(""); 

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
        symbol.baseAsset.toLowerCase().includes(filterBase.toLowerCase()) &&
        (filterQuote === "" || symbol.quoteAsset === filterQuote)
    );

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={() => toggleAction()}>X</button>

                {targetAction ? (
                    <h1>Купить {quantity} {targetAction.baseAsset} за {targetAction.quoteAsset}</h1>
                ) : (
                    <h1>Валютные пары</h1>
                )}

                {targetAction && <button onClick={() => setTargetAction(null)}>Назад к списку</button>}

                {targetAction &&
                <button onClick={handleSubmit} disabled={!isReady}>Добавить подписку</button>}
                <input type="number" onChange={handleChange} placeholder="Введите сумму" />

                {!targetAction && (
                    <input
                        type="text"
                        placeholder="Введите название валюты"
                        value={filterBase}
                        onChange={(e) => setFilterBase(e.target.value)}
                    />
                )}

                {!targetAction && (
                    <select value={filterQuote} onChange={(e) => setFilterQuote(e.target.value)}>
                        <option value="">За эту валюту покупаем </option>
                        {uniqueQuoteAssets.map((asset) => (
                            <option key={asset} value={asset}>{asset}</option>
                        ))}
                    </select>
                )}

                <ul>
                    {!targetAction && filteredData.map((symbol, index) => (
                        <li key={index}>
                            <button onClick={() => setTargetAction({
                                symbol: symbol.symbol,
                                quoteAsset: symbol.quoteAsset,
                                baseAsset: symbol.baseAsset
                            })}>
                                Купить {symbol.baseAsset} за {symbol.quoteAsset}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

