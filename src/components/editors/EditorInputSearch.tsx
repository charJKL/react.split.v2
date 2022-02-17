import { ChangeEvent, FocusEvent, KeyboardEvent, useState } from "react";
import { selectPage, selectSearching, setSearching } from "../../store/slice.gui";
import { selectPageByName, selectSelectedPage } from "../../store/slice.pages";
import { useAppDispatch, useAppSelector } from "../../store/store.hooks";
import Tooltip from "../common/Tooltip";
import css from "./EditorInputSearch.module.scss";

interface EditorInputSearchProps
{
	className?: string;
}

const EditorInputSearch = ({className} : EditorInputSearchProps) : JSX.Element =>
{
	const page = useAppSelector(selectSelectedPage);
	const searching = useAppSelector(selectSearching);
	const results = useAppSelector(selectPageByName(searching ?? ""));
	const [showTooltip, setShowTooltip] = useState<boolean>(false);
	const resultsCount = searching && results && results.length;
	const result = resultsCount == 1 ? results[0] ?? null : null;
	const dispatch = useAppDispatch();
	
	const onChangeName = (e: ChangeEvent<HTMLInputElement>) =>
	{
		const value = e.target.value;
		dispatch(setSearching(value));
	}
	const onFocus = (e: FocusEvent) =>
	{
		setShowTooltip(true);
	}
	const onBlurName = (e: FocusEvent) =>
	{
		setShowTooltip(false)
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
	
	const value = searching ?? page?.name ?? "";
	const foundOneIndicator = result ? css.indicator : "";
	const classNameForInput = [className, css.input].join(" ");
	const classNameForResult = [css.result, foundOneIndicator].join(" ");
	return (
		<div className={css.wrapper}>
			<input className={classNameForInput} name="name" type="text" autoComplete="off" value={value} onChange={onChangeName} onFocus={onFocus} onBlur={onBlurName} onKeyDown={onKeyDown}/>
			<div className={classNameForResult}>{resultsCount}</div>
			<Tooltip show={showTooltip} alignment="bottom-left">
				<p>Provided search patter must match only one element.</p>
				<p>Press <span>Enter</span> to select page, <span>Esc</span> to cancel.</p>
			</Tooltip>
		</div>
	)
}

export default EditorInputSearch;