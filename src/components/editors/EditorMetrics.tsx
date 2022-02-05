import React, { useRef, MouseEvent, useState, WheelEvent } from "react";
import { CustomHTMLAttributes } from "../types/CustomHTMLAttributes";
import { useAppSelector, useAppDispatch } from "../../store/store.hooks";
import { selectSelectedPage } from "../../store/slice.pages";
import { Metric, MetricLineNames, selectMetricsForPage, updateMetricValue } from "../../store/slice.metrics";
import { Scale } from "./types/Scale";
import { Size } from "./types/Size";
import { MouseButton } from "./types/MouseButton";
import EditorMetricsLine from "./EditorMetricsLine";
import useGetBoundingRect from "../hooks/useGetBoundingRect";
import useGetPageSize from "./hooks/useGetPageSize";
import useCursorPosition from "./hooks/useCursorPosition";
import useResolveObjectBeingHovered from "./hooks/useResolveObjectBeingHovered";
import useGetDesktopPosition from "./hooks/useGetDesktopPosition";
import useGetScale from "./hooks/useGetScale";
import useGetMouseMoveDistance from "./hooks/useGetMouseMoveDistance";
import css from "./EditorMetrics.module.scss";
import Editor from "./Editor";

type SelectableObject = MetricLineNames | null;

const EditorMetrics = ({style} : CustomHTMLAttributes): JSX.Element =>
{
	const page = useAppSelector(selectSelectedPage);
	const metrics = useAppSelector(selectMetricsForPage(page));
	const dispatch = useAppDispatch();
	
	const editorRef = useRef<HTMLDivElement>(null);
	const desktopRef = useRef<HTMLDivElement>(null);
	
	const editorRect = useGetBoundingRect(editorRef);
	const pageSize = useGetPageSize(page);
	const [desktopPosition, isPositioning] = useGetDesktopPosition(editorRef, desktopRef);
	const [scale, isScaling] = useGetScale(editorRef, desktopRef, editorRect, pageSize);
	const {cursor: cursorPosition} = useCursorPosition(editorRect, desktopPosition);
	
	const scaledDesktopSize = applayScaleToSize(pageSize, scale);
	const scaledMetrics = applayScaleToMetrics(metrics, scale);
	
	const [objectSelected, selectObject] = useState<SelectableObject>(null);
	const objectHovered = useResolveObjectBeingHovered(scaledMetrics, objectSelected, cursorPosition);

	const [distance] = useGetMouseMoveDistance(MouseButton.Left);

	const mousedown = (e: MouseEvent) =>
	{
		if(objectHovered && e.button === MouseButton.Left)
		{
			selectObject(objectHovered);
		}
	}
	const mousemove = (e: MouseEvent) =>
	{
		if(page && metrics && objectHovered && objectSelected)
		{
			switch(objectSelected)
			{
				case "x1":
				case "x2": {
					const id = page.id;
					const metric = objectSelected;
					const value = metrics[metric] + distance.left / scale.x;
					dispatch(updateMetricValue({id, metric, value}));
					return; }
					
				case "y1":
				case "y2": {
					const id = page.id;
					const metric = objectSelected;
					const value = metrics[metric] + distance.top / scale.y;
					dispatch(updateMetricValue({id, metric, value}));
					return; }
			}
		}
	}
	const mouseup = (e: MouseEvent) =>
	{
		if(e.button === MouseButton.Left)
		{
			selectObject(null);
		}
	}
	const mousewheel = (e: WheelEvent) =>
	{
		if(page && metrics && e.buttons === 0)
		{
			const sensitivity = 0.001;
			const id = page.id;
			const metric = "rotate";
			const value = metrics[metric] + e.deltaY * sensitivity;
			dispatch(updateMetricValue({id, metric, value}));
			return;
		}
	}
	
	var toolbars: Array<JSX.Element> = [];
	var desktop : JSX.Element = <></>;
	var metricLines : JSX.Element = <></>;
	
	if(metrics && scaledMetrics)
	{
		const offset = 8;
		const isHover = (name: MetricLineNames) => objectHovered === name;
		const sizeWithOffset = {width: scaledDesktopSize.width + offset * 2, height: scaledDesktopSize.height + offset * 2};
		const positionWithOffset = {left: offset * -1, top: offset * -1}
		const styleForSvg = { ...sizeWithOffset, ...positionWithOffset };
		metricLines = (
			<svg className={css.metricsLine} style={styleForSvg}>
				<EditorMetricsLine name="x1" type="vertical" value={scaledMetrics.x1} offset={offset} isHover={isHover("x1")} />
				<EditorMetricsLine name="x2" type="vertical" value={scaledMetrics.x2} offset={offset} isHover={isHover("x2")} />
				<EditorMetricsLine name="y1" type="horizontal" value={scaledMetrics.y1} offset={offset} isHover={isHover("y1")} />
				<EditorMetricsLine name="y2" type="horizontal" value={scaledMetrics.y2} offset={offset} isHover={isHover("y2")} />
			</svg>
		)
	}
	if(page && metrics && page.status === "Loaded")
	{
		const styleForImage = { transform: `rotate(${metrics.rotate}deg)` }
		desktop = (
			<>
				<img className={css.image} style={styleForImage} src={page.url} alt="" />
				{metricLines}
			</>
		)
	}
	
	const cursor = { cursor: resolveCursor(isScaling, isPositioning, objectHovered, objectSelected) }
	const styleForEditor = { ...style, ...cursor };
	const styleForDesktop = { ...scaledDesktopSize, ...desktopPosition };
	return <Editor desktop={desktop} toolbars={toolbars} />
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

type isScalingType = ReturnType<typeof useGetScale>[1];
const resolveCursor = (isScaling: isScalingType, isPositioning: boolean, isObjectHovered: SelectableObject, isObjectSelected: SelectableObject) =>
{
	if(isObjectSelected) return 'grabbing';
	if(isScaling) return isScaling === "scale-out" ? 'zoom-out' : 'zoom-in';
	if(isObjectHovered) return 'grab';
	if(isPositioning) return 'move';
}

export type { SelectableObject };
export default EditorMetrics;