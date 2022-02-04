import { ChangeEvent } from "react";
import { CustomHTMLAttributes } from "../types/CustomHTMLAttributes";
import { useAppSelector } from "../../store/store.hooks";
import { selectSelectedPage } from "../../store/slice.pages";
import { selectMetricsForPage } from "../../store/slice.metrics";
import css from "./EditorInput.module.scss";

const EditorInput = ({className}: CustomHTMLAttributes) =>
{
	const page = useAppSelector(selectSelectedPage);
	const metrics = useAppSelector(selectMetricsForPage(page));
	
	if(page === null || metrics === null) return <></>;
	
	const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) =>
	{
		console.log(e.target.name, e.target.value);
	}
	
	const classForEditor = [css.editor, className].join(" ");
	return (
		<div className={classForEditor}>
			<label> name: <input name="name" type="text" value={page.name} onChange={onChangeHandler} /></label>
			<label>x1: <input name="x1" type="number" value={metrics.x1.toFixed(2)} onChange={onChangeHandler}/></label>
			<label>x2: <input name="x2" type="number" value={metrics.x2.toFixed(2)} onChange={onChangeHandler}/></label>
			<label>y1: <input name="y1" type="number" value={metrics.y1.toFixed(2)} onChange={onChangeHandler}/></label>
			<label>y2: <input name="y2" type="number" value={metrics.y2.toFixed(2)} onChange={onChangeHandler}/></label>
			<label>rotate: <input name="rotate" type="number" value={metrics.rotate.toFixed(2)} onChange={onChangeHandler}/></label>
		</div>
	)
}

export default EditorInput;