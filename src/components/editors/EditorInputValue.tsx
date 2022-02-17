import { ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store.hooks";
import { selectSelectedPage } from "../../store/slice.pages";
import { MetricName, selectMetricsForPage, updateMetricValue } from "../../store/slice.metrics";
import Tooltip from "../common/Tooltip";
import css from "./EditorInputValue.module.scss";


interface EditorInputValueProps 
{
	className?: string;
	name: MetricName;
}

const EditorInputValue = ({className, name}: EditorInputValueProps) : JSX.Element =>
{
	const page = useAppSelector(selectSelectedPage);
	const metrics = useAppSelector(selectMetricsForPage(page ? page.id : ""));
	const dispatch = useAppDispatch();
	const isDisabled = page === null;
	
	const onChangeUpdateMetricValue = (e: ChangeEvent<HTMLInputElement>) =>
	{
		if(page && metrics)
		{
			const id = page.id;
			const name = e.target.name as MetricName;
			const value = parseFloat(e.target.value);
			dispatch(updateMetricValue({id, name, value}));
		}
	}	
	
	let message = <></>
	switch(metrics?.details)
	{
		case "x1>x2": message = <p>Wartość x1 nie może być większa od x2</p>; break;
		case "x2<x1": message = <p>Wartość x2 nie może być mniejsza do x1</p>; break;
		case "y1>y2": message = <p>Wartość y1 nie może być większa od x2</p>; break;
		case "y2<y1": message = <p>Wartość y2 nie może być mnniejsza od y1</p>; break;
	}
	
	const isInvalid = metrics?.details?.startsWith(name) ?? false;
	const value = metrics?.[name] ?? 0;
	const attrValue = name === "rotate" ? value.toFixed(2) : value.toFixed(0);
	const invalidClass = isInvalid ? css.invalid : "";
	const classNameForWrapper = [className, css.wrapper].join(" ");
	const classNameForInput = [css.input, invalidClass].join(" ");
	return (
		<div className={classNameForWrapper}>
			<input className={classNameForInput} name={name} type="Number" disabled={isDisabled} value={attrValue} onChange={onChangeUpdateMetricValue} />
			<Tooltip show={isInvalid} alignment="bottom-center" width="150%">{message}</Tooltip>
		</div>
	)
}

export default EditorInputValue;