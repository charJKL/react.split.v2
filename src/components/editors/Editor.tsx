import {Metric} from "../../store/slice.metrics";
import {Size} from "./types/Size";
import {Scale} from "./types/Scale";

export const calculateScale = (viewport: Size, size: Size) : Scale =>
{
	if(size.width === 0 || size.height === 0) return {x: 1, y: 1}
	
	const x = viewport.width / size.width;
	const y = viewport.height / size.height;
	const ratio = Math.min(x, y);
	return {x: ratio, y: ratio};
}

export const applayScaleToSize = (element: Size, scale : Scale) =>
{
	const scaled = { ...element };
			scaled.width = element.width * scale.x;
			scaled.height = element.height * scale.y;
	return scaled;
}

export const applayScaleToMetrics = (metric: Metric, scale: Scale) =>
{
	const scaled = { ...metric };
			scaled.x1 = metric.x1 * scale.x;
			scaled.x2 = metric.x2 * scale.x;
			scaled.y1 = metric.y1 * scale.y;
			scaled.y2 = metric.y2 * scale.y;
	return scaled;
}