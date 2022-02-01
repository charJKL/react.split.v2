import { RefObject, useEffect, useRef, useState } from "react";
import { MouseButton } from "../types/MouseButton";
import { Size } from "../types/Size";
import { Scale} from "../types/Scale";

const SENSITIVITY = 0.0001;

type ScaleAction = null | "scale-out" | "scale-in";

const useAllowScale = (editor: RefObject<HTMLElement>, desktop: RefObject<HTMLElement>, viewport: Size, element: Size) =>
{
	const [scale, setScale] = useState<Scale>({x: 1, y: 1});
	const [scaling, setScaling] = useState<ScaleAction>(null);
	const isScaling = useRef<boolean>(false);
	
	useEffect(() =>{
		setScale(calculateRationValue(viewport, element));
	}, [viewport, viewport.width, viewport.height, element, element.width, element.height]);
	
	useEffect(() => { // reset indicator that operation scaled was performed
		if(scaling == null) return;
		const id = setTimeout(() => { setScaling(null); }, 200);
		return () => { clearTimeout(id); }
	}, [scaling]);
	
	useEffect(()=>{
		if(editor.current === null) return;
		
		const mousedown = (e: MouseEvent) =>
		{
			if(e.button === MouseButton.right)
			{
				isScaling.current = true;
			}
		}
		const mouseup = (e: MouseEvent) =>
		{
			if(e.button === MouseButton.right)
			{
				isScaling.current = false;
			}
		}
		const mouseleave = (e: MouseEvent) =>
		{
			isScaling.current = false;
		}
		const mousewheel = (e: WheelEvent) =>
		{
			if(isScaling.current === true)
			{
				const x = scale.x - e.deltaY * SENSITIVITY;
				const y = scale.y - e.deltaY * SENSITIVITY;
				setScale({x: x, y: y});
				setScaling(e.deltaY > 0 ? "scale-out" : "scale-in");
			}
		}
		
		const element = editor.current;
		element.addEventListener('mousedown', mousedown);
		element.addEventListener('mouseup', mouseup);
		element.addEventListener('mouseleave', mouseleave);
		element.addEventListener('wheel', mousewheel);
		return () => {
			element.removeEventListener('mousedown', mousedown);
			element.removeEventListener('mouseup', mouseup);
			element.removeEventListener('mouseleave', mouseleave);
			element.removeEventListener('wheel', mousewheel);
		}
	}, [editor, desktop, isScaling, scale])

	return {scale, scaling};
}

const calculateRationValue = (viewport: Size, size: Size) : Scale =>
{
	if(size.width === 0 || size.height === 0) return {x: 1, y: 1}

	const x = viewport.width / size.width;
	const y = viewport.height / size.height;
	const ratio = Math.min(x, y);
	return {x: ratio, y: ratio};
}

export default useAllowScale;