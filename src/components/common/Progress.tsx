import {CustomHTMLAttributes} from "../types/CustomHTMLAttributes";
import css from "./Progress.module.scss";

type ProgressPropsCustom = 
{
	progress: number;
	max?: number;
	color?: string;
}
type ProgressProps = CustomHTMLAttributes & ProgressPropsCustom;

const Progress = ({className, progress, color = "#f00", max = 100}: ProgressProps) : JSX.Element =>
{
	const percent = (progress / max * 100).toFixed(2);
	const classNameForBar = [className, css.bar].join(" ");
	const styleForProgress = {width: `${percent}%`, backgroundColor: color}
	return (
		<div className={classNameForBar}>
			<div className={css.bar} style={styleForProgress}></div>
		</div>
	)
}

export default Progress;