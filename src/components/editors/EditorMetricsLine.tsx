import React from "react";
import { MetricLineNames } from "../../store/slice.metrics";
import css from "./EditorMetricsLine.module.scss";

type LineType = "horizontal" | "vertical";

type LineProps = 
{
	name: MetricLineNames;
	type: LineType;
	value: number;
	offset: number;
	isHover: boolean;
}

const EditorMetricsLine = ({name, type, value, offset, isHover}: LineProps) : JSX.Element =>
{
	const points = resolvePointsPositions(type, value, offset);
	const styleForLine = isHover ? {stroke: "rgba(255, 50, 50, 1)"} : {};
	return (
		<line className={css.line} style={styleForLine} x1={points.x1} y1={points.y1} x2={points.x2} y2={points.y2} />
	)
}

const resolvePointsPositions = (type: LineType, value: number, offset: number ) => 
{
	switch(type)
	{
		case "horizontal":
			return {
				x1: "0",
				x2: "100%",
				y1: (offset + value).toString(),
				y2: (offset + value).toString(),
			}
			
		case "vertical":
			return {
				x1: (offset + value).toString(),
				x2: (offset + value).toString(),
				y1: "0",
				y2: "100%",
			}
	}
}

export default React.memo(EditorMetricsLine);