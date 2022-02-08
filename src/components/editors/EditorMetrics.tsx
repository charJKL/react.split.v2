import {MouseEvent, useState, WheelEvent, ChangeEvent } from "react";
import { CustomHTMLAttributes } from "../types/CustomHTMLAttributes";
import { useAppSelector, useAppDispatch } from "../../store/store.hooks";
import { Page, selectSelectedPage } from "../../store/slice.pages";
import { Metric, MetricLineNames, selectMetricsForPage, updateMetricValue, updateStatus } from "../../store/slice.metrics";
import { Size } from "./types/Size";
import { isLeftButtonClicked, isNoneButtonPressed } from "../types/MouseButton";
import { calculateScale, applayScaleToSize, applayScaleToMetrics} from "./Editor";
import useGetBoundingRect from "../hooks/useGetBoundingRect";
import useGetPageSize from "./hooks/useGetPageSize";
import useCursorPosition from "./hooks/useCursorPosition";
import useResolveObjectBeingHovered from "./hooks/useResolveObjectBeingHovered";
import useGetDesktopPosition from "./hooks/useGetDesktopPosition";
import useGetScale from "./hooks/useGetScale";
import LayerPage from "./LayerPage";
import LayerLines from "./LayerLines";
import LayerHighlight from "./LayerHighlight";
import css from "./EditorMetrics.module.scss";
import useRefElement from "./../hooks/useRefElement";

type SelectableObject = MetricLineNames | null;
type LayerProps = {className: string, page: Page, metric: Metric, desktopSize: Size};
const EditorMetrics = ({className, style} : CustomHTMLAttributes): JSX.Element =>
{
	const page = useAppSelector(selectSelectedPage);
	const metric = useAppSelector(selectMetricsForPage(page));
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
	const scaledMetrics = applayScaleToMetrics(metric, scale);
	
	const cursorPosition = useCursorPosition(editorRef, desktopRef);
	const [objectSelected, selectObject] = useState<SelectableObject>(null);
	const objectHovered = useResolveObjectBeingHovered(scaledMetrics, objectSelected, cursorPosition);

	const onMouseDown = (e: MouseEvent) =>
	{
		if(objectHovered && isLeftButtonClicked(e)) selectObject(objectHovered);
	}
	const onMouseMove = (e: MouseEvent) =>
	{
		if(page && metric && objectHovered && objectSelected)
		{
			switch(objectSelected)
			{
				case "x1":
				case "x2": {
					const id = page.id;
					const name = objectSelected;
					const value = metric[name] + e.movementX / scale.x;
					dispatch(updateMetricValue({id, name, value}));
					return; }
					
				case "y1":
				case "y2": {
					const id = page.id;
					const name = objectSelected;
					const value = metric[name] + e.movementY / scale.y;
					dispatch(updateMetricValue({id, name, value}));
					return; }
			}
		}
	}
	const onMouseUp = (e: MouseEvent) =>
	{
		if(isLeftButtonClicked(e)) selectObject(null);
	}
	const onWheel = (e: WheelEvent) =>
	{
		if(page && metric && isNoneButtonPressed(e))
		{
			const sensitivity = 0.001;
			const id = page.id;
			const name = "rotate";
			const value = metric[name] + e.deltaY * sensitivity;
			dispatch(updateMetricValue({id, name, value}));
			return;
		}
	}
	const onChangeWasEdited = (e: ChangeEvent<HTMLInputElement>) =>
	{
		if(page && metric)
		{
			const id = page.id;
			const status = "Edited";
			dispatch(updateStatus({id, status}));
			return;
		}
	}
	
	var toolbars: Array<JSX.Element> = [];
	var layers: Array<JSX.Element> = [];
	
	if(page && scaledMetrics && page.status === "Loaded")
	{
		layers.push(<LayerPage key="editor-metric-page" className={css.page} page={page} metric={scaledMetrics} desktopSize={scaledDesktopSize} />);
		toolbars.push(<>🔍 {scale.x.toFixed(2)} / {scale.y.toFixed(2)}</>);
		toolbars.push(<>➡ {cursorPosition.left.toFixed(2)} / {cursorPosition.top.toFixed(2)}</>);
	}
	if(page && metric && scaledMetrics)
	{
		layers.push(<LayerLines key="editor-metric-lines" className={css.metricLines} page={page} metric={scaledMetrics} desktopSize={scaledDesktopSize} objectHovered={objectHovered}/>)
		//toolbars.push(<div className={css.toolbarWasEdited}><input type="checkbox" id="" checked={metric.wasEdited} onChange={onChangeWasEdited}/> was edited</div>);
	}
	if(page && metric && scaledMetrics)
	{
		layers.push(<LayerHighlight key="editor-metric-highlight" className={css.highlight} page={page} metric={scaledMetrics} desktopSize={scaledDesktopSize}/>);
	}
	
	const cursor = { cursor: resolveCursor(isScaling, isPositioning, objectHovered, objectSelected) }
	const styleForEditor = { ...style, ...cursor };
	const styleForDesktop = { ...scaledDesktopSize, ...desktopPosition };
	const classNameForEditor = [className, css.editor].join(" ");
	return (
		<div className={classNameForEditor} style={styleForEditor} ref={setEditorRef} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onWheel={onWheel}>
			<div className={css.toolbars}>
				{ toolbars.map((toolbar, i) => <label key={i}>{ toolbar }</label> ) }
			</div>
			<div className={css.desktop} style={styleForDesktop} ref={setDesktopRef}>
				{ layers.map((layer) => layer ) }
			</div>
		</div>
	)
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