
import { useAppDispatch, useAppSelector } from "../../store/store.hooks";
import { deleteProject, Project, renameProject, selectProject, selectProjectById } from "../../store/slice.projects";
import css from "./ProjectOption.module.scss"
import { ChangeEvent, MouseEvent } from "react";

interface ProjectProps
{
	projectId: string;
}

const ProjectOption = ({projectId}: ProjectProps) : JSX.Element => 
{
	const project = useAppSelector(selectProjectById(projectId)) as Project;
	const dispatch = useAppDispatch();
	
	const onClickSelectProject = (e: MouseEvent<HTMLDivElement>) =>
	{
		console.log('select element', project.id);
		const id = project.id;
		dispatch(selectProject(id));
	}
	const onChangeProjectName = (e: ChangeEvent<HTMLInputElement>) =>
	{
		e.stopPropagation();
		const id = project.id;
		const name = e.target.value;
		dispatch(renameProject({id, name}));
		
	}
	const onClickDeleteProject = (e: MouseEvent<HTMLButtonElement>) =>
	{
		e.stopPropagation();
		const confirm = window.confirm(`Are you sure to delete ${project.name}?`);
		if(confirm === true)
		{
			const id = project.id;
			dispatch(deleteProject(id));
		}
	}
	
	
	const styleForInput = { width: `${project.name.length}ch`}
	return (
		<div className={css.option} onClick={onClickSelectProject}>
			<input className={css.input} style={styleForInput} value={project.name} onChange={onChangeProjectName} />
			<button className={css.delete} onClick={onClickDeleteProject}>⨯</button>
		</div>
	)
}

export default ProjectOption;
