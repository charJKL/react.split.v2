import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { StoreState } from "./store";

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
		setFiles: (state, action: PayloadAction<Array<File>>) =>
		{
			let counter = state.ids.length;
			action.payload.forEach((file) => {
				const id = (counter++).toString();
				const evenOdd = (counter % 2) ? 'eve' : 'odd';
				const name = `page-${evenOdd}-${id}`;
				state.ids.push(id);
				state.entities[id] = {id: id, status: "Idle", path: file.name, name: name};
			});
		}
	}
});

export const selectPageIds = (state: StoreState) => state.pages.ids;
export const selectPageById = (id: string) => (state: StoreState) => state.pages.entities[id];
export const { setFiles } = Pages.actions;
export default Pages;
