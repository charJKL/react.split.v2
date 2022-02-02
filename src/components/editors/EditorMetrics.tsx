import React, { useRef, MouseEvent, useState } from "react";
import { selectSelectedPage } from "../../store/slice.pages";
import Metrics, { Metric, MetricLineNames, selectMetricsForPage, updateMetricValue } from "../../store/slice.metrics";
import { useAppSelector, useAppDispatch } from "../../store/store.hooks";
import useGetEditorRect from "./hooks/useGetEditorRect";
import useGetPageSize from "./hooks/useGetPageSize";
import useCursorPosition from "./hooks/useCursorPosition";
import useResolveSelectObject from "./hooks/useResolveSelectObject";
import css from "./EditorMetrics.module.scss";
import EditorMetricsLine from "./EditorMetricsLine";
import useAllowRepositioning from "./hooks/useAllowRepositioning";
import useAllowScale from "./hooks/useAllowScale";
import { Scale } from "./types/Scale";
import { Size } from "./types/Size";
import { MouseButton } from "./types/MouseButton";
import useGetRelativeMoveDistance from "./hooks/useGetRelativeMoveDistance";


const EditorMetrics = (): JSX.Element =>
{
	const page = useAppSelector(selectSelectedPage);
	const metrics = useAppSelector(selectMetricsForPage(page));
	const dispatch = useAppDispatch();
	
	const editorRef = useRef<HTMLDivElement>(null);
	const desktopRef = useRef<HTMLDivElement>(null);
	
	const {size: editorSize, position: editorPosition} = useGetEditorRect(editorRef);
	const pageSize = useGetPageSize(page);
	const {position: desktopPosition, positioning} = useAllowRepositioning(editorRef, desktopRef);
	const {scale, scaling} = useAllowScale(editorRef, desktopRef, editorSize, pageSize);
	const {cursor: cursorPosition} = useCursorPosition(editorPosition, desktopPosition);

	const desktopSize = applayScaleToSize(pageSize, scale);
	const scaled = applayScaleToMetrics(metrics, scale);
	
	const select = useResolveSelectObject(scaled, cursorPosition);
	const [grab, setGrab] = useState<boolean>(false);
	
	const {distance} = useGetRelativeMoveDistance(MouseButton.left);

	const mousedown = (e: MouseEvent) =>
	{
		if(select && e.button === MouseButton.left)
		{
			setGrab(true);
		}
	}
	const mousemove = (e: MouseEvent) =>
	{
		if(page && metrics && select && grab === true)
		{
			switch(select)
			{
				case "x1":
				case "x2": {
					const id = page.id;
					const metric = select;
					const value = metrics[metric] + distance.left / scale.x;
					dispatch(updateMetricValue({id, metric, value}));
					return; }
					
				case "y1":
				case "y2": {
					const id = page.id;
					const metric = select;
					const value = metrics[metric] + distance.top / scale.y;
					dispatch(updateMetricValue({id, metric, value}));
					return; }
			}
		}
	}
	const mouseup = (e: MouseEvent) =>
	{
		if(e.button === MouseButton.left)
		{
			setGrab(false);
		}
	}
	
	var toolbars: Array<JSX.Element> = [];
	var desktop : JSX.Element = <></>;
	var metricLines : JSX.Element = <></>;
	
	if(metrics && scaled)
	{
		const offset = 8;
		const isHover = (name: MetricLineNames) => select === name;
		const sizeWithOffset = {width: desktopSize.width + offset * 2, height: desktopSize.height + offset * 2};
		const positionWithOffset = {left: offset * -1, top: offset * -1}
		const styleForSvg = { ...sizeWithOffset, ...positionWithOffset };
		metricLines = (
			<svg className={css.metricsLine} style={styleForSvg}>
				<EditorMetricsLine name="x1" type="vertical" value={scaled.x1} offset={offset} isHover={isHover("x1")} />
				<EditorMetricsLine name="x2" type="vertical" value={scaled.x2} offset={offset} isHover={isHover("x2")} />
				<EditorMetricsLine name="y1" type="horizontal" value={scaled.y1} offset={offset} isHover={isHover("y1")} />
				<EditorMetricsLine name="y2" type="horizontal" value={scaled.y2} offset={offset} isHover={isHover("y2")} />
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
	
	const cursor = { cursor: resolveCursor(scaling, positioning, select, grab) }
	const styleForEditor = { ...cursor };
	const styleForDesktop = { ...desktopSize, ...desktopPosition };
	return (
		<div className={css.editor} style={styleForEditor} ref={editorRef} onMouseDown={mousedown} onMouseMove={mousemove} onMouseUp={mouseup}>
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

const applayScaleToSize = (element: Size, scale : Scale) =>
{
	return {
		width: element.width * scale.x,
		height: element.height * scale.y
	}
}

const applayScaleToMetrics = (metric: Metric | null, scale: Scale) =>
{
	if(metric === null) return null;
	return {
		x1: metric.x1 * scale.x,
		x2: metric.x2 * scale.x,
		y1: metric.y1 * scale.y,
		y2: metric.y2 * scale.y
	}
}

type isScalingType = ReturnType<typeof useAllowScale>['scaling'];
type isObjectHoveredType = ReturnType<typeof useResolveSelectObject>;
const resolveCursor = (isScaling: isScalingType, isRepositioning: boolean, isObjectHovered: isObjectHoveredType, isObjectSelected: boolean) =>
{
	if(isObjectSelected) return 'grabbing';
	if(isScaling) return isScaling == "scale-out" ? 'zoom-out' : 'zoom-in';
	if(isObjectHovered) return 'grab';
	if(isRepositioning) return 'move';
}

export default EditorMetrics;