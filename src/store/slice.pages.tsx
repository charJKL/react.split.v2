import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { StoreState, ThunkStoreTypes } from "./store";

type PageStatus = "Idle" | "Loading" | "Loaded" | "Error";
type Key = string;
type StatusValue = {id: Key; status: PageStatus; }
type SizeValue = {id: Key; width: number, height: number; }

type Page = 
{
	id: Key,
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
	entities: {},
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
		updateStatus: (state, action: PayloadAction<StatusValue>) =>
		{
			const id = action.payload.id;
			const page = state.entities[id];
			if(page === undefined) throw console.error(`You updating status of nonexistent page`, action.payload);
			if(action.payload.status === "Loaded" && (page.width === undefined || page.height === undefined)) throw console.error(`You can't set status="Loaded" for page ${page.name}#${page.id} before setting size.`, action.payload,);
			page.status = action.payload.status;
		},
		setSize: (state, action: PayloadAction<SizeValue>) => 
		{
			const id = action.payload.id;
			const page = state.entities[id];
			if(page === undefined) throw console.error(`You updating status of nonexistent page`, action.payload);
			page.width = action.payload.width;
			page.height = action.payload.height;
		}
	}
});

type PageLoaded = Page & {status: "Loaded"; width: number; height: number;}
const isPageIdle = (page: Page) : boolean => page.status === "Idle";
const isPageLoaded = (page: Page) : page is PageLoaded => page.status === "Loaded";

const loadPage = createAsyncThunk<void, string, ThunkStoreTypes>('pages/loadPage', (id, thunk) => {
	const state = thunk.getState();
	const dispatch = thunk.dispatch;
	const { updateStatus, setSize } = Pages.actions;
	const page = state.pages.entities[id] as Page;

	const image = new Image();
	dispatch(updateStatus({id: id, status: "Loading"}));
	image.addEventListener('load', (e: Event) => {
		const image = e.target as HTMLImageElement;
		const width = image.naturalWidth;
		const height = image.naturalHeight;
		dispatch(setSize({id: id, width, height}));
		dispatch(updateStatus({id: id, status: "Loaded"}));
	});
	image.addEventListener('error', (e: Event) => {
		
		dispatch(updateStatus({id: id, status: "Error"}));
	});
	image.src = page.url;
});

export const selectPageIds = (state: StoreState) => state.pages.ids;
export const selectPageById = (id: string) => (state: StoreState) : Page | null => state.pages.entities[id] ?? null;
export const selectSelectedPage = (state: StoreState) : Page | null => state.gui.selected ? state.pages.entities[state.gui.selected] ?? null : null;

export const { addPage } = Pages.actions;
export { isPageIdle, isPageLoaded, loadPage };

export type { Page, PageLoaded };
export default Pages;
