import { Ocr } from "../../store/slice.ocrs";
import Progress from "../common/Progress";
import css from "./EditorTextStatus.module.scss";

interface EditorTextStatusProps 
{
	className?: string;
	status: Ocr['status'];
	details: Ocr['details'];
}

const EditorTextStatus = ({className, status, details}: EditorTextStatusProps) : JSX.Element =>
{
	const classForStatus = [className, css.block].join(" ");

	switch(status)
	{
		case "Idle":
			return <></>;
		
		case "Preprocessing":
		case "Initializaing":
		case "Error":
			return (
			<div className={classForStatus}>
				<div className={css.status}>{status}</div>
				<div className={css.details}>{details}</div>
			</div>)
			
		case "Parsing":
			const percent = (details as number * 100);
			return (
			<div className={classForStatus}>
				<div className={css.status}>{status}</div>
				<div className={css.details}>{percent.toFixed(0)} / 100 %</div>
				<Progress className={css.progress} progress={percent} />
			</div>)
		
		case "Parsed":
			return <></>;
	}
}

export default EditorTextStatus;