import { useAppSelector,  } from "../../store/store.hooks";
import { selectSelectedPage } from "../../store/slice.pages";
import { isOcrIdle, isOcrNotIdle, isOcrParsed, selectOcrForPage } from "../../store/slice.ocrs";
import EditorTextStatus from "./EditorTextStatus";
import EditorTextProcessButton from "./EditorTextProcessButton";
import css from "./EditorText.module.scss";

interface EditorTextProps
{
	style?: {width: number};
}

const EditorText = ({style} : EditorTextProps) : JSX.Element =>
{
	const page = useAppSelector(selectSelectedPage);
	const ocr = useAppSelector(selectOcrForPage(page ? page.id : ""));
	
	var toolbars: Array<JSX.Element> = [];
	var layers: Array<JSX.Element> = [];
	if(page && ocr && isOcrIdle(ocr))
	{
		layers.push(<div key="editor-text-button" className={css.empty}><EditorTextProcessButton className={css.button} placement="desktop">Proccess file</EditorTextProcessButton></div>);
	}
	if(page && ocr && isOcrNotIdle(ocr))
	{
		layers.push(<EditorTextStatus key="editor-text-status" className={css.status} status={ocr.status} details={ocr.details}/>);
		toolbars.push(<EditorTextProcessButton className={css.button} placement="toolbar">Proccess file</EditorTextProcessButton>);
	}
	if(page && ocr && isOcrParsed(ocr))
	{
		layers.push(<div key="editor-text-results" className={css.text}>{ocr.lines.map((line, i) => <div className={css.line} key={i}>{line.text}</div>)}</div>);
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
