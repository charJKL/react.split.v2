export enum MouseButton { Left = 0, Right = 2 };

export const isLeftButtonClicked = (button: number) : boolean => button === MouseButton.Left;
export const isRightButtonClicked = (button: number) : boolean => button === MouseButton.Right;
