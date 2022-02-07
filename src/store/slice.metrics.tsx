import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Page } from "./slice.pages";
import type { StoreState, StoreDispatch } from "./store";

type Key = string;
type MetricName = "x1" | "x2" | "y1" | "y2" | "rotate";
type MetricLineNames = Exclude<MetricName, "rotate">;
type MetricValue = { id: Key, name: MetricName, value: number};
type WasEditedValue = { id: Key, checked: boolean};

type Metric = 
{
	id: Key;
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
}

const InitialState : InitialStateMetrics = 
{
	ids: [],
	entities: {},
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
		updateMetricValue: (state, action: PayloadAction<MetricValue>) =>
		{
			const id = action.payload.id;
			const name = action.payload.name;
			state.entities[id].wasEdited = true;
			state.entities[id][name] = action.payload.value;
		},
		updateWasEdited: (state, action: PayloadAction<WasEditedValue>) =>
		{
			const id = action.payload.id;
			const checked = action.payload.checked;
			state.entities[id].wasEdited = checked;
		}
	}
});

export const selectMetricsForPage = (page: Page | null) => (state: StoreState) => page ? state.metrics.entities[page.id] : null;

export const { addMetric, updateMetricValue, updateWasEdited } = Metrics.actions;
export { };

export type { Metric, MetricName, MetricLineNames };
export default Metrics;
