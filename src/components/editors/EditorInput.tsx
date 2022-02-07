import { ChangeEvent } from "react";
import { CustomHTMLAttributes } from "../types/CustomHTMLAttributes";
import { useAppSelector, useAppDispatch } from "../../store/store.hooks";
import { selectSelectedPage } from "../../store/slice.pages";
import { MetricName, selectMetricsForPage, updateMetricValue } from "../../store/slice.metrics";
import css from "./EditorInput.module.scss";

const EditorInput = ({className}: CustomHTMLAttributes) =>
{
	const page = useAppSelector(selectSelectedPage);
	const metrics = useAppSelector(selectMetricsForPage(page));
	const dispatch = useAppDispatch();
	const isDisabled = page === null;

	const onChangeName = (e: ChangeEvent<HTMLInputElement>) =>
	{
		console.log("on-chnage-name", e);
	}
	const onChangeMetricValue = (e: ChangeEvent<HTMLInputElement>) =>
	{
		if(page && metrics)
		{
			const id = page.id;
			const metric = e.target.name as MetricName;
			const value = parseFloat(e.target.value);
			dispatch(updateMetricValue({id, metric, value}));
		}
	}
	
	const name = page ? page.name : "";
	const x1 = metrics ? metrics.x1 : 0;
	const x2 = metrics ? metrics.x2 : 0;
	const y1 = metrics ? metrics.y1 : 0;
	const y2 = metrics ? metrics.y2 : 0;
	const rotate = metrics ? metrics.rotate : 0;
	
	const classForEditor = [css.editor, className].join(" ");
	return (
		<div className={classForEditor}>
			<label> name: <input name="name" type="text" value={name} onChange={onChangeName} /></label>
			<label>x1: <input name="x1" type="number" disabled={isDisabled} value={x1.toFixed(0)} onChange={onChangeMetricValue}/></label>
			<label>x2: <input name="x2" type="number" disabled={isDisabled} value={x2.toFixed(0)} onChange={onChangeMetricValue}/></label>
			<label>y1: <input name="y1" type="number" disabled={isDisabled} value={y1.toFixed(0)} onChange={onChangeMetricValue}/></label>
			<label>y2: <input name="y2" type="number" disabled={isDisabled} value={y2.toFixed(0)} onChange={onChangeMetricValue}/></label>
			<label>rotate: <input name="rotate" type="number" step="0.1" disabled={isDisabled} value={rotate.toFixed(2)} onChange={onChangeMetricValue}/></label>
		</div>
	)
}

export default EditorInput;