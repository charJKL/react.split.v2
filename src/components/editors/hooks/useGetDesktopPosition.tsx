import { useEffect, useState } from "react";
import type { Position } from "../types/Position";
import { isRightButtonClicked } from "../../types/MouseButton";
import useRelativeMoveDistance from "../../hooks/useRelativeMoveDistance";

const useGetDesktopPosition = (editor: HTMLElement | null, initalPosition: Position) : [Position, boolean]=>
{
	const [position, setPosition] = useState<Position>(initalPosition);
	const [isPositioning, setPositioning] = useState<boolean>(false);
	const relativeMoveDistance = useRelativeMoveDistance();
	
	useEffect(() => {
		if(editor === null) return;
		
		const mousedown = (e: MouseEvent) =>
		{
			if(isRightButtonClicked(e.button)) setPositioning(true);
		}
		const mousemove = (e: MouseEvent) =>
		{
			if(isPositioning === true) setPosition(state => ({left: state.left + e.movementX, top: state.top + e.movementY}));
		}
		const mouseup = (e: MouseEvent) =>
		{
			if(isRightButtonClicked(e.button)) setPositioning(false);
		}
		const contextmenu = (e: MouseEvent) =>
		{
			if(relativeMoveDistance > 2) e.preventDefault();
		}
		
		editor.addEventListener('mousedown', mousedown);
		editor.addEventListener('mousemove', mousemove);
		editor.addEventListener('mouseup', mouseup);
		editor.addEventListener('contextmenu', contextmenu);
		return () => {
			editor.removeEventListener('mousedown', mousedown);
			editor.removeEventListener('mousemove', mousemove);
			editor.removeEventListener('mouseup', mouseup);
			editor.removeEventListener('contextmenu', contextmenu);
		}
	}, [editor, isPositioning]);
	
	return [position, isPositioning];
}

export default useGetDesktopPosition;