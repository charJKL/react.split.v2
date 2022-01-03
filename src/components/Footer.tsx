import react from "react";
import css from "./Footer.module.scss";

type FooterProps = 
{
	className?: string | undefined;
}

const Footer = ({className}: FooterProps) : JSX.Element => 
{
	
	const cssFooter = [className, css.footer].join(" ");
	return (
		<footer className={cssFooter}>
			
		</footer>
	)
}

export default Footer;