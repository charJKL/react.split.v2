import { MouseEvent } from "react"; 
import {CustomElement, CustomElementProps} from "../../type/CustomElement";
import { useAppSelector, useAppDispatch } from "../../store/store.hooks";
import { isPageLoaded, selectSelectedPage } from "../../store/slice.pages";
import { selectMetricsForPage } from "../../store/slice.metrics";
import { readPage, selectOcrForPage } from "../../store/slice.ocrs";
import EditorTextStatus from "./EditorTextStatus";
import css from "./EditorText.module.scss";

const EditorText : CustomElement = ({className, style} : CustomElementProps) : JSX.Element =>
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
	
	var status : JSX.Element = <></>;
	var desktop : JSX.Element = <></>;
	
	if(ocr)
	{
		status = <EditorTextStatus className={css.status} status={ocr.status} details={ocr.details}/>;
	}
	if(page && ocr && page.status === "Loaded")
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
				<label><button onClick={onProcessHandler}>Proccess file</button></label>
			</div>
			<div className={css.desktop}>
				{desktop}
			</div>
		</div>
	)
}

export default EditorText;
