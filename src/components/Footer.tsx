import {CustomHTMLAttributes} from "../types";
import EditorInput from "../components/editors/EditorInput";
import css from "./Footer.module.scss";


const Footer = ({className}: CustomHTMLAttributes) : JSX.Element => 
{
	const cssFooter = [className, css.footer].join(" ");
	return (
		<footer className={cssFooter}>
			<EditorInput className={css.editor} />
		</footer>
	)
}

export default Footer;