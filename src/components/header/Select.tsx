import { useState, ChangeEvent, MouseEvent } from "react";
import { useAppSelector } from "../../store/store.hooks";
import { selectProjects, selectSelectedProject } from "../../store/slice.projects";
import { selectTooltip } from "../../store/slice.gui";
import Tooltip from "../common/Tooltip";
import css from "./Select.module.scss";

interface SelectProps 
{
	className?: string;
	children: React.ReactNode;
}

const Select = ({className, children} : SelectProps) : JSX.Element =>
{
	const project = useAppSelector(selectSelectedProject);
	const projects = useAppSelector(selectProjects);
	const startHereTooltip = useAppSelector(selectTooltip("startHere"));
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
	
	const showStartHereTooltip = startHereTooltip && projects.length > 0 ? true : false;
	const name = project ? project.name : "";
	const isListOpen = isOpen ? "block" : "none";
	const styleForOptions = {display: isListOpen }
	const classNameForSelect = [className, css.select].join(" ");
	return (
		<div className={classNameForSelect} onMouseLeave={onMouseLeaveCloseList}>
			<div className={css.wrapper} onMouseEnter={onMousemoveOpenList}>
				<div className={css.indicator}>{ isOpen ? '▼' : '►' }</div>
				<div className={css.count}>[{projects.length}]</div>
				<input className={css.input} type="text" value={name} onChange={onChangeProjectName} />
			</div>
			<div className={css.options} style={styleForOptions}>
				{children}
			</div>
			<Tooltip alignment="top-left" show={showStartHereTooltip}>
				<p>Or by selecting one of already created.</p>
			</Tooltip>
		</div>
	)
}

export default Select;