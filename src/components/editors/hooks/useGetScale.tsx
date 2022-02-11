import { useEffect, useRef, useState } from "react";
import { Scale, isRightButtonPressed } from "../../../types";
import { useAppDispatch, useAppSelector } from "../../../store/store.hooks";
import { selectScaleSetting, updateScale } from "../../../store/slice.gui";

const SENSITIVITY = 0.0001;
type ScaleAction = null | "scale-out" | "scale-in";
const useGetScale = (editor: HTMLElement | null, editorName: string, pageId: string) : [Scale | null, ScaleAction] =>
{
	const scale = useAppSelector(selectScaleSetting(editorName, pageId));
	const [isScaling, setScaling] = useState<ScaleAction>(null);
	const scalingWasMade = useRef<boolean>(false);
	const dispatch = useAppDispatch();
	
	useEffect(() => { // reset indicator that operation scaled was performed
		if(isScaling == null) return;
		const id = setTimeout(() => { setScaling(null); }, 200);
		return () => { clearTimeout(id); }
	}, [isScaling]);

	useEffect(()=>{
		if(editor === null) return;
		if(pageId === "") return;
		
		const mousewheel = (e: WheelEvent) =>
		{
			if(isRightButtonPressed(e))
			{
				dispatch(updateScale({editorName, pageId, x: -e.deltaY * SENSITIVITY, y: -e.deltaY * SENSITIVITY}));
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
	}, [editor, editorName, pageId])
	
	return [scale, isScaling];
}

export default useGetScale;