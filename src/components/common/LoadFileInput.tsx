import React, { useRef } from "react";
import {CustomHTMLAttributes} from "../types/CustomHTMLAttributes";
import css from "./LoadFileInput.module.scss";

type LoadFileInputExtendProp = 
{
	onFiles?: (files: Array<File>) => void;
}

type LoadFileInputProps = CustomHTMLAttributes & LoadFileInputExtendProp;

const LoadFileInput = ({children, onFiles, ...props}: LoadFileInputProps) : JSX.Element =>
{
	var reference = useRef<HTMLInputElement>(null);

	const onRedirectClickHandler = () =>
	{
		reference.current?.click();
	}

	const onChangeHandler = (e: React.ChangeEvent) => {
		if(onFiles && reference.current)
		{
			const files = reference.current.files ?? [];
			onFiles(Array.from(files));
			
		}
	}
	
	return (
		<>
			<button onClick={onRedirectClickHandler} {...props}>{children}</button>
			<input className={css.hide} type="file" accept="image/*" multiple ref={reference} onChange={onChangeHandler} />
		</>
	)
}

export default LoadFileInput;