import React from "react";
import LoadFileInput from "./common/LoadFileInput";

const Header = (): JSX.Element => 
{
	const onFilesHandler = (files: Array<File>) =>
	{
		console.log(files);
	}
	
	return (
		<header>
			<LoadFileInput onFiles={onFilesHandler}>Load file</LoadFileInput>
			
			<select>
				<option>Project 1</option>
				<option>Project 2</option>
				<option>Project 3</option>
			</select>
		</header>
	);
}
export default Header;