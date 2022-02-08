import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Page } from "./slice.pages";
import type { StoreState } from "./store";

type Key = string;
type MetricStatus = "Idle" | "Invalid" | "Edited";
type MetricDetails = "x1>x2" | "x2<x1" | "y1>y2" | "y2<y1";
type MetricName = "x1" | "x2" | "y1" | "y2" | "rotate";
type MetricLineNames = Exclude<MetricName, "rotate">;
type MetricValue = { id: Key, name: MetricName, value: number};
type WasEditedValue = { id: Key, checked: boolean};

type Metric = 
{
	id: Key;
	status: MetricStatus;
	details: MetricDetails | null;
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
			const entity = state.entities[id];
			if(entity)
			{
				entity.wasEdited= true;
				entity.status = "Edited";
				entity[name] = action.payload.value;
				switch(true)
				{
					case entity.x1 > entity.x2:
						entity.status = "Invalid";
						entity.details = "x1>x2";
						break;
					
					case entity.x2 < entity.x1:
						entity.status = "Invalid";
						entity.details = "x2<x1";
						break;
						
					case entity.y1 > entity.y2:
						entity.status = "Invalid";
						entity.details = "y1>y2";
						break;
					
					case entity.y2 < entity.y1:
						entity.status = "Invalid";
						entity.details = "y2<y1";
						break;
				}
			}
		},
		updateWasEdited: (state, action: PayloadAction<WasEditedValue>) =>
		{
			const id = action.payload.id;
			const checked = action.payload.checked;
			const entity = state.entities[id];
			if(entity)
			{
				entity.wasEdited = checked;
			}
		}
	}
});

export const selectMetricsForPage = (page: Page | null) => (state: StoreState) => page ? state.metrics.entities[page.id] : null;

export const { addMetric,updateMetricValue, updateWasEdited } = Metrics.actions;

export type { Metric, MetricName, MetricLineNames };
export default Metrics;
