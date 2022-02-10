import React from "react";
import {CustomHTMLAttributes} from "../types";
import LoadFileInput from "./common/LoadFileInput";
import css from "./Header.module.scss";
import { useAppDispatch } from "../store/store.hooks";
import { loadFile } from "../store/store.file";

const Header = ({className} : CustomHTMLAttributes) : JSX.Element => 
{
	const dispatch = useAppDispatch();
	
	const onFilesHandler = (files: Array<File>) =>
	{
		dispatch(loadFile(files));
	}
	
	const cssHeader = [className, css.header].join(' ');
	return (
		<header className={cssHeader}>
			<LoadFileInput className={css.load} onFiles={onFilesHandler}>Load file</LoadFileInput>
			
			<select className={css.select}> 
				<option>Project 1</option>
				<option>Project 2</option>
				<option>Project 3</option>
			</select>
		</header>
	);
}
export default Header;