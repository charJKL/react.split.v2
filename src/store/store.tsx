import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import PagesReducer from "./slice.pages";


const Store = configureStore({
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ['pages/setFiles']
			}
		})
	},
	reducer: {
		pages: PagesReducer
	}
});

export type StoreState = ReturnType<typeof Store.getState>;
export type StoreDispatch = typeof Store.dispatch;
export default Store;