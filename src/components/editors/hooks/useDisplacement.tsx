import { useEffect } from "react";
import { useState } from "react";
import type {Position} from "../types/Position";

const useDisplacement = () =>
{
	const [initalPosition, setInitalPosition] = useState<Position>({left: 0, top: 0});
	const [displacement, setDisplacement] = useState<Position>({left: 0, top: 0});
	const [displacementing, setDisplacementing] = useState<boolean>(false);
	
	useEffect(() => {
		const mouseDown = (e: MouseEvent) => 
		{
			setDisplacementing(true);
			setInitalPosition({left: e.clientX, top: e.clientY});
		};
		const mouseMove = (e: MouseEvent) => 
		{
			if(displacementing === false) return;
			const diff = {left: e.clientX - initalPosition.left, top: e.clientY - initalPosition.top};
			setDisplacement(diff);
		};
		const mouseUp = (e: MouseEvent) =>
		{
			setDisplacementing(false);
		};
		const mouseLeave = (e: MouseEvent) =>
		{
			setDisplacementing(false);
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
	}, [displacementing, initalPosition]);
	
	return {displacementing, displacement};
}

export default useDisplacement;