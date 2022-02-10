import { useEffect, useState } from "react";
import { Position, isRightButtonClicked } from "../../../types";
import useRelativeMoveDistance from "../../hooks/useRelativeMoveDistance";
import { useAppDispatch, useAppSelector } from "../../../store/store.hooks";
import { selectPositionSetting, updatePosition } from "../../../store/slice.gui";

const useGetDesktopPosition = (editor: HTMLElement | null, editorName: string, pageId: string) : [Position | null, boolean]=>
{
	const position = useAppSelector(selectPositionSetting(editorName, pageId));
	const [isPositioning, setPositioning] = useState<boolean>(false);
	const relativeMoveDistance = useRelativeMoveDistance();
	const dispatch = useAppDispatch();

	useEffect(() => {
		if(editor === null) return;
		
		const mousedown = (e: MouseEvent) =>
		{
			if(isRightButtonClicked(e)) setPositioning(true);
		}
		const mousemove = (e: MouseEvent) =>
		{
			if(isPositioning === true) dispatch(updatePosition({editorName, pageId, movementX: e.movementX, movementY: e.movementY}));
		}
		const mouseup = (e: MouseEvent) =>
		{
			if(isRightButtonClicked(e)) setPositioning(false);
		}
		const contextmenu = (e: MouseEvent) =>
		{
			if(relativeMoveDistance > 2) e.preventDefault();
		}
		
		editor.addEventListener('mousedown', mousedown);
		editor.addEventListener('mousemove', mousemove);
		editor.addEventListener('mouseup', mouseup);
		editor.addEventListener('contextmenu', contextmenu);
		return () => {
			editor.removeEventListener('mousedown', mousedown);
			editor.removeEventListener('mousemove', mousemove);
			editor.removeEventListener('mouseup', mouseup);
			editor.removeEventListener('contextmenu', contextmenu);
		}
	}, [editor, editorName, pageId, isPositioning]);
	
	return [position, isPositioning];
}

export default useGetDesktopPosition;