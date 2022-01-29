import React, { useRef, MouseEvent, WheelEvent } from "react";
import { selectSelectedPage } from "../../store/slice.pages";
import { selectMetricsForPage } from "../../store/slice.metrics";
import { useAppSelector } from "../../store/store.hooks";
import useGetEditorSize from "./hooks/useGetEditorSize";
import useGetPageSize from "./hooks/useGetPageSize";
import useScale from "./hooks/useScale";
import usePosition from "./hooks/usePosition";
import useGetMetrics from "./hooks/useGetMetrics";
import css from "./EditorMetrics.module.scss";

const EditorMetrics = (): JSX.Element =>
{
	const page = useAppSelector(selectSelectedPage);
	const metrics = useAppSelector(selectMetricsForPage(page));
	
	
	const editorRef = useRef<HTMLDivElement>(null);
	const editorSize = useGetEditorSize(editorRef);
	const pageSize = useGetPageSize(page);
	const {size, scale, wasScaled, mouseDown: mouseDownScale, mouseUp: mouseUpScale, mouseLeave: mouseLeaveScale, mouseWheel: mouseWheelScale} = useScale(editorSize, pageSize);
	const {position, isMoving, mouseDown: mouseDownPosition, mouseMove: mouseMovePosition, mouseUp: mouseUpPosition, mouseLeave: mouseLeavePosition, contextmenu : mouseContextPosition} = usePosition(editorRef);
	const cursorPosition = useCursorPosition(editorRef, position);
	const {Lines} = useGetMetrics(metrics, size, scale, );
	
	var toolbars: Array<JSX.Element> = [];
	var desktop : JSX.Element = <></>;

	if(page && page.status == "Loaded")
	{
		desktop = (
			<>
				<img className={css.image} src={page.url} />
				<Lines className={css.lines} />
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
	const styleForDesktop = { ...size, ...position };
	return (
		<div className={css.editor} style={styleForEditor} ref={editorRef} onMouseDown={onMouseDownHandler} onMouseMove={onMouseMoveHandler} onMouseUp={onMouseUpHandler} onMouseLeave={onMouseLeaveHandler} onContextMenu={onMouseContextHandler} onWheel={onMouseWheelHandler}>
			<div className={css.toolbars}>
				<label>🔍 {scale.x.toFixed(2)} / {scale.y.toFixed(2)}</label>
			</div>
			<div className={css.desktop} style={styleForDesktop}>
				{desktop}
			</div>
		</div>
	)
}

export default EditorMetrics;