import React, { useRef, MouseEvent, WheelEvent } from "react";
import { loadPage, selectSelectedPage } from "../../store/slice.pages";
import { useAppSelector } from "../../store/store.hooks";
import useGetEditorSize from "./useGetEditorSize";
import useGetPageSize from "./useGetPageSize";
import useScale from "./useScale";
import usePosition from "./usePosition";
import useGetMetrics from "./useGetMetrics";
import css from "./EditorMetrics.module.scss";

const EditorMetrics = (): JSX.Element =>
{
	const page = useAppSelector(selectSelectedPage);
	const editorRef = useRef<HTMLDivElement>(null);
	const editorSize = useGetEditorSize(editorRef);
	const pageSize = useGetPageSize(page);
	const {size, scale, wasScaled, mouseDown: mouseDownScale, mouseUp: mouseUpScale, mouseLeave: mouseLeaveScale, mouseWheel: mouseWheelScale} = useScale(editorSize, pageSize);
	const {position, isMoving, mouseDown: mouseDownPosition, mouseMove: mouseMovePosition, mouseUp: mouseUpPosition, mouseLeave: mouseLeavePosition, contextmenu : mouseContextPosition} = usePosition(editorRef);
	useGetMetrics();
	
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
	const onMouseUpHandler = (e: MouseEvent) => { mouseUpScale(e); mouseUpPosition(e); }
	const onMouseLeaveHandler = (e: MouseEvent) => { mouseLeaveScale(e); mouseLeavePosition(e); }
	const onMouseContextHandler = (e: MouseEvent) => { mouseContextPosition(e); }
	const onMouseWheelHandler = (e: WheelEvent) => { mouseWheelScale(e); }
	
	const movingCursor = isMoving ? { cursor: 'move'} : {} ;
	const scalingCursor = wasScaled ? wasScaled == "scale-out" ? { cursor: 'zoom-out'} : { cursor: 'zoom-in'} : {};
	const styleForEditor = { ...movingCursor, ...scalingCursor };
	const styleForDesktop = { ...size, ...position, ...movingCursor, ...scalingCursor };
	return (
		<div className={css.editor} style={styleForEditor} ref={editorRef} onMouseDown={onMouseDownHandler} onMouseMove={onMouseMoveHandler} onMouseUp={onMouseUpHandler} onMouseLeave={onMouseLeaveHandler} onContextMenu={onMouseContextHandler} onWheel={onMouseWheelHandler}>
			<div className={css.toolbars}>
				<label>🔍 {scale.x.toFixed(2)} / 1.00</label>
			</div>
			<div className={css.desktop} style={styleForDesktop}>
				{desktop}
			</div>
		</div>
	)
}

export default EditorMetrics;