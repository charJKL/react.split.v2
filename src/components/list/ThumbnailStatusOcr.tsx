import { CustomHTMLAttributes } from "../types/CustomHTMLAttributes";
import { Ocr } from "../../store/slice.ocrs";
import css from "./ThumbnailStatusOcr.module.scss";

type ThumbnailStatusOcrPropsCustom = 
{
	ocr: Ocr;
}
type ThumbnailStatusOcrProps = CustomHTMLAttributes & ThumbnailStatusOcrPropsCustom;

const ThumbnailStatusOcr = ({className, ocr}: ThumbnailStatusOcrProps) : JSX.Element => 
{
	var status = null;
	switch(ocr.status)
	{
		case "Idle":
			break;
		
		case "Preprocessing":
		case "Initializaing":
			status = 'init';
			break;
			
		case "Parsing":
			const percent = ocr.details as number * 100;
			status = `${percent.toFixed(0)}%`;
			break;
		
		case "Parsed":
			status = <div className={css.check}>🗸</div>;
			break;
			
		case "Error":
			status = <div className={css.error}>🗴</div>
			break;
	}
	
	const classNameForDiv = [className, css.div].join(" ");
	return (
		<div className={classNameForDiv}>
			{status}
		</div>
	)
}

export default ThumbnailStatusOcr;