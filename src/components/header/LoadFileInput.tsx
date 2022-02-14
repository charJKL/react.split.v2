import React, { useRef, ChangeEvent } from "react";
import { useAppDispatch } from "../../store/store.hooks";
import { loadFile } from "../../store/slice.projects";
import Tooltip from "../common/Tooltip";
import css from "./LoadFileInput.module.scss";


interface LoadFileInput 
{
	className?: string;
	children: React.ReactNode;
}

const LoadFileInput = ({className, children}: LoadFileInput) : JSX.Element =>
{
	const dispatch = useAppDispatch();
	const fileInputRef = useRef<HTMLInputElement>(null);
	
	const onClickRedirectEvent = () =>
	{
		if(fileInputRef.current) fileInputRef.current.click();
	}
	const onChangeLoadSelectedFile = (e: ChangeEvent<HTMLInputElement>) =>
	{
		const files = e.target.files ?? [];
		const array = Array.from(files);
		dispatch(loadFile(array));
	}
	
	const classNameForWrapper = [className, css.wrapper].join(" ");
	return (
		<div className={classNameForWrapper}>
			<button className={css.button} onClick={onClickRedirectEvent}>{children}</button>
			<input className={css.files} type="file" accept="image/*" multiple ref={fileInputRef} onChange={onChangeLoadSelectedFile} />
			<Tooltip show={true} alignment="top-left" width="150%">
				Start here from loading image from which you want to extract text.
			</Tooltip>
		</div>
	)
}

export default LoadFileInput;