import { createStore, combineReducers, configureStore, Middleware } from "@reduxjs/toolkit";
import PagesSlice from "./slice.pages";


const Store = configureStore({
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ['pages/setFiles']
			}
		})
	},
	reducer: {
		pages: PagesSlice.reducer
	}
});


export type StoreState = ReturnType<typeof Store.getState>;
export type StoreDispatch = typeof Store.dispatch;
export default Store;