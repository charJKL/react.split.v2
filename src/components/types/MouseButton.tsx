export enum MouseButton { Left = 0, Right = 2 };
export enum MouseButtonPress { Left = 1, Right = 2, Whell = 4 }

export const isLeftButtonClicked = (event: MouseEvent) : boolean => event.button === MouseButton.Left;
export const isRightButtonClicked = (event: MouseEvent) : boolean => event.button === MouseButton.Right;

export const isLeftButtonPressed = (event: MouseEvent) : boolean => event.buttons === MouseButtonPress.Left;
export const isRightButtonPressed = (event: MouseEvent) : boolean => event.buttons === MouseButtonPress.Right;
