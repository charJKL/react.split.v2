import { configureStore } from "@reduxjs/toolkit";
import ProjectsSlice from "./slice.projects";
import PagesSlice from "./slice.pages";
import MetricSlice from "./slice.metrics";
import OcrSlice from "./slice.ocrs";
import GuiSlice from "./slice.gui";
import LocalStorage from "./middleware/LocalStorage";

const storeSettings =
{
	"projects/": { key: "projects", slices: ["projects"]},
	"": { key: null, slices: ["pages", "metrics", "ocrs", "gui"]}
}
const LocalStorageMiddleware = LocalStorage("epub.split", storeSettings);
const Store = configureStore({
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(LocalStorageMiddleware),
	reducer:{
		projects: ProjectsSlice.reducer,
		pages: PagesSlice.reducer,
		metrics: MetricSlice.reducer,
		ocrs: OcrSlice.reducer,
		gui: GuiSlice.reducer
	}
});

export type GetStoreState = typeof Store.getState;
export type StoreState = ReturnType<typeof Store.getState>;
export type StoreDispatch = typeof Store.dispatch;
export type ThunkStoreTypes = {dispatch: StoreDispatch, state: StoreState };
export default Store;