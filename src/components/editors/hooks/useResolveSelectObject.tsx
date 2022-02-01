import { MetricLineNames } from "../../../store/slice.metrics";
import { Position } from "../types/Position";

const THRESHOLD = 10;

type ObjectType = MetricLineNames;
type MetricsList = { [Property in MetricLineNames]: number }
const useResolveSelectObject = (metrics: MetricsList | null, cursor: Position) : ObjectType | null =>
{
	if(metrics !== null)
	{
		type Line = { name: MetricLineNames, distance: number };
		const x1: Line = {name: "x1", distance: Math.abs(metrics.x1 - cursor.left)}
		const x2: Line = {name: "x2", distance: Math.abs(metrics.x2 - cursor.left)}
		const y1: Line = {name: "y1", distance: Math.abs(metrics.y1 - cursor.top)}
		const y2: Line = {name: "y2", distance: Math.abs(metrics.y2 - cursor.top)}
		const lines = [x1, x2, y1, y2];
		const findNearestLine = (previous: Line, current: Line) => previous.distance < current.distance ? previous : current;
		const nearestLine = lines.reduce(findNearestLine);
		return nearestLine.distance < THRESHOLD ? nearestLine.name : null;
	}
	return null;
}

export default useResolveSelectObject;
