import { MouseEvent } from "react"; 
import { CustomHTMLAttributes } from "../types/CustomHTMLAttributes";
import { useAppSelector, useAppDispatch } from "../../store/store.hooks";
import { isPageLoaded, selectSelectedPage } from "../../store/slice.pages";
import { selectMetricsForPage } from "../../store/slice.metrics";
import { isOcrIdle, isOcrNotIdle, readPage, selectOcrForPage } from "../../store/slice.ocrs";
import EditorTextStatus from "./EditorTextStatus";
import css from "./EditorText.module.scss";

const EditorText = ({className, style} : CustomHTMLAttributes) : JSX.Element =>
{
	const page = useAppSelector(selectSelectedPage);
	const metrics = useAppSelector(selectMetricsForPage(page));
	const ocr = useAppSelector(selectOcrForPage(page));
	const dispatch = useAppDispatch();
	
	const onProcessHandler = (e: MouseEvent) =>
	{
		if(page && metrics)
		{
			if(isPageLoaded(page)) 
			{
				dispatch(readPage({page, metrics}));
			}
		}
	}
	
	var toolbars: Array<JSX.Element> = [];
	var status : JSX.Element = <></>;
	var desktop : JSX.Element = <></>;
	
	if(page && isOcrIdle(ocr))
	{
		desktop = (
			<div className={css.empty}>
				<button className={css.button} onClick={onProcessHandler}>Proccess file</button>
			</div>
		)
	}
	if(page && isOcrNotIdle(ocr))
	{
		toolbars.push(<button onClick={onProcessHandler}>Proccess file</button>);
		status = <EditorTextStatus className={css.status} status={ocr.status} details={ocr.details}/>;
	}
	
	if(page && ocr && ocr.status === "Parsed")
	{
		desktop = (
			<div className={css.text}>
				{ocr.lines.map((line, i) => <div className={css.line} key={i}>{line.text}</div>)}
			</div>
		)
	}
	
	const classForEditor = [css.editor, className].join(" ");
	return (
		<div className={classForEditor} style={style}>
			{ status }
			<div className={css.toolbars}>
				{ toolbars.map((toolbar,i) => <label key={i}>{toolbar}</label>)}
			</div>
			<div className={css.desktop}>
				{desktop}
			</div>
		</div>
	)
}

export default EditorText;
