import {CSSProperties} from "react";

export type CustomElementProps = 
{
	className?: string | undefined;
	children?: React.ReactNode;
	style?: CSSProperties | undefined;
	onFiles?: (files: Array<File>) => void;
}
export type CustomElement = (props : CustomElementProps) => JSX.Element;
