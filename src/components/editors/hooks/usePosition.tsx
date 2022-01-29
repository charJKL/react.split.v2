import { MouseEvent, useState } from "react";

type Position =
{
	left: number;
	top: number;
}
const MouseButton = 
{
	left: 0,
	right: 2
};

const usePosition = (element: React.RefObject<HTMLElement>) => 
{
	const [position, setPosition] = useState<Position>({left: 0, top: 0});
	const [isMoving, setMoving] = useState<boolean>(false);
	const [initalPosition, setInitalPosition] = useState<Position>({left: 0, top: 0});
	const [initalMouse, setInitalMouse] = useState<Position>({left: 0, top: 0});
	
	const mouseDown = (e: MouseEvent) =>
	{
		if(e.button !== MouseButton.right) return;
		setMoving(true);
		setInitalPosition({left: position.left, top: position.top});
		setInitalMouse({left: e.clientX, top: e.clientY});
	}
	const mouseMove = (e: MouseEvent) =>
	{
		if(isMoving === false) return;
		
		const current = {x: e.clientX, y: e.clientY};
		const diff = {x: initalMouse.left - current.x, y: initalMouse.top - current.y};
		const pos = {left: initalPosition.left - diff.x, top: initalPosition.top - diff.y};
		setPosition(pos);
	}
	const mouseUp = (e: MouseEvent) => 
	{
		if(e.button !== MouseButton.right) return;
		setMoving(false);
	}
	const mouseLeave = (e: MouseEvent) =>
	{
		setMoving(false);
	}
	const contextmenu = (e: MouseEvent) =>
	{
		e.preventDefault();
	}
	
	return {position, isMoving, mouseDown, mouseMove, mouseUp, mouseLeave, contextmenu};
}

export default usePosition;