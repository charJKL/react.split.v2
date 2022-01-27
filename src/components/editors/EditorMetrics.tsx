import React, { useRef, MouseEvent } from "react";
import { loadPage, selectSelectedPage } from "../../store/slice.pages";
import { useAppSelector } from "../../store/store.hooks";
import useGetEditorSize from "./useGetEditorSize";
import useGetPageSize from "./useGetPageSize";
import useScale from "./useScale";
import css from "./EditorMetrics.module.scss";
import usePosition from "./usePosition";

const EditorMetrics = (): JSX.Element =>
{
	const page = useAppSelector(selectSelectedPage);
	const editorRef = useRef<HTMLDivElement>(null);
	const editorSize = useGetEditorSize(editorRef);
	const pageSize = useGetPageSize(page);
	const {size, scale, mouseDown: mouseDownScale, mouseUp: mouseUpScale, mouseLeave: mouseLeaveScale, mouseWheel: mouseWheelScale} = useScale(editorSize, pageSize);
	const {position, mousedown: mouseDownPosition, mousemove: mouseMovePosition, mouseup: mouseUpPosition, mouseleave: mouseLeavePosition, contextmenu : mouseContextPosition} = usePosition(editorRef);
	
	var toolbars: Array<JSX.Element> = [];
	var desktop : JSX.Element = <></>;

	if(page && page.status == "Loaded")
	{
		desktop = (
			<>
				<img className={css.image} src={page.url} />
			</>
		)
	}
	
	const onMouseDownHandler = (e: MouseEvent) => { mouseDownScale(e); mouseDownPosition(e); }
	const onMouseMoveHandler = (e: MouseEvent) => { mouseMovePosition(e); }
	const onMouseUpHandler = (e: MouseEvent) => { mouseUpScale(e); mouseDownPosition(e); }
	const onMouseLeaveHandler = (e: MouseEvent) => { mouseLeaveScale(e); mouseLeavePosition(e); }
	const onMouseContextHandler = (e: MouseEvent) => { mouseContextPosition(e); }
	const onMouseWheelHandler = (e: MouseEvent) => { mouseWheelScale(e); }
	
	const style = { ...size, ...position };
	return (
		<div className={css.editor} ref={editorRef} onMouseDown={onMouseDownHandler} onMouseMove={onMouseMoveHandler} onMouseUp={onMouseUpHandler} onMouseLeave={onMouseLeaveHandler} onContextMenu={onMouseContextHandler} onWheel={onMouseWheelHandler}>
			<div className={css.toolbars}>
				<label>🔍 {scale.x.toFixed(2)} / 1.00</label>
			</div>
			<div className={css.desktop} style={style}>
				{desktop}
			</div>
		</div>
	)
}

export default EditorMetrics;