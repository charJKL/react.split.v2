import React, { useRef } from "react";
import { selectSelectedPage } from "../../store/slice.pages";
import { useAppSelector } from "../../store/store.hooks";
import useGetEditorSize from "./useGetEditorSize";
import useGetPageSize from "./useGetPageSize";
import useScale from "./useScale";
import css from "./EditorMetrics.module.scss";

const EditorMetrics = (): JSX.Element =>
{
	const page = useAppSelector(selectSelectedPage);
	
	const editorRef = useRef<HTMLDivElement>(null);
	
	const editorSize = useGetEditorSize(editorRef);
	const pageSize = useGetPageSize(page);
	const [size, scale] = useScale(editorSize, pageSize);
	
	var toolbars: Array<JSX.Element> = [];
	var desktop : JSX.Element = <></>;
	
	if(page && page.status == "Loaded")
	{
		desktop = (
			<>
				<img className={css.image} src={page.url} />
			</>
		)
	}
	
	
	console.log(size, scale);
	return (
		<div className={css.editor} ref={editorRef}>
			<div className={css.toolbars}>
				<label>🔍 {scale.x.toFixed(2)} / 1.00</label>
			</div>
			<div className={css.desktop} style={{width: size.width, height: size.height}}>
				{desktop}
			</div>
		</div>
	)
}

export default EditorMetrics;