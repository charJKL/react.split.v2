import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { GetStoreState, StoreDispatch, StoreState } from "./store";
import StoreException from "./lib/storeException";
import { resetState } from "./store.reset";

type Key = string;
type Position = {top: number, left: number};
type Scale = {x: number, y: number};
type Tooltips = "startHere" | "loadResources";
type KeyValue = {editorName: string; pageId: string; setting: Omit<Setting, "id">; }
type PositionValue = {editorName: string, pageId: string, movementX: number, movementY: number };
type ScaleValue = {editorName: string, pageId: string, x: number, y: number };
type TooltipValue = {tooltip: Tooltips, value: boolean};

type Setting = 
{
	id: Key;
	position: Position;
	scale: Scale;
}

type InitialStateGui =
{
	selected: string | null;
	searching: string | null;
	settings: { [key: Key]: Setting };
	tooltips: { [i in Tooltips]: boolean };
}

const InitialState : InitialStateGui = 
{
	selected: null,
	searching: null,
	settings: {},
	tooltips: { startHere: true, loadResources: false },
}

const SliceName = "gui";
const LoadGuiAction = createAction<InitialStateGui>('localStorage/gui');
const Gui = createSlice({
	name: SliceName,
	initialState: InitialState,
	reducers: 
	{
		selectPage: (state, action: PayloadAction<string | null>) =>
		{
			state.selected = action.payload;
		},
		setSearching: (state, action: PayloadAction<string | null>) =>
		{
			state.searching = action.payload;
		},
		initializeSetting: (state, action: PayloadAction<KeyValue>) =>
		{
			const key = action.payload.editorName + action.payload.pageId;
			state.settings[key] = { id: key, ...action.payload.setting };
		},
		updatePosition: (state, action: PayloadAction<PositionValue>) =>
		{
			const key = action.payload.editorName + action.payload.pageId;
			const setting = state.settings[key];
			if(setting === undefined) throw new StoreException(`You update "position" for nonexistent setting "${key}":`, action.payload);
			setting.position.top += action.payload.movementY;
			setting.position.left += action.payload.movementX;
		},
		updateScale: (state, action: PayloadAction<ScaleValue>) =>
		{
			const key = action.payload.editorName + action.payload.pageId;
			const setting = state.settings[key];
			if(setting === undefined) throw new StoreException(`You update "scale" for nonexistent setting "${key}":`, action.payload);
			setting.scale.x += action.payload.x;
			setting.scale.y += action.payload.y;
		},
		updateTooltip: (state, action: PayloadAction<TooltipValue>) =>
		{
			const tooltip = state.tooltips[action.payload.tooltip];
			const value = action.payload.value;
			if(tooltip === undefined) throw new StoreException(`You update "${action.payload.tooltip}" tooltip wich doesn't exist.`, action.payload);
			state.tooltips[action.payload.tooltip] = value;
		}
	},
	extraReducers: (builder) => { builder
		.addCase(LoadGuiAction, (state, action) => {
			return action.payload;
		})
		.addCase(resetState, (state, action) =>{
			if(action.payload.includes(SliceName)) return InitialState;
		});
	}
});

export const isSettingInitialized = (editorName: string, pageId: string) => (state: StoreState) : boolean => state.gui.settings[editorName+pageId] !== undefined;
export const selectPositionSetting = (editorName: string, pageId: string) => (state: StoreState) : Position | null => state.gui.settings[editorName+pageId]?.position ?? null;
export const selectScaleSetting = (editorName: string, pageId: string) => (state: StoreState) : Scale | null => state.gui.settings[editorName+pageId]?.scale ?? null;
export const selectTooltip = (tooltip: Tooltips) => (state: StoreState): boolean => state.gui.tooltips[tooltip] ?? false;
export const selectSearching = (state: StoreState) => state.gui.searching;

const selectPage = (pageId: string) => (dispatch: StoreDispatch, getState: GetStoreState ) => 
{
	const store = getState();
	const pages = store.pages;
	const { selectPage } = Gui.actions;
	if(pages.ids.includes(pageId)) dispatch(selectPage(pageId));
}

export const { setSearching, initializeSetting, updatePosition, updateScale, updateTooltip } = Gui.actions;
export { selectPage };

export type { Setting };
export default Gui;

