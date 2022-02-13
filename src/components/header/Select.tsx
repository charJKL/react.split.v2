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
	const [isOpen, setOpen] = useState<boolean>(true);
	
	const onChangeProjectName = (e: ChangeEvent<HTMLInputElement>) =>
	{
		const value = e.target.value;
		console.log(value);
	}
	const onOpenList = (e: MouseEvent<HTMLDivElement>) =>
	{
		setOpen(state => !state);
	}
	
	const name = project ? project.name : "";
	const classNameForSelect = [className, css.select].join(" ");
	return (
		<div className={classNameForSelect}>
			<div className={css.input}>
				<input type="text" value={name} onChange={onChangeProjectName} />
				<div onClick={onOpenList}>{ isOpen ? '▼' : '◄' }</div>
			</div>
			<div className={css.options}>
				{children}
			</div>
		</div>
	)
}

export default Select;