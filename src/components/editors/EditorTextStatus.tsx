import { CustomHTMLAttributes } from "../types/CustomHTMLAttributes";
import { Ocr } from "../../store/slice.ocrs";
import css from "./EditorTextStatus.module.scss";

type EditorTextStatusPropsExt = {status: Ocr['status'], details: Ocr['details']}
type EditorTextStatusProps = CustomHTMLAttributes & EditorTextStatusPropsExt;

const EditorTextStatus = ({className, status, details, ...props}: EditorTextStatusProps) : JSX.Element =>
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
				<div className={css.progressBar}><div style={{width: `${percent}%`}}></div></div>
			</div>)
		
		case "Parsed":
			return <></>;
		
		
	}
}

export default EditorTextStatus;