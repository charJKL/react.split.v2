import { CustomHTMLAttributes } from "../types/CustomHTMLAttributes";
import { Metric } from "../../store/slice.metrics";
import css from "./ThumbnailStatusMetrics.module.scss";

type ThumbnailStatusMetricsPropsCustom = 
{
	metric: Metric;
}
type ThumbnailStatusMetricsProps = CustomHTMLAttributes & ThumbnailStatusMetricsPropsCustom;

const ThumbnailStatusMetrics = ({className, metric}: ThumbnailStatusMetricsProps) : JSX.Element => 
{
	const classNameForDiv = [className, css.div].join(" ");
	return (
		<div className={classNameForDiv}>
			{metric.wasEdited && <div className={css.checked}>🗸</div>}
		</div>
	)
}

export default ThumbnailStatusMetrics;
