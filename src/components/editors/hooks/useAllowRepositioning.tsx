import { RefObject, useEffect, useState } from "react";
import type { Position } from "../types/Position";
import { MouseButton } from "../types/MouseButton";
import useDisplacement from "./useDisplacement";

const useAllowRepositioning = (editor: RefObject<HTMLElement>, desktop: RefObject<HTMLElement>) =>
{
	const [position, setPosition] = useState<Position>({left: 0, top: 0});
	const [initalPosition, setInitalPosition] = useState<Position>({left: 0, top: 0});
	const [positioning, setPositioning] = useState<boolean>(false);
	const {displacementing, displacement} = useDisplacement(MouseButton.right);
	
	useEffect(() =>{
		if(editor.current == null) return;
		if(desktop.current == null) return;
		
		const mousedown = (e: MouseEvent) =>
		{
			if(e.button === MouseButton.right)
			{
				const editorPosition = editor.current!.getBoundingClientRect();
				const desktopPosition = desktop.current!.getBoundingClientRect();
				setInitalPosition({ left: desktopPosition.left - editorPosition.left, top: desktopPosition.top - editorPosition.top });
				setPositioning(true);
			}
		}
		const mousemove = (e: MouseEvent) =>
		{
			if(displacementing.current === true)
			{
				setPosition({ left: initalPosition.left + displacement.current.left, top: initalPosition.top + displacement.current.top });
			}
		}
		const mouseup = (e: MouseEvent) =>
		{
			if(e.button === MouseButton.right)
			{
				setPositioning(false);
			}
		}
		const contextmenu = (e: MouseEvent) =>
		{
			const thresholdDistance = (threshold: number) => Math.abs(displacement.current.left) > threshold || Math.abs(displacement.current.top) > threshold;
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
	}, [editor, desktop, displacement, displacementing, initalPosition]);
	
	return {position, positioning};
}


export default useAllowRepositioning;