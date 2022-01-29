import { MouseEvent, useState } from "react";
import type { Position } from "../types/Position";
import { MouseButton } from "../types/MouseButton";
import useDisplacement from "./useDisplacement";

const usePosition = (element: React.RefObject<HTMLElement>) => 
{
	const [position, setPosition] = useState<Position>({left: 0, top: 0});
	const [initalPosition, setInitalPosition] = useState<Position>({left: 0, top: 0});
	const {displacementing, displacement} = useDisplacement(MouseButton.right);
	
	const mouseDown = (e: MouseEvent) =>
	{
		if(e.button === MouseButton.right)
		{
			setInitalPosition({left: position.left, top: position.top});
		}
	}
	const mouseMove = (e: MouseEvent) =>
	{
		if(displacementing === false) return;

		const pos = {left: initalPosition.left + displacement.left, top: initalPosition.top + displacement.top};
		setPosition(pos);
	}
	const contextmenu = (e: MouseEvent) =>
	{
		e.preventDefault();
	}
	
	return {position, isMoving: displacementing, mouseDown, mouseMove, contextmenu};
}

export default usePosition;