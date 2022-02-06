import { useEffect, useRef, useState } from "react";
import { isRightButtonPressed } from "../../types/MouseButton";
import { Size } from "../types/Size";
import { Scale} from "../types/Scale";

const SENSITIVITY = 0.0001;

type ScaleAction = null | "scale-out" | "scale-in";

const useGetScale = (editor: HTMLElement | null, initalScale: Scale) : [Scale, ScaleAction] =>
{
	const [scale, setScale] = useState<Scale>(initalScale);
	const [isScaling, setScaling] = useState<ScaleAction>(null);
	const scalingWasMade = useRef<boolean>(false);
	
	useEffect(() => { // reset indicator that operation scaled was performed
		if(isScaling == null) return;
		const id = setTimeout(() => { setScaling(null); }, 200);
		return () => { clearTimeout(id); }
	}, [isScaling]);

	useEffect(()=>{
		if(editor === null) return;
		
		const mousewheel = (e: WheelEvent) =>
		{
			if(isRightButtonPressed(e))
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
		
		editor.addEventListener('wheel', mousewheel);
		editor.addEventListener('contextmenu', contextmenu);
		return () => {
			editor.removeEventListener('wheel', mousewheel);
			editor.removeEventListener('contextmenu', contextmenu);
		}
	}, [editor])

	return [scale, isScaling];
}

export default useGetScale;