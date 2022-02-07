import { CustomHTMLAttributes } from "../types/CustomHTMLAttributes";
import { Metric } from "../../store/slice.metrics";
import css from "./ThumbnailStatusMetric.module.scss";

type ThumbnailStatusMetricPropsCustom = 
{
	metric: Metric;
}
type ThumbnailStatusMetricProps = CustomHTMLAttributes & ThumbnailStatusMetricPropsCustom;

const ThumbnailStatusMetric = ({className, metric}: ThumbnailStatusMetricProps) : JSX.Element => 
{
	
	const classNameForDiv = [className, css.div].join(" ");
	return (
		<div className={classNameForDiv}>
			{metric.wasEdited && <div className={css.checked}>🗸</div>}
		</div>
	)
}

export default ThumbnailStatusMetric;
