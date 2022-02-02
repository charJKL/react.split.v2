import { RefObject, useEffect, useState } from "react";
import type { Position } from "../types/Position";
import { MouseButton } from "../types/MouseButton";
import useGetMouseMoveDistance from "./useGetMouseMoveDistance";

const useGetDesktopPosition = (editor: RefObject<HTMLElement>, desktop: RefObject<HTMLElement>) : [Position, boolean]=>
{
	const [position, setPosition] = useState<Position>({left: 0, top: 0});
	const [isPositioning, setPositioning] = useState<boolean>(false);
	const [distance, absolute] = useGetMouseMoveDistance(MouseButton.Right);

	useEffect(() =>{
		if(editor.current == null) return;
		if(desktop.current == null) return;
		
		const mousedown = (e: MouseEvent) =>
		{
			if(e.button === MouseButton.Right)
			{
				setPositioning(true);
			}
		}
		const mousemove = (e: MouseEvent) =>
		{
			if(isPositioning === true)
			{
				setPosition((position) => ({ left: position.left + distance.left, top: position.top + distance.top }));
			}
		}
		const mouseup = (e: MouseEvent) =>
		{
			if(e.button === MouseButton.Right)
			{
				setPositioning(false);
			}
		}
		const contextmenu = (e: MouseEvent) =>
		{
			const thresholdDistance = (threshold: number) => Math.abs(absolute.left) > threshold || Math.abs(absolute.top) > threshold;
			if(thresholdDistance(2)) e.preventDefault();
		}
		
		const element = editor.current;
		element.addEventListener('mousedown', mousedown);
		element.addEventListener('mousemove', mousemove);
		element.addEventListener('mouseup', mouseup);
		element.addEventListener('contextmenu', contextmenu);
		return () => {
			element.removeEventListener('mousedown', mousedown);
			element.removeEventListener('mousemove', mousemove);
			element.removeEventListener('mouseup', mouseup);
			element.removeEventListener('contextmenu', contextmenu);
		}
	}, [editor, desktop, isPositioning]);
	
	return [position, isPositioning];
}

export default useGetDesktopPosition;