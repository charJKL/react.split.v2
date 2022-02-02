import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Page } from "./slice.pages";
import type { StoreState, ThunkStoreTypes } from "./store";

type Key = string;

type Ocr = 
{
	id: Key;
}

type InitialStateMetrics =
{
	ids: Array<string>,
	entities: { [key: string]: Ocr },
}

const InitialState : InitialStateMetrics = 
{
	ids: [],
	entities: {},
}

const Ocrs = createSlice({
	name: "ocr",
	initialState: InitialState,
	reducers: 
	{
		addOcr: (state, action: PayloadAction<Ocr>) =>
		{
			const id = action.payload.id;
			state.ids.push(id);
			state.entities[id] = action.payload;
		},
	}
});

export const selectOcrForPage = (page: Page | null) => (state: StoreState) => page ? state.ocrs.entities[page.id] : null;

const readPage = createAsyncThunk<void, string, ThunkStoreTypes>('ocrs/readPage', (id, thunk) => {
	/*
	const state = thunk.getState();
	const dispatch = thunk.dispatch;
	const page = state.pages.entities[id];
	//const upsertPage = Ocrs.actions.upsertPage;

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
	*/
});


export const { addOcr } = Ocrs.actions;
export { };

export type { Ocr };
export default Ocrs;
