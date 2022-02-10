import { CustomHTMLAttributes } from "../../types";
import { Ocr } from "../../store/slice.ocrs";
import css from "./ThumbnailStatusText.module.scss";

interface ThumbnailStatusTextProps extends CustomHTMLAttributes
{
	ocr: Ocr;
}

const ThumbnailStatusText = ({className, ocr}: ThumbnailStatusTextProps) : JSX.Element => 
{
	var status = null;
	switch(ocr.status)
	{
		case "Idle":
			break;
		
		case "Preprocessing":
		case "Initializaing":
			status = <div className={css.init}>init</div>;
			break;
			
		case "Parsing":
			const percent = ocr.details as number * 100;
			status = <div className={css.parsing}>{percent.toFixed(0)}%</div>; 
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

export default ThumbnailStatusText;