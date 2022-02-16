import { useState, MouseEvent, WheelEvent } from "react";
import { isLeftButtonClicked, isNoneButtonPressed } from "../../types";
import { useAppDispatch, useAppSelector } from "../../store/store.hooks";
import { MetricLineNames, selectMetricsForPage, updateMetricValue } from "../../store/slice.metrics";
import { selectSelectedPage } from "../../store/slice.pages";
import { applayScaleToMetrics, applayScaleToSize } from "./Editor";
import useRefElement from "../hooks/useRefElement";
import useGetPageSize from "./hooks/useGetPageSize";
import useInitializeSetting from "./hooks/useInitializeSetting";
import useGetDesktopPosition from "./hooks/useGetDesktopPosition";
import useGetScale from "./hooks/useGetScale";
import useCursorPosition from "./hooks/useCursorPosition";
import useResolveObjectBeingHovered from "./hooks/useResolveObjectBeingHovered";
import LayerPage from "./LayerPage";
import LayerHighlight from "./LayerHighlight";
import LayerLines from "./LayerLines";
import css from "./EditorMetrics.module.scss";

interface EditorMetricsProps
{
	style?: {width: number};
}

type SelectableObject = MetricLineNames | null;

const EditorMetrics = ({style}: EditorMetricsProps) : JSX.Element =>
{
	const page = useAppSelector(selectSelectedPage);
	const metric = useAppSelector(selectMetricsForPage(page ? page.id : ""));
	const dispatch = useAppDispatch();
	
	const editorName = "EditorMetrics";
	const pageId = page ? page.id : "";
	const [editorRef, setEditorRef] = useRefElement<HTMLDivElement>(null);
	const [desktopRef, setDesktopRef] = useRefElement<HTMLDivElement>(null);

	useInitializeSetting(editorRef, editorName, pageId);
	const [desktopPosition, isPositioning] = useGetDesktopPosition(editorRef, editorName, pageId);
	const [scale, isScaling] = useGetScale(editorRef, editorName, pageId);
	const pageSize = useGetPageSize(pageId);
	const scaledDesktopSize = pageSize && scale && applayScaleToSize(pageSize, scale);
	const scaledMetrics = metric && scale && applayScaleToMetrics(metric, scale);

	const [objectSelected, selectObject] = useState<SelectableObject>(null);
	const cursorPosition = useCursorPosition(editorRef, desktopRef);
	const objectHovered = useResolveObjectBeingHovered(scaledMetrics, cursorPosition, objectSelected);
	const onMouseDown = (e: MouseEvent) =>
	{
		if(objectHovered && isLeftButtonClicked(e)) selectObject(objectHovered);
	}
	const onMouseMove = (e: MouseEvent) =>
	{
		if(page && metric && scale && objectHovered && objectSelected)
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
	
	var toolbars: Array<JSX.Element> = [];
	var layers: Array<JSX.Element> = [];
	if(page && scaledDesktopSize && scaledMetrics)
	{
		layers.push(<LayerPage key="editor-metric-page" className={css.page} page={page} metric={scaledMetrics} desktopSize={scaledDesktopSize} />);
		layers.push(<LayerHighlight key="editor-metric-highlight" className={css.highlight} page={page} metric={scaledMetrics} desktopSize={scaledDesktopSize}/>);
		layers.push(<LayerLines key="editor-metric-lines" className={css.metricLines} page={page} metric={scaledMetrics} desktopSize={scaledDesktopSize} objectHovered={objectHovered}/>)
		toolbars.push(<>🔍 {scale.x.toFixed(2)} / {scale.y.toFixed(2)}</>);
	}
	
	const styleBorder = page ? {border: "solid 1px #222"} : {};
	const cursor = { cursor: resolveCursor(isScaling, isPositioning, objectHovered, objectSelected) }
	const styleForEditor = { ...style, ...cursor };
	const styleForDesktop = { ...styleBorder, ...scaledDesktopSize, ...desktopPosition };
	return (
		<div className={css.editor} style={styleForEditor} ref={setEditorRef} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onWheel={onWheel}>
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

export type { SelectableObject };
export default EditorMetrics;