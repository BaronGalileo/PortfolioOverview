import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { 
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
 } from 'redux-persist'
import storage from 'redux-persist/lib/storage';
import tickerReducer from './tickerSlice';
import webSocketReducer from './webSocketSlice';
import symbolQuantityReducer from './symbolQuantitySlice';






const rootReducer = combineReducers({
  ticker: tickerReducer,
  websocket: webSocketReducer,
  symbolQuantity: symbolQuantityReducer,

})

const persistConfig = {
  key: 'root',
  storage,
 }

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;
