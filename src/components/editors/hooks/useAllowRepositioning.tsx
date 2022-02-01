import { RefObject, useEffect, useState } from "react";
import type { Position } from "../types/Position";
import { MouseButton } from "../types/MouseButton";
import useDisplacement from "./useDisplacement";

const useAllowRepositioning = (editor: RefObject<HTMLElement>, desktop: RefObject<HTMLElement>) =>
{
	const [position, setPosition] = useState<Position>({left: 0, top: 0});
	const [initalPosition, setInitalPosition] = useState<Position>({left: 0, top: 0});
	const {displacementing, displacement} = useDisplacement(MouseButton.right);
	
	useEffect(() =>{
		if(editor.current == null) return;
		if(desktop.current == null) return;
		
		const mouseDown = (e: MouseEvent) =>
		{
			if(e.button === MouseButton.right)
			{
				const editorPosition = editor.current!.getBoundingClientRect();
				const desktopPosition = desktop.current!.getBoundingClientRect();
				setInitalPosition({ left: desktopPosition.left - editorPosition.left, top: desktopPosition.top - editorPosition.top });
			}
		}
		const mouseMove = (e: MouseEvent) =>
		{
			if(displacementing.current === true)
			{
				setPosition({ left: initalPosition.left + displacement.current.left, top: initalPosition.top + displacement.current.top });
			}
		}
		const contextmenu = (e: MouseEvent) =>
		{
			e.preventDefault();
		}
		
		const element = editor.current;
		element.addEventListener('mousedown', mouseDown);
		element.addEventListener('mousemove', mouseMove);
		element.addEventListener('contextmenu', contextmenu);
		return () => {
			element.removeEventListener('mousedown', mouseDown);
			element.removeEventListener('mousemove', mouseMove);
			element.removeEventListener('contextmenu', contextmenu);
		}
	}, [editor, desktop, displacement, displacementing, initalPosition]);
	
	return {position: position, positioning: displacementing.current};
}

export default useAllowRepositioning;