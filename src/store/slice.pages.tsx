import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { StoreState, ThunkStoreTypes } from "./store";

type PageStatus = "Idle" | "Loading" | "Loaded" | "Error";
type Key = string;

type Page = 
{
	id: Key,
	status: PageStatus,
	url: string,
	name: string,
	width?: number,
	height?: number,
}
type PageLoaded = Required<Page> & {status: "Loaded"};


type InitialStatePages =
{
	ids: Array<string>,
	entities: { [key: string]: Page },
	selected: string | null;
}

const InitialState : InitialStatePages = 
{
	ids: [],
	entities: {},
	selected: null,
}



const Pages = createSlice({
	name: "pages",
	initialState: InitialState,
	reducers: 
	{
		addPage: (state, action: PayloadAction<Page>) =>
		{
			const id = action.payload.id;
			state.ids.push(id);
			state.entities[id] = action.payload;
		},
		upsertPage: (state, action: PayloadAction<Partial<Page> & {id: string}>) =>
		{
			const id = action.payload.id;
			state.entities[id] = { ...state.entities[id], ...action.payload };
		},
		selectPage: (state, action: PayloadAction<string>) => 
		{
			const id = action.payload;
			if(state.ids.includes(id)) state.selected = action.payload;
		}
	}
});

const isPageLoaded = (page: Page | PageLoaded) : page is PageLoaded =>
{
	return page.status === "Loaded";
}

const loadPage = createAsyncThunk<void, string, ThunkStoreTypes>('pages/loadPage', (id, thunk) => {
	const state = thunk.getState();
	const dispatch = thunk.dispatch;
	const page = state.pages.entities[id];
	const upsertPage = Pages.actions.upsertPage;

	const image = new Image();
	dispatch(upsertPage({id: id, status: "Loading"}));
	image.addEventListener('load', (e: Event) => {
		const image = e.target as HTMLImageElement;
		const width = image.naturalWidth;
		const height = image.naturalHeight;
		dispatch(upsertPage({id: id, status: "Loaded", width: width, height: height}));
	});
	image.addEventListener('error', (e: Event) => {
		
		dispatch(upsertPage({id: id, status: "Error"}));
	});
	image.src = page.url;
});

export const selectPageIds = (state: StoreState) => state.pages.ids;
export const selectPageById = (id: string) => (state: StoreState) => state.pages.entities[id];
export const selectSelectedPage = (state: StoreState) => state.pages.selected ? state.pages.entities[state.pages.selected] : null;

export const { addPage, selectPage } = Pages.actions;
export { isPageLoaded, loadPage };

export type { Page, PageLoaded };
export default Pages;
