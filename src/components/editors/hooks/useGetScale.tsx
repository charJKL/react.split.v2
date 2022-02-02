import { RefObject, useEffect, useRef, useState } from "react";
import { MouseButton } from "../types/MouseButton";
import { Size } from "../types/Size";
import { Scale} from "../types/Scale";

const SENSITIVITY = 0.0001;

type ScaleAction = null | "scale-out" | "scale-in";

const useGetScale = (editor: RefObject<HTMLElement>, desktop: RefObject<HTMLElement>, viewport: Size, element: Size) : [Scale, ScaleAction] =>
{
	const [scale, setScale] = useState<Scale>({x: 1, y: 1});
	const [isScaling, setScaling] = useState<ScaleAction>(null);
	const scalingWasMade = useRef<boolean>(false);
	

	useEffect(() =>{
		setScale(calculateRationValue(viewport, element));
	}, [viewport, element]);
	
		
	useEffect(() => { // reset indicator that operation scaled was performed
		if(isScaling == null) return;
		const id = setTimeout(() => { setScaling(null); }, 200);
		return () => { clearTimeout(id); }
	}, [isScaling]);

	useEffect(()=>{
		if(editor.current === null) return;
		
		const mousewheel = (e: WheelEvent) =>
		{
			if(e.buttons & MouseButton.Right)
			{
				setScale((scale) => ({x: scale.x - e.deltaY * SENSITIVITY, y: scale.y - e.deltaY * SENSITIVITY}));
				setScaling(e.deltaY > 0 ? "scale-out" : "scale-in");
				scalingWasMade.current = true;
			}
		}
		const contextmenu = (e: MouseEvent) =>
		{
			if(scalingWasMade.current === true) e.preventDefault();
			scalingWasMade.current = false;
		}
		
		const element = editor.current;
		element.addEventListener('wheel', mousewheel);
		element.addEventListener('contextmenu', contextmenu);
		return () => {
			element.removeEventListener('wheel', mousewheel);
			element.removeEventListener('contextmenu', contextmenu);
		}
	}, [editor])

	return [scale, isScaling];
}

const calculateRationValue = (viewport: Size, size: Size) : Scale =>
{
	if(size.width === 0 || size.height === 0) return {x: 1, y: 1}

	const x = viewport.width / size.width;
	const y = viewport.height / size.height;
	const ratio = Math.min(x, y);
	return {x: ratio, y: ratio};
}

export default useGetScale;