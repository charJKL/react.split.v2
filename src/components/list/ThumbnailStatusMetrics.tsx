import { CustomHTMLAttributes } from "../../types";
import { Metric } from "../../store/slice.metrics";
import css from "./ThumbnailStatusMetrics.module.scss";

interface ThumbnailStatusMetricsProps extends CustomHTMLAttributes
{
	metric: Metric;
}

const ThumbnailStatusMetrics = ({className, metric}: ThumbnailStatusMetricsProps) : JSX.Element => 
{
	let status = null;
	switch(metric.status)
	{
		case "Idle":
			break;
			
		case "Invalid":
			status = <div className={css.invalid}>🗴</div>
			break;
			
		case "Edited":
			status = <div className={css.edited}>🗸</div>
			break;
	}
	
	const classNameForDiv = [className, css.div].join(" ");
	return (
		<div className={classNameForDiv}>
			{status}
		</div>
	)
}

export default ThumbnailStatusMetrics;
