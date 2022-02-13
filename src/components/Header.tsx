import React from "react";
import {CustomHTMLAttributes} from "../types";
import { useAppDispatch, useAppSelector } from "../store/store.hooks";
import { loadFile } from "../store/store.file";
import { selectProjects } from "../store/slice.projects";
import LoadFileInput from "./common/LoadFileInput";
import Select from "./header/Select";
import ProjectOption from "./header/ProjectOption";
import css from "./Header.module.scss";

const Header = ({className} : CustomHTMLAttributes) : JSX.Element => 
{
	const projects = useAppSelector(selectProjects);
	const dispatch = useAppDispatch();
	
	const onFilesHandler = (files: Array<File>) =>
	{
		dispatch(loadFile(files));
	}
	
	/*
	const onProjectChange = (e: ChangeEvent) =>
	{
		console.log('sss');
	}
	*/
	
	const cssHeader = [className, css.header].join(' ');
	return (
		<header className={cssHeader}>
			<Select className={css.select}>
				{ projects.map((projectId) => <ProjectOption key={projectId} projectId={projectId}/>) }
			</Select>
			
			<LoadFileInput className={css.load} onFiles={onFilesHandler}>Load file</LoadFileInput>
		</header>
	);
}
export default Header;