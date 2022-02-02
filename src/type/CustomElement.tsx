
export type CustomElementProps = 
{
	className?: string | undefined;
	children?: React.ReactNode;
	onFiles?: (files: Array<File>) => void;
}
export type CustomElement = (props : CustomElementProps) => JSX.Element;
