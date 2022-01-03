import { configureStore } from "@reduxjs/toolkit";
import FilesReducer from "./slice.files";

const Store = configureStore({
	reducer: {
		files: FilesReducer
	}
});

export type StoreState = ReturnType<typeof Store.getState>;
export type StoreDispatch = typeof Store.dispatch;
export default Store;