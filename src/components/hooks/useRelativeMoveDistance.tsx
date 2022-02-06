import { useEffect, useRef } from "react";

type Position = {x: 0, y: 0};

const useRelativeMoveDistance = () : number =>
{
	const relative = useRef<Position>({x: 0, y: 0});
	
	useEffect(() => {
		const mousedown = (e: MouseEvent) => 
		{
			relative.current.x = 0;
			relative.current.y = 0;
		};
		const mousemove = (e: MouseEvent) => 
		{
			relative.current.x += e.movementX;
			relative.current.y += e.movementY;
		};
		
		document.addEventListener('mousedown', mousedown);
		document.addEventListener('mousemove', mousemove);
		return () => {
			document.removeEventListener('mousedown', mousedown);
			document.removeEventListener('mousemove', mousemove);
		}
	}, []);
	
	return Math.sqrt(Math.abs(relative.current.x) + Math.abs(relative.current.y));
}

export default useRelativeMoveDistance;