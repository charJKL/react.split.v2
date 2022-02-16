import React, {MouseEvent, useLayoutEffect} from "react";
import { useAppDispatch, useAppSelector } from "../../store/store.hooks";
import { selectTooltip, updateTooltip } from "../../store/slice.gui";
import { createProject } from "../../store/slice.projects";
import Tooltip from "../common/Tooltip";
import css from "./NewProjectButton.module.scss";

interface NewProjectbuttonProps 
{
	className?: string;
	children: React.ReactNode;
}

const NewProjectButton = ({className, children}: NewProjectbuttonProps) : JSX.Element=>
{
	const showStartHereTooltip = useAppSelector(selectTooltip("startHere"));
	const dispatch = useAppDispatch();
	
	const onClickCreateNewProject = (e: MouseEvent<HTMLButtonElement>) =>
	{
		dispatch(createProject());
		dispatch(updateTooltip({tooltip: "startHere", value: false})); // it's importat to dispose popup after creating new project.
	}
	
	const classNameForWrapper = [className, css.wrapper].join(" ");
	return (
		<div className={classNameForWrapper}>
			<button className={css.button} onClick={onClickCreateNewProject}>{children}</button>
			<Tooltip show={showStartHereTooltip} alignment="top-left" width="190%">
				<p>Start here from creating new project.</p>
			</Tooltip>
		</div>
	);
}

export default NewProjectButton;