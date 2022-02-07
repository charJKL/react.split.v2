import {LayerProps, SelectableObject} from "./EditorMetrics";
import LayerLinesLine from "./LayerLinesLine";

type LayerLinesPropsCustom = 
{
	objectHovered?: SelectableObject
}
type LayerLinesProps = LayerProps & LayerLinesPropsCustom;

const LayerLines = ({className, page, metric, desktopSize, objectHovered = null}: LayerLinesProps) : JSX.Element=>
{
	const offset = 8;
	const isHover = (name: SelectableObject) => objectHovered === name;
	const sizeWithOffset = {width: desktopSize.width + offset * 2, height: desktopSize.height + offset * 2};
	const positionWithOffset = {left: offset * -1, top: offset * -1}
	const styleForSvg = { ...sizeWithOffset, ...positionWithOffset };
	return (
		<svg className={className} style={styleForSvg}>
			<LayerLinesLine name="x1" type="vertical" value={metric.x1} offset={offset} isHover={isHover("x1")} />
			<LayerLinesLine name="x2" type="vertical" value={metric.x2} offset={offset} isHover={isHover("x2")} />
			<LayerLinesLine name="y1" type="horizontal" value={metric.y1} offset={offset} isHover={isHover("y1")} />
			<LayerLinesLine name="y2" type="horizontal" value={metric.y2} offset={offset} isHover={isHover("y2")} />
		</svg>
	)
}

export default LayerLines;