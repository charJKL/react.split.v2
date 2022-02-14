import React from "react";
import css from "./Tooltip.module.scss";

interface TooltipProps
{
	className?: string;
	children: React.ReactNode;
	show: boolean;
	alignment: "top-left" | "top-right" | "bottom-left" | "bottom-right";
	width?: string;
}

const Tooltip = ({className, show, alignment, width, children}: TooltipProps) : JSX.Element =>
{
	const widthStyle = width ? width : '100%';
	const displayStyle = show ? 'block' : 'none';
	const styleForTooltip = {display: displayStyle, width: widthStyle };
	const classNameForTooltip = [className, css.tooltip, css[alignment]].join(" ");
	return (
		<div className={classNameForTooltip} style={styleForTooltip}>
			<div className={css.arrow}></div>
			{ children }
		</div>
	)
}

export default Tooltip;