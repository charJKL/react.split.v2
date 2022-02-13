import { ChangeEvent, MouseEvent, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store.hooks";
import { deleteProject, Project, renameProject, selectProject, selectProjectById, selectSelectedProject } from "../../store/slice.projects";
import css from "./ProjectOption.module.scss"


interface ProjectProps
{
	projectId: string;
}

const ProjectOption = ({projectId}: ProjectProps) : JSX.Element => 
{
	const project = useAppSelector(selectProjectById(projectId)) as Project;
	const selected = useAppSelector(selectSelectedProject);
	const optionRef = useRef<HTMLDivElement>(null);
	const dispatch = useAppDispatch();
	
	const onClickSelectProject = (e: MouseEvent<HTMLDivElement>) =>
	{
		if(e.target === optionRef.current)
		{
			const id = project.id;
			dispatch(selectProject(id));
		}
	}
	const onChangeProjectName = (e: ChangeEvent<HTMLInputElement>) =>
	{
		const id = project.id;
		const name = e.target.value;
		dispatch(renameProject({id, name}));
		
	}
	const onClickDeleteProject = (e: MouseEvent<HTMLButtonElement>) =>
	{
		const confirm = window.confirm(`Are you sure to delete ${project.name}?`);
		if(confirm === true)
		{
			const id = project.id;
			dispatch(deleteProject(id));
		}
	}
	const onChangeProjectSelection = (e: ChangeEvent<HTMLInputElement>) =>
	{
		const value = e.target.checked;
		if(value === true)
		{
			dispatch(selectProject(project.id));
		}
	}
	
	const isChecked = project.id === selected?.id;
	const styleForInput = { width: `${project.name.length}ch`}
	return (
		<div className={css.option} onClick={onClickSelectProject} ref={optionRef}>
			<input className={css.checkbox} type="checkbox" checked={isChecked} onChange={onChangeProjectSelection} />
			<input className={css.input} style={styleForInput} value={project.name} onChange={onChangeProjectName} />
			<button className={css.delete} onClick={onClickDeleteProject}>⨯</button>
		</div>
	)
}

export default ProjectOption;
