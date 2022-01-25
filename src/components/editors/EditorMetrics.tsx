import React, { useRef } from "react";
import { selectSelectedPage } from "../../store/slice.pages";
import { useAppSelector } from "../../store/store.hooks";
import useGetEditorSize from "./useGetEditorSize";
import useGetPageSize from "./useGetPageSize";
import useScale from "./useScale";
import css from "./EditorMetrics.module.scss";
import usePosition from "./usePosition";

const EditorMetrics = (): JSX.Element =>
{
	const page = useAppSelector(selectSelectedPage);
	const editorRef = useRef<HTMLDivElement>(null);
	const editorSize = useGetEditorSize(editorRef);
	const pageSize = useGetPageSize(page);
	const [size, scale] = useScale(editorSize, pageSize);
	const {position, mousedown, mousemove, mouseup, mouseleave, contextmenu} = usePosition(editorRef);
	
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
	
	const style = { ...size, ...position };
	return (
		<div className={css.editor} ref={editorRef} onMouseDown={mousedown} onMouseMove={mousemove} onMouseUp={mouseup} onMouseLeave={mouseleave} onContextMenu={contextmenu}>
			<div className={css.toolbars}>
				<label>🔍 {scale.x.toFixed(2)} / 1.00</label>
			</div>
			<div className={css.desktop} style={style}>
				{desktop}
			</div>
		</div>
	)
}

export default EditorMetrics;