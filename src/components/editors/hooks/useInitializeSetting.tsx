import { initializeSetting, isSettingInitialized } from "../../../store/slice.gui";
import { useAppDispatch, useAppSelector } from "../../../store/store.hooks";
import { calculateScale } from "../Editor";
import useGetBoundingRect from "../../hooks/useGetBoundingRect";
import useGetPageSize from "./useGetPageSize";

const useInitializeSetting = (editor: HTMLDivElement | null, editorName: string, pageId: string) =>
{
	const isInitialized = useAppSelector(isSettingInitialized(editorName, pageId));
	const editorSize = useGetBoundingRect(editor);
	const pageSize = useGetPageSize(pageId);
	const dispatch = useAppDispatch();
	
	if(isInitialized === false && editorSize && pageSize)
	{
		const setting =
		{
			position: {left: -1, top: -1},
			scale: calculateScale(editorSize, pageSize)
		}
		dispatch(initializeSetting({editorName, pageId, setting}));
	}
}

export default useInitializeSetting;