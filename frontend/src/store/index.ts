import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import transactionReducer from './transactionSlice';

export const store = configureStore({
    reducer: { transactions: transactionReducer },
});

export type RootState    = ReturnType<typeof store.getState>;
export type AppDispatch  = typeof store.dispatch;
export const useAppDispatch  = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();