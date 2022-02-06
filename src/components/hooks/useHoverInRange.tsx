import { useState, useRef, useEffect } from "react";
import { MouseButton, isButtonClicked } from "../types/MouseButton";

const useHoverInRange = (root: HTMLElement|null, element: HTMLElement|null, button: MouseButton, range: number) =>
{
	const [inRange, setInRange] = useState<boolean>(false);
	const isLocked = useRef(false);

	
	useEffect(() =>{
		if(root === null) return;
		if(element === null) return;
		
		const mousedown = (e: MouseEvent) =>
		{
			if(isButtonClicked(button, e)) isLocked.current = true;
		}
		const mousemove = (e: MouseEvent) =>
		{
			if(isLocked.current === true) return;
			const position = element.getBoundingClientRect();
			const inVertically = e.clientY > position.top - range && e.clientY < position.bottom + range;
			const inHorizontally = e.clientX > position.left - range && e.clientX < position.right + range;
			if(isLocked.current === false) setInRange(inVertically && inHorizontally);
		}
		const mouseup = (e: MouseEvent) =>
		{
			if(isButtonClicked(button, e)) isLocked.current = false;
		}
		
		root.addEventListener('mousedown', mousedown);
		root.addEventListener('mousemove', mousemove);
		root.addEventListener('mouseup', mouseup);
		return () =>{
			root.removeEventListener('mousedown', mousedown);
			root.removeEventListener('mousemove', mousemove)
			root.removeEventListener('mouseup', mouseup);
		}
	}, [root, element, range]);
	
	return inRange;
}

export default useHoverInRange;