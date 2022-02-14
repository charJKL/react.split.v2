import {CustomHTMLAttributes} from "../types";
import { useAppSelector } from "../store/store.hooks";
import { selectProjects } from "../store/slice.projects";
import NewProjectButton from "./header/NewProjectButton";
import LoadFileInput from "./header/LoadFileInput";
import Select from "./header/Select";
import ProjectOption from "./header/ProjectOption";
import css from "./Header.module.scss";

const Header = ({className} : CustomHTMLAttributes) : JSX.Element => 
{
	const projects = useAppSelector(selectProjects);

	const cssHeader = [className, css.header].join(' ');
	return (
		<header className={cssHeader}>
			<NewProjectButton className={css.new}>New project</NewProjectButton>
			<LoadFileInput className={css.load}>Load file</LoadFileInput>
			<Select className={css.select}>
				{ projects.map((projectId) => <ProjectOption key={projectId} projectId={projectId}/>) }
			</Select>
		</header>
	);
}
export default Header;