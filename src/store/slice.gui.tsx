import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { StoreState } from "./store";

type Key = string;
type Position = {top: number, left: number};
type Scale = {x: number, y: number};
type KeyValue = {editorName: string; pageId: string; setting: Omit<Setting, "id">; }
type PositionValue = {editorName: string, pageId: string, movementX: number, movementY: number };
type ScaleValue = {editorName: string, pageId: string, x: number, y: number };

type Setting = 
{
	id: Key;
	position: Position;
	scale: Scale;
}

type InitialStateGui =
{
	ids: Array<string>,
	settings: { [key: Key]: Setting },
}

const InitialState : InitialStateGui = 
{
	ids: [],
	settings: {},
}

const Gui = createSlice({
	name: "gui",
	initialState: InitialState,
	reducers: 
	{
		initializeSetting: (state, action: PayloadAction<KeyValue>) =>
		{
			const key = action.payload.editorName + action.payload.pageId;
			state.settings[key] = { id: key, ...action.payload.setting };
		},
		updatePosition: (state, action: PayloadAction<PositionValue>) =>
		{
			const key = action.payload.editorName + action.payload.pageId;
			const setting = state.settings[key];
			if(setting)
			{
				setting.position.top += action.payload.movementY;
				setting.position.left += action.payload.movementX;
			}
		},
		updateScale: (state, action: PayloadAction<ScaleValue>) =>
		{
			const key = action.payload.editorName + action.payload.pageId;
			const setting = state.settings[key];
			if(setting)
			{
				setting.scale.x += action.payload.x;
				setting.scale.y += action.payload.y;
			}
		},
	}
});

export const isSettingInitialized = (editorName: string, pageId: string) => (state: StoreState) : boolean => state.gui.settings[editorName+pageId] !== undefined;
export const selectPositionSetting = (editorName: string, pageId: string) => (state: StoreState) : Position | null => state.gui.settings[editorName+pageId]?.position ?? null;
export const selectScaleSetting = (editorName: string, pageId: string) => (state: StoreState) : Scale | null => state.gui.settings[editorName+pageId]?.scale ?? null;

export const { initializeSetting, updatePosition, updateScale } = Gui.actions;

export type { Setting };
export default Gui;
