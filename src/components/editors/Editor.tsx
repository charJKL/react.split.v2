import { ReactElement } from "react";
import { CustomHTMLAttributes} from "../types/CustomHTMLAttributes";
import css from "./Editor.module.scss";

type EditorPropsCustom =
{
	desktop: ReactElement;
	toolbars: ReactElement[];
}
type EditorProps = CustomHTMLAttributes & EditorPropsCustom;

const Editor = ({className, desktop, toolbars}: EditorProps) : JSX.Element =>
{
	
	
	
	const classNameForEditor = [css.editor, className].join(" ");
	return (
		<div className={classNameForEditor} >
			<div className={css.toolbars}>
				{toolbars.map((toolbar, i) => <label key={i}>{toolbar}</label>)}
			</div>
			<div className={css.desktop}>
				{desktop}
			</div>
		</div>
	)
}

export default Editor;