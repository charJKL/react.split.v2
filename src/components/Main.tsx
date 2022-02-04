import { useRef } from "react";
import {CustomElement, CustomElementProps} from "../type/CustomElement";
import useGetBoundingRect from "./hooks/useGetBoundingRect";
import EditorMetrics from './editors/EditorMetrics';
import EditorText from './editors/EditorText';
import css from "./Main.module.scss";

const Main : CustomElement = ({className} : CustomElementProps ) : JSX.Element =>
{
	const mainRef = useRef<HTMLDivElement>(null);
	const rect = useGetBoundingRect(mainRef);

	const sizeEditorMetrics = {width: rect.width / 2};
	const editorMetricsSize = {width: rect.width / 2};
	const classForMain = [className, css.main].join(" ");
	return (
		<main className={classForMain} ref={mainRef}>
			<EditorMetrics style={ sizeEditorMetrics } />
			<div className={css.separator}></div>
			<EditorText style={ editorMetricsSize } />
		</main>
	)
} 

export default Main;