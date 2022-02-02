import { useEffect, useRef } from "react";
import { MouseButton } from "../types/MouseButton";
import type {Position} from "../types/Position";

const useGetMouseMoveDistance = (button: MouseButton) : [Position, Position] =>
{
	const previous = useRef<Position>({left:0, top: 0});
	const relative = useRef<Position>({left:0, top: 0});
	const absolute = useRef<Position>({left:0, top: 0});
	const active = useRef<boolean>(false);
	
	useEffect(() => {
		const mouseDown = (e: MouseEvent) => 
		{
			if(e.button === button)
			{
				active.current = true;
				previous.current.left = e.clientX;
				previous.current.top = e.clientY;
				absolute.current.left = 0;
				absolute.current.top = 0;
			}
		};
		const mouseMove = (e: MouseEvent) => 
		{
			if(active.current === false) return;
			relative.current.left = e.clientX - previous.current.left;
			relative.current.top = e.clientY - previous.current.top;
			absolute.current.left += relative.current.left;
			absolute.current.top += relative.current.top;
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
	
	return [relative.current, absolute.current];
}

export default useGetMouseMoveDistance;