import {LayerProps, SelectableObject} from "./EditorMetrics";
import EditorMetricsLine from "./EditorMetricsLine";

type EditorMetricLinesPropsCustom = 
{
	objectHovered: SelectableObject
}
type EditorMetricLinesProps = LayerProps & EditorMetricLinesPropsCustom;

const EditorMetricLines = ({className, page, metric, desktopSize, objectHovered}: EditorMetricLinesProps) : JSX.Element=>
{
	const offset = 8;
	const isHover = (name: SelectableObject) => objectHovered === name;
	const sizeWithOffset = {width: desktopSize.width + offset * 2, height: desktopSize.height + offset * 2};
	const positionWithOffset = {left: offset * -1, top: offset * -1}
	const styleForSvg = { ...sizeWithOffset, ...positionWithOffset };
	return (
		<svg className={className} style={styleForSvg}>
			<EditorMetricsLine name="x1" type="vertical" value={metric.x1} offset={offset} isHover={isHover("x1")} />
			<EditorMetricsLine name="x2" type="vertical" value={metric.x2} offset={offset} isHover={isHover("x2")} />
			<EditorMetricsLine name="y1" type="horizontal" value={metric.y1} offset={offset} isHover={isHover("y1")} />
			<EditorMetricsLine name="y2" type="horizontal" value={metric.y2} offset={offset} isHover={isHover("y2")} />
		</svg>
	)
}

export default EditorMetricLines;