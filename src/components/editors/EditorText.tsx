import { MouseEvent } from "react"; 
import {CustomElement, CustomElementProps} from "../../type/CustomElement";
import { useAppSelector, useAppDispatch } from "../../store/store.hooks";
import { selectSelectedPage } from "../../store/slice.pages";
import { selectMetricsForPage } from "../../store/slice.metrics";
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
			console.log("process file");
			//dispatch()
		}
	}
	
	const classForEditor = [css.editor, className].join(" ");
	return (<div className={classForEditor} style={style}>
		<button onClick={onProcessHandler} style={{margin: '50px'}}>Proccess file</button>
	</div>)
}

export default EditorText;
