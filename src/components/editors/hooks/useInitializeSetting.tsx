import { initializeSetting, isSettingInitialized } from "../../../store/slice.gui";
import { useAppDispatch, useAppSelector } from "../../../store/store.hooks";
import { applayScaleToSize, calculateScale } from "../Editor";
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
		const padding = {x: 20, y: 20};
		const editorSizeWithPadding = {width: editorSize.width - padding.x, height: editorSize.height - padding.y};
		const scale = calculateScale(editorSizeWithPadding, pageSize);
		const size = applayScaleToSize(pageSize, scale);
		const position = { left: (editorSize.width - size.width) / 2, top: (editorSize.height - size.height) / 2 };
		const setting = {scale, position};
		dispatch(initializeSetting({editorName, pageId, setting}));
	}
}

export default useInitializeSetting;