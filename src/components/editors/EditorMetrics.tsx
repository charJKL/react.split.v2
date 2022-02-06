import React, { useRef, MouseEvent, useState, WheelEvent, useCallback } from "react";
import { CustomHTMLAttributes } from "../types/CustomHTMLAttributes";
import { useAppSelector, useAppDispatch } from "../../store/store.hooks";
import { Page, selectSelectedPage } from "../../store/slice.pages";
import { Metric, MetricLineNames, selectMetricsForPage, updateMetricValue } from "../../store/slice.metrics";
import { Scale } from "./types/Scale";
import { Size } from "./types/Size";
import { isLeftButtonClicked, isNoneButtonPressed, MouseButton } from "../types/MouseButton";
import useGetBoundingRect from "../hooks/useGetBoundingRect";
import useGetPageSize from "./hooks/useGetPageSize";
import useCursorPosition from "./hooks/useCursorPosition";
import useResolveObjectBeingHovered from "./hooks/useResolveObjectBeingHovered";
import useGetDesktopPosition from "./hooks/useGetDesktopPosition";
import useGetScale from "./hooks/useGetScale";
import EditorMetricPage from "./EditorMetricsPage";
import EditorMetricLines from "./EditorMetricLines";
import css from "./EditorMetrics.module.scss";
import useRefElement from "./../hooks/useRefElement";

type SelectableObject = MetricLineNames | null;
type LayerProps = {className: string, page: Page, metric: Metric, desktopSize: Size};
const EditorMetrics = ({className, style} : CustomHTMLAttributes): JSX.Element =>
{
	const page = useAppSelector(selectSelectedPage);
	const metrics = useAppSelector(selectMetricsForPage(page));
	const dispatch = useAppDispatch();
	
	const [editorRef, setEditorRef] = useRefElement<HTMLDivElement>(null);
	const [desktopRef, setDesktopRef] = useRefElement<HTMLDivElement>(null);
	const editorSize = useGetBoundingRect(editorRef);

	const desktopInitalPosition = {left: 0, top: 0};
	const [desktopPosition, isPositioning] = useGetDesktopPosition(editorRef, desktopInitalPosition);
	
	const pageSize = useGetPageSize(page);
	const initalScale = calculateScale(editorSize, pageSize);
	const [scale, isScaling] = useGetScale(editorRef, initalScale);
	const scaledDesktopSize = applayScaleToSize(pageSize, scale);
	const scaledMetrics = applayScaleToMetrics(metrics, scale);
	
	const cursorPosition = useCursorPosition(editorRef, desktopRef);
	const [objectSelected, selectObject] = useState<SelectableObject>(null);
	const objectHovered = useResolveObjectBeingHovered(scaledMetrics, objectSelected, cursorPosition);

	const mousedown = (e: MouseEvent) =>
	{
		if(objectHovered && isLeftButtonClicked(e)) selectObject(objectHovered);
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
					const value = metrics[metric] + e.movementX / scale.x;
					dispatch(updateMetricValue({id, metric, value}));
					return; }
					
				case "y1":
				case "y2": {
					const id = page.id;
					const metric = objectSelected;
					const value = metrics[metric] + e.movementY / scale.y;
					dispatch(updateMetricValue({id, metric, value}));
					return; }
			}
		}
	}
	const mouseup = (e: MouseEvent) =>
	{
		if(isLeftButtonClicked(e)) selectObject(null);
	}
	const mousewheel = (e: WheelEvent) =>
	{
		if(page && metrics && isNoneButtonPressed(e))
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
	var layers: Array<JSX.Element> = [];
	
	if(page && scaledMetrics && page.status === "Loaded")
	{
		layers.push(<EditorMetricPage key="editor-metric-page" className={css.image} page={page} metric={scaledMetrics} desktopSize={scaledDesktopSize} />);
		toolbars.push(<>🔍 {scale.x.toFixed(2)} / {scale.y.toFixed(2)}</>);
		toolbars.push(<>➡ {cursorPosition.left.toFixed(2)} / {cursorPosition.top.toFixed(2)}</>);
	}
	if(page && metrics && scaledMetrics)
	{
		layers.push(<EditorMetricLines key="editor-metric-lines" className={css.metricLines} page={page} metric={scaledMetrics} desktopSize={scaledDesktopSize} objectHovered={objectHovered}/>)
	}
	
	const cursor = { cursor: resolveCursor(isScaling, isPositioning, objectHovered, objectSelected) }
	const styleForEditor = { ...style, ...cursor };
	const styleForDesktop = { ...scaledDesktopSize, ...desktopPosition };
	const classNameForEditor = [className, css.editor].join(" ");
	return (
		<div className={classNameForEditor} style={styleForEditor} ref={setEditorRef} onMouseDown={mousedown} onMouseMove={mousemove} onMouseUp={mouseup} onWheel={mousewheel}>
			<div className={css.toolbars}>
				{ toolbars.map((toolbar, i) => <label key={i}>{ toolbar }</label> ) }
			</div>
			<div className={css.desktop} style={styleForDesktop} ref={setDesktopRef}>
				{ layers.map((layer) => layer ) }
			</div>
		</div>
	)
}

const calculateScale = (viewport: Size, size: Size) : Scale =>
{
	if(size.width === 0 || size.height === 0) return {x: 1, y: 1}

	const x = viewport.width / size.width;
	const y = viewport.height / size.height;
	const ratio = Math.min(x, y);
	return {x: ratio, y: ratio};
}

const applayScaleToSize = (element: Size, scale : Scale) =>
{
	const scaled = { ...element };
			scaled.width = element.width * scale.x;
			scaled.height = element.height * scale.y;
	return scaled;
}

const applayScaleToMetrics = (metric: Metric | null, scale: Scale) =>
{
	if(metric === null) return null;
	const scaled = { ...metric };
			scaled.x1 = metric.x1 * scale.x;
			scaled.x2 = metric.x2 * scale.x;
			scaled.y1 = metric.y1 * scale.y;
			scaled.y2 = metric.y2 * scale.y;
	return scaled;
}

type isScalingType = ReturnType<typeof useGetScale>[1];
const resolveCursor = (isScaling: isScalingType, isPositioning: boolean, isObjectHovered: SelectableObject, isObjectSelected: SelectableObject) =>
{
	if(isObjectSelected) return 'grabbing';
	if(isScaling) return isScaling === "scale-out" ? 'zoom-out' : 'zoom-in';
	if(isObjectHovered) return 'grab';
	if(isPositioning) return 'move';
}

export type { SelectableObject, LayerProps };
export default EditorMetrics;