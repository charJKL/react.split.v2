import EditorInputSearch from "./EditorInputSearch";
import EditorInputValue from "./EditorInputValue";
import css from "./EditorInput.module.scss";

interface EditorInputProps 
{
	className?: string;
}

const EditorInput = ({className}: EditorInputProps) =>
{
	const classForEditor = [css.editor, className].join(" ");
	return (
		<div className={classForEditor}>
			<label>name: <EditorInputSearch /></label>
			<label>x1: <EditorInputValue name="x1" /></label>
			<label>x2: <EditorInputValue name="x2" /></label>
			<label>y1: <EditorInputValue name="y1" /></label>
			<label>y2: <EditorInputValue name="y2" /></label>
			<label>rotate: <EditorInputValue name="rotate" /></label>
		</div>
	)
}

export default EditorInput;