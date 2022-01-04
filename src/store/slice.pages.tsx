import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { StoreState, StoreDispatch } from "./store";

type PageStatus = "Idle" | "Loading" | "Loaded" | "Error";

type Page = 
{
	id: string,
	status: PageStatus,
	url: string,
	name: string,
	width?: number,
	height?: number,
}

type InitialStatePages =
{
	ids: Array<string>,
	entities: { [key: string]: Page },
}

const InitialState : InitialStatePages = 
{
	ids: [],
	entities: {}
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
		}
	}
});

type ThunkStoreTypes = {dispatch: StoreDispatch, state: StoreState };
const loadFile = createAsyncThunk<void, Array<File>, ThunkStoreTypes>('pages/loadFile', (files: Array<File>, thunk) => {
	const state = thunk.getState();
	const dispatch = thunk.dispatch;
	
	let counter = state.pages.ids.length;
	files.forEach((file) => {
		const id = (counter++).toString();
		const evenOdd = (counter % 2) ? 'eve' : 'odd';
		const name = `page-${evenOdd}-${id}`;
		const url = URL.createObjectURL(file);
		const page : Page = {id: id, status: "Idle", url: url, name: name};
		dispatch(Pages.actions.addPage(page));
	});
});

const loadPage = createAsyncThunk<void, string, ThunkStoreTypes>('pages/loadPage', (id, thunk) => {
	const state = thunk.getState();
	const dispatch = thunk.dispatch;
	const page = state.pages.entities[id];
	const upsertPage = Pages.actions.upsertPage;

	const image = new Image();
	dispatch(upsertPage({id: id, status: "Loading"}));
	image.addEventListener('load', (e) => {
		const image = e.target as HTMLImageElement;
		const width = image.naturalWidth;
		const height = image.naturalHeight;
		dispatch(upsertPage({id: id, status: "Loaded", width: width, height: height}));
	});
	image.addEventListener('error', (e) => {
		
		dispatch(upsertPage({id: id, status: "Error"}));
	});
	image.src = page.url;
});

export const selectPageIds = (state: StoreState) => state.pages.ids;
export const selectPageById = (id: string) => (state: StoreState) => state.pages.entities[id];

export const { addPage, } = Pages.actions;
export { loadFile, loadPage };

export default Pages;
