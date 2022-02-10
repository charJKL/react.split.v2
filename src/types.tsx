import { HTMLAttributes } from "react";
import {MouseEvent as MouseEventReact} from "react";

export interface CustomHTMLAttributes extends HTMLAttributes<HTMLElement> { };

// Common used types:
export type Position =
{
	left: number;
	top: number;
}
export type Scale = 
{
	x: number;
	y: number;
}
export type Size = 
{
	width: number;
	height: number;
}

// Mouse related types:
export enum MouseButton { Left = 0, Right = 2 };
export enum MouseButtonPress { None = 0, Left = 1, Right = 2, Whell = 4 }
type MouseEventMerge = MouseEvent | MouseEventReact;
export const isButtonClicked = (button: MouseButton, event: MouseEventMerge) : boolean => event.button === button;
export const isLeftButtonClicked = (event: MouseEventMerge) : boolean => event.button === MouseButton.Left;
export const isRightButtonClicked = (event: MouseEventMerge) : boolean => event.button === MouseButton.Right;
export const isNoneButtonPressed = (event: MouseEventMerge) : boolean => event.buttons === MouseButtonPress.None;
export const isLeftButtonPressed = (event: MouseEventMerge) : boolean => event.buttons === MouseButtonPress.Left;
export const isRightButtonPressed = (event: MouseEventMerge) : boolean => event.buttons === MouseButtonPress.Right;

