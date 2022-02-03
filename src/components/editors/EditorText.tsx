import { MouseEvent } from "react"; 
import {CustomElement, CustomElementProps} from "../../type/CustomElement";
import { useAppSelector, useAppDispatch } from "../../store/store.hooks";
import { isPageLoaded, selectSelectedPage } from "../../store/slice.pages";
import { selectMetricsForPage } from "../../store/slice.metrics";
import { readPage } from "../../store/slice.ocrs";
import css from "./EditorText.module.scss";

const EditorText : CustomElement = ({className, style} : CustomElementProps) : JSX.Element =>
{
	const page = useAppSelector(selectSelectedPage);
	const metrics = useAppSelector(selectMetricsForPage(page));
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
	
	const classForEditor = [css.editor, className].join(" ");
	return (<div className={classForEditor} style={style}>
		<button onClick={onProcessHandler} style={{margin: '50px'}}>Proccess file</button>
		<canvas id="testing"></canvas>
	</div>)
}


export default EditorText;
