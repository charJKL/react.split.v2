import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { access } from "fs/promises";
import { toEditorSettings } from "typescript";
import { Page } from "./slice.pages";
import type { StoreState } from "./store";

type Key = string;
type Position = {top: number, left: number};
type Scale = {x: number, y: number};
type KeyValue = {editorName: string; pageId: string; setting: Omit<Setting, "id">; }
type PositionValue = {editorName: string, pageId: string, movementX: number, movementY: number };
type ScaleValue = {editorName: string, pageId: Page['id'], scale: Scale };

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

const InitalPosition = {top: 0, left: 0};
const InitalScale = {x: 0, y: 0};
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
				setting.scale = action.payload.scale;
			}
		},
	}
});

export const isSettingInitialized = (editorName: string, pageId: string | null) => (state: StoreState) => pageId === null || state.gui.settings[editorName+pageId] !== undefined;
export const selectPositionSetting = (editorName: string, pageId: string | null) => (state: StoreState) => state.gui.settings[editorName+pageId]?.position ?? null;
export const selectScaleSetting = (editorName: string, pageId: string | null) => (state: StoreState) => state.gui.settings[editorName+pageId]?.scale ?? null;

export const { initializeSetting, updatePosition, updateScale } = Gui.actions;

export type { Setting };
export default Gui;
