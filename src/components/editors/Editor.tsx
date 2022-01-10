import React from "react";
import css from "./Editor.module.scss";

type HOC = (props: any) => JSX.Element;

const Editor = <T, >(Element: React.ComponentType<T>) : HOC =>
{
	return (props: T): JSX.Element => {
		
		const toolbar: Array<JSX.Element> = [];
		return (
			<div className={css.editor}>
				<div className={css.toolbar}>
					{ toolbar }
				</div>
				<div className={css.desktop}>
					<Element {...props} />
				</div>
			</div>
		)
	}
}

export default Editor;