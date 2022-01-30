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
				const position = 
				{
					left: desktopPosition.left - editorPosition.left,
					top: desktopPosition.top - editorPosition.top,
				}
				setInitalPosition(position);
			}
		}
		const mouseMove = (e: MouseEvent) =>
		{
			if(displacementing === true)
			{
				const position = {
					left: initalPosition.left + displacement.left,
					top: initalPosition.top + displacement.top,
				}
				setPosition(position);
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
	}, [editor, desktop, initalPosition, displacement, displacementing]);
	
	return {position, positioning: displacementing};
}

export default useAllowRepositioning;


/*
import type { Position } from "../types/Position";
import { MouseButton } from "../types/MouseButton";
import useDisplacement from "./useDisplacement";
import { declareInterface } from "@babel/types";

const usePosition = (element: RefObject<HTMLElement>, desktop: RefObject<HTMLDivElement> ) => 
{
	// const [position, setPosition] = useState<Position>({left: 0, top: 0});
	const [initalPosition, setInitalPosition] = useState<Position>({left: 0, top: 0});
	const {displacementing, displacement} = useDisplacement(MouseButton.right);
	
	const mouseDown = (e: MouseEvent) =>
	{
		if(element.current === null) return;
		if(desktop.current === null) return;
		if(e.button === MouseButton.right)
		{
			const editorPosition = element.current.getBoundingClientRect();
			const desktopPosition = desktop.current.getBoundingClientRect();
			setInitalPosition({left: desktopPosition.left - editorPosition.left, top: desktopPosition.top - editorPosition.top });
		}
	}
	
	const position = {
		left: initalPosition.left + displacement.left,
		top: initalPosition.top + displacement.top,
	}
	
	useEffect(() =>{
		if(element.current == null) return;
		
		const contextmenu = (e: MouseEvent) =>
		{
			e.preventDefault();
		}
		
		console.log('adding listeners');
		element.current.addEventListener('mousedown', mouseDown);
		element.current.addEventListener('contextmenu', contextmenu);
		return () => {
			if(element.current == null) return;
			element.current.removeEventListener('mousedown', mouseDown);
			element.current.removeEventListener('contextmenu', contextmenu);
		}
	}, [element.current, element.current]);
	
	return {position, positioning: displacementing};
}
*/