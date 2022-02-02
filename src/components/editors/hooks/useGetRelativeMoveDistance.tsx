import { useEffect, useRef } from "react";
import type {Position} from "../types/Position";

const useGetRelativeMoveDistance = (button: number) =>
{
	const previous = useRef<Position>({left:0, top: 0});
	const distance = useRef<Position>({left:0, top: 0});
	const active = useRef<boolean>(false);
	
	useEffect(() => {
		const mouseDown = (e: MouseEvent) => 
		{
			if(e.button === button)
			{
				active.current = true;
				previous.current.left = e.clientX;
				previous.current.top = e.clientY;
			}
		};
		const mouseMove = (e: MouseEvent) => 
		{
			if(active.current === false) return;
			distance.current.left = e.clientX - previous.current.left;
			distance.current.top = e.clientY - previous.current.top;
			previous.current.left = e.clientX;
			previous.current.top = e.clientY;
		};
		const mouseUp = (e: MouseEvent) =>
		{
			if(e.button === button)
			{
				active.current = false;
			}
		};
		const mouseLeave = (e: MouseEvent) =>
		{
			active.current = false;
		};

		document.addEventListener('mousedown', mouseDown);
		document.addEventListener('mousemove', mouseMove);
		document.addEventListener('mouseup', mouseUp);
		document.addEventListener('mouseleave', mouseLeave);
		return () => {
			document.removeEventListener('mousedown', mouseDown);
			document.removeEventListener('mousemove', mouseMove);
			document.removeEventListener('mouseup', mouseUp);
			document.removeEventListener('mouseleave', mouseLeave);
		}
	}, [button]);
	
	return {distance: distance.current};
}

export default useGetRelativeMoveDistance;