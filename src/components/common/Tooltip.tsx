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
	const styleForTooltip = {width: widthStyle };
	const classShowTooltip = show ? css.show : "";
	const classNameForTooltip = [className, css.tooltip, css[alignment], classShowTooltip].join(" ");
	return (
		<div className={classNameForTooltip} style={styleForTooltip}>
			{ children }
		</div>
	)
}

export default Tooltip;