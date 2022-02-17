import {MouseEvent, useState} from "react";
import { useAppDispatch, useAppSelector } from "../../store/store.hooks";
import { selectMetricsForPage } from "../../store/slice.metrics";
import { isPageLoaded, selectSelectedPage } from "../../store/slice.pages";
import { readPage } from "../../store/slice.ocrs";
import Tooltip from "../common/Tooltip";
import css from "./EditorTextProcessButton.module.scss";

interface EditorTextProcessButtonProps 
{
	className?: string;
	placement: "desktop" | "toolbar";
	children: React.ReactNode;
}


const EditorTextProcessButton = ({className, placement, children}: EditorTextProcessButtonProps) : JSX.Element =>
{
	const page = useAppSelector(selectSelectedPage);
	const metrics = useAppSelector(selectMetricsForPage(page ? page.id : ""));
	const [showTooltip, setShowTooltip] = useState<boolean>(false);
	const dispatch = useAppDispatch();
	const isProccessButtonDisabled = page ? isPageLoaded(page) !== true : true;
		
	const onProcessHandler = (e: MouseEvent) =>
	{
		if(page && metrics)
		{
			if(isPageLoaded(page)) 
			{
				dispatch(readPage({page, metrics}));
			}
		}
	}
	const onMouseEnterShowTooltip = () =>
	{
		if(isProccessButtonDisabled === true)
		{
			setShowTooltip(true);
		}
	}
	const onMouseLeaveHideTooltip = () =>
	{
		setShowTooltip(false);
	}
	
	const tooltipAlignment = placement === "desktop" ? "top-center" : "top-left";
	const classDisabled = isProccessButtonDisabled ? css.disabled : "";
	const classNameForWrapper = [className, css.wrapper].join(" ");
	const classNameForButton = [css.button, classDisabled].join(" ");
	return (
		<div className={classNameForWrapper}>
			<button className={classNameForButton} onClick={onProcessHandler} onMouseEnter={onMouseEnterShowTooltip} onMouseLeave={onMouseLeaveHideTooltip}>{children}</button>
			<Tooltip show={showTooltip} alignment={tooltipAlignment} width="150%">
				<p>You can't dispatch tesseract process for unloaded image.</p>
			</Tooltip>
		</div>
	)
}

export default EditorTextProcessButton;