import { CustomElement, CustomElementProps } from "../type/CustomElement";
import EditorInput from "../components/editors/EditorInput";
import css from "./Footer.module.scss";


const Footer : CustomElement = ({className}: CustomElementProps) : JSX.Element => 
{
	
	const cssFooter = [className, css.footer].join(" ");
	return (
		<footer className={cssFooter}>
			<EditorInput className={css.editor} />
		</footer>
	)
}

export default Footer;