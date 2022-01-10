import React from "react";
import { selectSelectedPage } from "../../store/slice.pages";
import { useAppSelector } from "../../store/store.hooks";
import Editor from "./Editor";
import css from "./EditorMetrics.module.scss";

const EditorMetrics = (): JSX.Element | null =>
{
	const page = useAppSelector(selectSelectedPage);
	
	if(page && page.status == "Loaded")
	{
		return (
			<div>
				<img src={page.url} />
			</div>
		)
	}
	return null;
}

export default Editor(EditorMetrics);