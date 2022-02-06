import {MouseEvent as MouseEventReact} from "react";

export enum MouseButton { Left = 0, Right = 2 };
export enum MouseButtonPress { Left = 1, Right = 2, Whell = 4 }

type MouseEventMerge = MouseEvent | MouseEventReact;

export const isLeftButtonClicked = (event: MouseEventMerge) : boolean => event.button === MouseButton.Left;
export const isRightButtonClicked = (event: MouseEventMerge) : boolean => event.button === MouseButton.Right;

export const isLeftButtonPressed = (event: MouseEventMerge) : boolean => event.buttons === MouseButtonPress.Left;
export const isRightButtonPressed = (event: MouseEventMerge) : boolean => event.buttons === MouseButtonPress.Right;
