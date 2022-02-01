import React, { useRef, MouseEvent, WheelEvent } from "react";
import { selectSelectedPage } from "../../store/slice.pages";
import Metrics, { MetricLineNames, selectMetricsForPage } from "../../store/slice.metrics";
import { useAppSelector } from "../../store/store.hooks";
import useGetEditorRect from "./hooks/useGetEditorRect";
import useGetPageSize from "./hooks/useGetPageSize";
import useCursorPosition from "./hooks/useCursorPosition";
import useResolveHoverObject from "./hooks/useResolveHoverObject";
import css from "./EditorMetrics.module.scss";
import EditorMetricsLine from "./EditorMetricsLine";
import useAllowRepositioning from "./hooks/useAllowRepositioning";
import useAllowScale from "./hooks/useAllowScale";

const EditorMetrics = (): JSX.Element =>
{
	const page = useAppSelector(selectSelectedPage);
	const metrics = useAppSelector(selectMetricsForPage(page));
	
	const editorRef = useRef<HTMLDivElement>(null);
	const desktopRef = useRef<HTMLDivElement>(null);
	
	const {size: editorSize, position: editorPosition} = useGetEditorRect(editorRef);
	const pageSize = useGetPageSize(page);
	const {position: desktopPosition, positioning} = useAllowRepositioning(editorRef, desktopRef);
	const {scale, scaling} = useAllowScale(editorRef, desktopRef, editorSize, pageSize);
	
	//const {cursor: cursorPosition, mouseMove: mouseMoveCursor} = useCursorPosition(editorPosition, desktopPosition);
	//const object = useResolveHoverObject(metrics, cursorPosition);
	const object = null;
	
	const cursorPosition = {left: 0, top: 0};
	const desktopSize = { width: pageSize.width * scale.x, height: pageSize.height * scale.y}
	
	var toolbars: Array<JSX.Element> = [];
	var desktop : JSX.Element = <></>;
	var metricLines : JSX.Element = <></>;
	
	if(metrics)
	{
		const offset = 8;
		const isHover = (name: MetricLineNames) => object === name;
		const sizeWithOffset = {width: desktopSize.width + offset * 2, height: desktopSize.height + offset * 2};
		const positionWithOffset = {left: offset * -1, top: offset * -1}
		const styleForSvg = { ...sizeWithOffset, ...positionWithOffset };
		metricLines = (
			<svg className={css.metricsLine} style={styleForSvg}>
				<EditorMetricsLine name="x1" type="vertical" value={metrics.x1 * scale.x} offset={offset} isHover={isHover("x1")} />
				<EditorMetricsLine name="x2" type="vertical" value={metrics.x2 * scale.x} offset={offset} isHover={isHover("x2")} />
				<EditorMetricsLine name="y1" type="horizontal" value={metrics.y1 * scale.y} offset={offset} isHover={isHover("y1")} />
				<EditorMetricsLine name="y2" type="horizontal" value={metrics.y2 * scale.y} offset={offset} isHover={isHover("y2")} />
			</svg>
		)
	}
	if(page && page.status === "Loaded")
	{
		desktop = (
			<>
				<img className={css.image} src={page.url} alt="" />
				{metricLines}
			</>
		)
	}

	const onMouseMove = (e: MouseEvent) =>
	{
		if(object === null) return;
	}
	
	const movingCursor = positioning ? { cursor: 'move'} : {} ;
	const scalingCursor = scaling ? scaling === "scale-out" ? { cursor: 'zoom-out'} : { cursor: 'zoom-in'} : {};
	const styleForEditor = { ...movingCursor, ...scalingCursor };
	const styleForDesktop = { ...desktopSize, ...desktopPosition };
	return (
		<div className={css.editor} style={styleForEditor} ref={editorRef} >
			<div className={css.toolbars}>
				<label>🔍 {scale.x.toFixed(2)} / {scale.y.toFixed(2)}</label>
				<label>➡ {cursorPosition.left.toFixed(2)} / {cursorPosition.top.toFixed(2)}</label>
			</div>
			<div className={css.desktop} style={styleForDesktop} ref={desktopRef}>
				{desktop}
			</div>
		</div>
	)
}

export default EditorMetrics;