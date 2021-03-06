import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { StoreState } from "./store";
import { resetState } from "./store.reset";
import StoreException from "./lib/storeException";

type Key = string;
type MetricStatus = "Idle" | "Invalid" | "Edited";
type MetricDetails = "x1>x2" | "x2<x1" | "y1>y2" | "y2<y1";
type MetricName = "x1" | "x2" | "y1" | "y2" | "rotate";
type MetricLineNames = Exclude<MetricName, "rotate">;
type MetricValue = { id: Key, name: MetricName, value: number};
type StatusValue = { id: Key, status: MetricStatus};

type Metric = 
{
	id: Key;
	status: MetricStatus;
	details: MetricDetails | null;
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

const SliceName = "metrics";
const LoadMetricsAction = createAction<InitialStateMetrics>('localStorage/metrics');
const Metrics = createSlice({
	name: SliceName,
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
			if(entity === undefined) throw new StoreException(`You update metrics value for nonexisting page`, action.payload);
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
				
				default:
					entity.status = "Edited";
					entity.details = null;
			}
		},
		updateStatus: (state, action: PayloadAction<StatusValue>) =>
		{
			const id = action.payload.id;
			const status = action.payload.status;
			const entity = state.entities[id];
			if(entity === undefined) throw new StoreException(`You update metrics status for nonexisting page`, action.payload);
			entity.status = status;
		}
	},
	extraReducers: (builder) => { builder
		.addCase(LoadMetricsAction, (state, action) => {
			return action.payload;
		})
		.addCase(resetState, (state, action) => {
			if(action.payload.includes(SliceName)) return InitialState;
		});
	}
});

export const selectMetricsForPage = (pageId: string) => (state: StoreState) : Metric | null => state.metrics.entities[pageId] ?? null;

export const { addMetric,updateMetricValue, updateStatus } = Metrics.actions;

export type { Metric, MetricName, MetricLineNames };
export default Metrics;
