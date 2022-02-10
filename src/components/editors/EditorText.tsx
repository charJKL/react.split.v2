import { MouseEvent } from "react"; 
import { useAppSelector, useAppDispatch } from "../../store/store.hooks";
import { isPageLoaded, selectSelectedPage } from "../../store/slice.pages";
import { selectMetricsForPage } from "../../store/slice.metrics";
import { isOcrIdle, isOcrNotIdle, isOcrParsed, readPage, selectOcrForPage } from "../../store/slice.ocrs";
import EditorTextStatus from "./EditorTextStatus";
import css from "./EditorText.module.scss";

interface EditorTextProps
{
	style?: {width: number};
}

const EditorText = ({style} : EditorTextProps) : JSX.Element =>
{
	const page = useAppSelector(selectSelectedPage);
	const metrics = useAppSelector(selectMetricsForPage(page ? page.id : ""));
	const ocr = useAppSelector(selectOcrForPage(page ? page.id : ""));
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
	var layers: Array<JSX.Element> = [];
	if(page && ocr && isOcrIdle(ocr))
	{
		layers.push(<div className={css.empty}><button className={css.button} onClick={onProcessHandler}>Proccess file</button></div>);
	}
	if(page && ocr && isOcrNotIdle(ocr))
	{
		layers.push(<EditorTextStatus className={css.status} status={ocr.status} details={ocr.details}/>);
		toolbars.push(<button onClick={onProcessHandler}>Proccess file</button>);
	}
	if(page && ocr && isOcrParsed(ocr))
	{
		layers.push(<div className={css.text}>{ocr.lines.map((line, i) => <div className={css.line} key={i}>{line.text}</div>)}</div>);
	}
	const styleForEditor = { ...style };
	const styleForDesktop = { };
	return (
		<div className={css.editor} style={styleForEditor}>
			<div className={css.toolbars}>
				{ toolbars.map((toolbar, i) => <label key={i}>{ toolbar }</label> ) }
			</div>
			<div className={css.desktop} style={styleForDesktop}>
				{ layers.map((layer) => layer ) }
			</div>
		</div>
	)
}

export default EditorText;
