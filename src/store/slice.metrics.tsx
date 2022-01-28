import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Page } from "./slice.pages";
import type { StoreState, StoreDispatch } from "./store";

type Key = string;

	
type Metric = 
{
	id: Key,
	wasEdited: boolean;
	x1: number;
	x2: number;
	y1: number;
	y2: number;
	rotate: number;
}

type InitialStateMetrics =
{
	ids: Array<string>,
	entities: { [key: string]: Metric },
	selected: string | null;
}

const InitialState : InitialStateMetrics = 
{
	ids: [],
	entities: {},
	selected: null,
}

const Metrics = createSlice({
	name: "metrics",
	initialState: InitialState,
	reducers: 
	{
		addMetric: (state, action: PayloadAction<Metric>) =>
		{
			const id = action.payload.id;
			state.ids.push(id);
			state.entities[id] = action.payload;
		},
	}
});

export const selectMetricsForPage = (page: Page | null) => (state: StoreState) => page ? state.metrics.entities[page.id] : null;

export const { addMetric } = Metrics.actions;
export { };

export type { Metric };
export default Metrics;
