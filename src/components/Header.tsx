import {CustomHTMLAttributes} from "../types";
import { useAppSelector } from "../store/store.hooks";
import { selectProjects } from "../store/slice.projects";
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
			<Select className={css.select}>
				{ projects.map((projectId) => <ProjectOption key={projectId} projectId={projectId}/>) }
			</Select>
			
			<LoadFileInput className={css.load}>Load file</LoadFileInput>
		</header>
	);
}
export default Header;