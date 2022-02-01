import { useEffect, useRef } from "react";
import type {Position} from "../types/Position";

const useDisplacement = (button: number) =>
{
	const initalPosition = useRef<Position>({left:0, top: 0});
	const displacement = useRef<Position>({left: 0, top: 0});
	const displacementing = useRef<boolean>(false);
	
	useEffect(() => {
		const mouseDown = (e: MouseEvent) => 
		{
			if(e.button === button)
			{
				displacementing.current = true;
				initalPosition.current.left = e.clientX;
				initalPosition.current.top = e.clientY;
			}
		};
		const mouseMove = (e: MouseEvent) => 
		{
			if(displacementing.current === false) return;
			displacement.current.left = e.clientX - initalPosition.current.left;
			displacement.current.top = e.clientY - initalPosition.current.top;
		};
		const mouseUp = (e: MouseEvent) =>
		{
			if(e.button === button)
			{
				displacementing.current = false;
				displacement.current.left = 0;
				displacement.current.top = 0;
			}
		};
		const mouseLeave = (e: MouseEvent) =>
		{
			displacementing.current = false;
			displacement.current.left = 0;
			displacement.current.top = 0;
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
	
	return {displacementing, displacement};
}

export default useDisplacement;