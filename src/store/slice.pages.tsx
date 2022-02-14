import { createAction, createAsyncThunk, createSlice, current, PayloadAction, Store } from "@reduxjs/toolkit";
import { GetStoreState, StoreDispatch, StoreState } from "./store";
import StoreException from "./lib/storeException";

type PageStatus = "Idle" | "Restored" | "Loading" | "Loaded" | "Error";
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

const LoadPagesAction = createAction<InitialStatePages>('localStorage/pages');
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
			if(page === undefined) throw new StoreException(`You updating status of nonexistent page`, action.payload);
			if(action.payload.status === "Loaded" && (page.width === undefined || page.height === undefined)) throw new StoreException(`You can't set status="Loaded" for page ${page.name}#${page.id} before setting size.`, action.payload);
			page.status = action.payload.status;
		},
		setSize: (state, action: PayloadAction<SizeValue>) => 
		{
			const id = action.payload.id;
			const page = state.entities[id];
			if(page === undefined) throw new StoreException(`You updating status of nonexistent page`, action.payload);
			page.width = action.payload.width;
			page.height = action.payload.height;
		}
	},
	extraReducers: (builder) => { builder
		.addCase(LoadPagesAction, (state, action) => {
			const pages = action.payload;
			Object.values(pages.entities).forEach((page) => page.status = "Restored"); // pages load from localStorage aren't loaded.
			return pages;
		})
	}
});

type PageLoaded = Page & {status: "Loaded"; width: number; height: number;}
const isPageIdle = (page: Page) : boolean => page.status === "Idle";
const isPageLoaded = (page: Page) : page is PageLoaded => page.status === "Loaded";

const loadPage = (pageId: Key) => (dispatch: StoreDispatch, getState: GetStoreState) =>
{
	const { pages } = getState();
	const { updateStatus, setSize } = Pages.actions;
	const page = pages.entities[pageId];
	if(page === undefined) throw new StoreException(`You try load page with doesn't exist.`, {type: 'pages/loadPage', payload: pageId})
	
	const image = new Image();
	dispatch(updateStatus({id: pageId, status: "Loading"}));
	image.addEventListener('load', (e: Event) => {
		const image = e.target as HTMLImageElement;
		const width = image.naturalWidth;
		const height = image.naturalHeight;
		dispatch(setSize({id: pageId, width, height}));
		dispatch(updateStatus({id: pageId, status: "Loaded"}));
	});
	image.addEventListener('error', (e: Event) => {
		dispatch(updateStatus({id: pageId, status: "Error"}));
	});
	image.src = page.url;
}

export const selectPageIds = (state: StoreState) => state.pages.ids;
export const selectPageById = (id: string) => (state: StoreState) : Page | null => state.pages.entities[id] ?? null;
export const selectPageByName = (name: string) => (state: StoreState) : Array<Page> => Object.values(state.pages.entities).filter(page => name && page.name.includes(name));
export const selectSelectedPage = (state: StoreState) : Page | null => state.gui.selected ? state.pages.entities[state.gui.selected] ?? null : null;

export const { addPage } = Pages.actions;
export { isPageIdle, isPageLoaded, loadPage };

export type { Page, PageLoaded };
export default Pages;
