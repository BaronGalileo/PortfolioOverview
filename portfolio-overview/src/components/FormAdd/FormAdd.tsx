import { useEffect, useState } from "react";
import axios from "axios";

interface ChildProps {
    toggleAction: (quantity?: number, symbol?: SymbolInfo) => void;
}

interface SymbolInfo {
    symbol:string,
    quoteAsset: string,
    baseAsset: string,
}

interface ExchangeInfoResponse {
    symbols: SymbolInfo[];
}


export const FormAdd = ({ toggleAction }: ChildProps) => {

    const[quantity, setQuantity] = useState<number>(0)
    const[isReady, setIsReady] = useState<boolean>(false)
    const[dataAction, setDataAction] = useState<SymbolInfo[]>([])
    const[targetAction, setTargetAction] = useState<SymbolInfo | null>(null)

    useEffect(() => {
        axios.get<ExchangeInfoResponse>("https://api.binance.com/api/v3/exchangeInfo")
            .then((res) => {
            const mapSymbols = res.data.symbols
            .map((symbol) => (
                {
                  symbol:symbol.symbol,
                  baseAsset: symbol.baseAsset,
                  quoteAsset: symbol.quoteAsset,
                }));
                setDataAction(mapSymbols)            
        })
        .catch((error) => {
            console.error("Ошибка при получении данных:", error);
        });

    },[])

    useEffect(() => {
        if(targetAction && quantity) {
            setIsReady(true)
        }

    }, [targetAction, quantity])

    const handleSubmit = () => {
        if (targetAction) {
          toggleAction(quantity, targetAction); 
        }
      };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value); 
        setQuantity(value)
      };

    return(
        <div className="modal-overlay">
           <div className="modal-content"> 
           <button onClick={() => toggleAction()}>X</button>
            <input
                type="number"
                onChange={handleChange}
                placeholder="Введите сумму"
            />

            {targetAction ? <h1>Купить {targetAction.baseAsset} за {targetAction.quoteAsset}</h1>:<h1>Валютные пары</h1>}
            {targetAction &&
            <button onClick={() => setTargetAction(null)}>Назад к списку</button>}
            <button onClick={handleSubmit}  disabled={!isReady}>Добавить подписку</button>
            <ul>
            {!targetAction && dataAction.
                map((symbol, index) => (
                    <li key={index}>
                    <button onClick={() => (
                        setTargetAction({symbol:symbol.symbol,quoteAsset:symbol.quoteAsset ,baseAsset: symbol.baseAsset})
                        )}>
                        Купить {symbol.baseAsset} за {symbol.quoteAsset}
                    </button>
                    </li>
                ))}
            </ul>
            </div>
        </div>
    )
}





























// import { useState } from "react";
// import { useHome } from "../../hooks/useHome"

// interface ChildProps {
//     toggleAction: () => void;
//   }

// export const FormAdd = ({ toggleAction }: ChildProps) => {



//     const {
//         dollarSymbols,
//         selectedSymbols,
//         toggleSubscription,
//         quantityAction,

//     } = useHome()

//     const [isAddAction, setIsAddAction] = useState<boolean>(false)

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = parseFloat(e.target.value); 
//         if (!isNaN(value)) {
//           quantityAction(value); 
//         }
//       };



//     return (
//         <div className="modal-overlay">
//             <div className="modal-content"> 
//                 <button onClick={() => toggleAction()}>X</button>
//             <input
//                 type="number"
//                 onChange={handleChange}
//                 placeholder="Enter quantity"
//             />
//             <h1>Валютные пары с долларом</h1>
//             <ul>
//             {dollarSymbols.
//                 filter((symbol) => !selectedSymbols.includes(symbol.symbol)).
//                 map((symbol, index) => (
//                     <li key={index}>
//                     <button onClick={() => (
//                         toggleSubscription(symbol.symbol)
//                         )}>
//                         Подписаться {symbol.baseAsset}
//                     </button>
//                     </li>
//                 ))}
//             </ul>
//             </div>
//         </div>
//     )
// }