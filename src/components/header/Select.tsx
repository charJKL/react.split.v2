import { ChangeEvent, MouseEvent } from "react";
import css from "./Select.module.scss";
import { useState } from "react";
import { useAppSelector } from "../../store/store.hooks";
import { selectSelectedProject } from "../../store/slice.projects";

interface SelectProps 
{
	className?: string;
	children: React.ReactNode;
}

const Select = ({className, children} : SelectProps) : JSX.Element =>
{
	const project = useAppSelector(selectSelectedProject);
	const [isOpen, setOpen] = useState<boolean>(false);
	
	const onChangeProjectName = (e: ChangeEvent<HTMLInputElement>) =>
	{
		const value = e.target.value;
		console.log(value);
	}
	const onMousemoveOpenList = (e: MouseEvent<HTMLDivElement>) =>
	{
		setOpen(true);
	}
	const onMouseLeaveCloseList = (e: MouseEvent<HTMLDivElement>) =>
	{
		setOpen(false);
	}
	
	const name = project ? project.name : "";
	const isListOpen = isOpen ? "block" : "none";
	const styleForOptions = {display: isListOpen }
	const classNameForSelect = [className, css.select].join(" ");
	return (
		<div className={classNameForSelect} onMouseEnter={onMousemoveOpenList} onMouseLeave={onMouseLeaveCloseList}>
			<div className={css.input}>
				<input type="text" value={name} onChange={onChangeProjectName} />
				<div>{ isOpen ? '▼' : '◄' }</div>
			</div>
			<div className={css.options} style={styleForOptions}>
				{children}
			</div>
		</div>
	)
}

export default Select;