import React from "react";
import LoadFileInput from "./common/LoadFileInput";
import css from "./Header.module.scss";
import { useAppSelector, useAppDispatch } from "../store/store.hooks";
import { setFiles } from "../store/slice.pages";

type HeaderProps = 
{
	className?: string | undefined;
}

const Header = ({className}: HeaderProps): JSX.Element => 
{
	const dispatch = useAppDispatch();
	
	const onFilesHandler = (files: Array<File>) =>
	{
		dispatch(setFiles(files));
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