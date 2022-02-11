import { ChangeEvent, FocusEvent, KeyboardEvent } from "react";
import { selectPage, selectSearching, setSearching } from "../../store/slice.gui";
import { Page, selectPageByName } from "../../store/slice.pages";
import { useAppDispatch, useAppSelector } from "../../store/store.hooks";
import css from "./EditorInputSearch.module.scss";

interface EditorInputSearchProps
{
	className?: string;
	value: string;
}

const EditorInputSearch = ({className, value} : EditorInputSearchProps) : JSX.Element =>
{
	const searching = useAppSelector(selectSearching);
	const results = useAppSelector(selectPageByName(searching ?? ""));
	const resultsCount = searching && results && results.length;
	const result = resultsCount == 1 ? results[0] ?? null : null;
	const dispatch = useAppDispatch();
	
	const onChangeName = (e: ChangeEvent<HTMLInputElement>) =>
	{
		const value = e.target.value;
		dispatch(setSearching(value));
	}
	const onBlurName = (e: FocusEvent) =>
	{
		dispatch(setSearching(null));
	}
	const onKeyDown  = (e: KeyboardEvent<HTMLInputElement>) => 
	{
		switch(e.code)
		{
			case "Escape":
				dispatch(setSearching(null));
				if(document.activeElement instanceof HTMLElement) document.activeElement.blur();
				break;
			
			case "NumpadEnter":
			case "Enter":
				if(result)
				{
					dispatch(setSearching(null));
					dispatch(selectPage(result.id));
				}
				break;
		}
	}
	
	const foundOneIndicator = result ? css.indicator : "";
	const classNameForInput = [className, css.input].join(" ");
	const classNameForResult = [css.result, foundOneIndicator].join(" ");
	return (
		<div className={css.wrapper}>
			<input className={classNameForInput} name="name" type="text" value={value} onChange={onChangeName} onBlur={onBlurName} onKeyDown={onKeyDown}/>
			<div className={classNameForResult}>{resultsCount}</div>
		</div>
	)
}

export default EditorInputSearch;