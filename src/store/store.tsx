import { createStore, combineReducers, configureStore, Middleware } from "@reduxjs/toolkit";
import PagesSlice from "./slice.pages";
import MetricSlice from "./slice.metrics";
import OcrSlice from "./slice.ocrs";

const Store = configureStore({
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ['pages/setFiles']
			}
		})
	},
	reducer: {
		pages: PagesSlice.reducer,
		metrics: MetricSlice.reducer,
		ocrs: OcrSlice.reducer,
	}
});


export type StoreState = ReturnType<typeof Store.getState>;
export type StoreDispatch = typeof Store.dispatch;
export type ThunkStoreTypes = {dispatch: StoreDispatch, state: StoreState };
export default Store;