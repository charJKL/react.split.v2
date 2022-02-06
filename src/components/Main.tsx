import { useEffect, useState } from "react";
import {CustomHTMLAttributes} from "./types/CustomHTMLAttributes";
import useGetBoundingRect from "./hooks/useGetBoundingRect";
import EditorMetrics from './editors/EditorMetrics';
import EditorText from './editors/EditorText';
import css from "./Main.module.scss";
import useRefElement from "./hooks/useRefElement";
import { isLeftButtonPressed, MouseButton } from "./types/MouseButton";
import useHoverInRange from "./hooks/useHoverInRange";

const Main = ({className} : CustomHTMLAttributes ) : JSX.Element =>
{
	const [mainRef, setMainRef] = useRefElement<HTMLDivElement>(null);
	const [separatorRef, setSeparatorRef] = useRefElement<HTMLDivElement>(null);
	const rect = useGetBoundingRect(mainRef);
	const [separator, setSeparator] = useState<number>(document.body.clientWidth / 2);
	const isSeparatorHovered = useHoverInRange(mainRef, separatorRef, MouseButton.Left, 3);
	
	useEffect(() => {
		if(mainRef === null) return;
		const mousemove = (e: MouseEvent) =>
		{
			if(isLeftButtonPressed(e) && isSeparatorHovered)
			{
				setSeparator((separator) => separator + e.movementX);
			}
		}
		mainRef.addEventListener('mousemove', mousemove);
		return () => {
			mainRef.removeEventListener('mousemove', mousemove);
		}
	}, [mainRef, isSeparatorHovered]);
	
	let editorMetricSize = 0;
	let editorTextSize = 0;
	if(mainRef && rect.width > 0)
	{
		editorMetricSize = separator;
		editorTextSize = rect.width - separator;
	}
	const styleCursor = isSeparatorHovered ? {cursor: 'col-resize'} : {cursor: ''};
	const styleForEditorMetric = {width: editorMetricSize };
	const styleForEditorText = {width: editorTextSize };
	const classForMain = [className, css.main].join(" ");
	const styleForMain = { ...styleCursor };
	return (
		<main className={classForMain} style={styleForMain} ref={setMainRef}>
			<EditorMetrics style={ styleForEditorMetric } />
			<div className={css.separator} ref={setSeparatorRef}></div>
			<EditorText style={ styleForEditorText } />
		</main>
	)
}

export default Main;