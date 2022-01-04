import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { StoreState, StoreDispatch } from "./store";

type PageStatus = "Idle" | "Loading" | "Loaded" | "Error";

type Page = 
{
	id: string,
	status: PageStatus,
	path: string,
	name: string,
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
		addPage(state, action: PayloadAction<Page>)
		{
			const id = action.payload.id;
			state.ids.push(id);
			state.entities[id] = action.payload;
		}
	}
});

type loadFileTypes = {dispatch: StoreDispatch, state: StoreState }
const loadFile = createAsyncThunk<void, Array<File>, loadFileTypes>('pages/loadFile', (files: Array<File>, thunk) => {
	const state = thunk.getState();
	const dispatch = thunk.dispatch;
	
	let counter = state.pages.ids.length;
	files.forEach((file) => {
		const id = (counter++).toString();
		const evenOdd = (counter % 2) ? 'eve' : 'odd';
		const name = `page-${evenOdd}-${id}`;
		const page : Page = {id: id, status: "Idle", path: file.name, name: name};
		dispatch(Pages.actions.addPage(page));
	});
});

export const selectPageIds = (state: StoreState) => state.pages.ids;
export const selectPageById = (id: string) => (state: StoreState) => state.pages.entities[id];

export const { addPage } = Pages.actions;
export { loadFile };

export default Pages;
