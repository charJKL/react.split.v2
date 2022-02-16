import React, { useRef, ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store.hooks";
import { selectSelectedProject } from "../../store/slice.projects";
import loadFiles from "../../store/thunk.loadFiles";

import css from "./LoadFileInput.module.scss";

interface LoadFileInputProps
{
	className?: string;
	children: React.ReactNode;
}

const LoadFileInput = ({className, children}: LoadFileInputProps) : JSX.Element =>
{
	const project = useAppSelector(selectSelectedProject);
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
		dispatch(loadFiles(array));
		e.target.value = "";
	}
	
	const isDisabled = project ? false : true;
	const classNameForWrapper = [className, css.wrapper].join(" ");
	return (
		<div className={classNameForWrapper}>
			<button className={css.button} disabled={isDisabled} onClick={onClickRedirectEvent}>{children}</button>
			<input className={css.files} type="file" accept="image/*" multiple ref={fileInputRef} onChange={onChangeLoadSelectedFile} />
		</div>
	)
}

export default LoadFileInput;