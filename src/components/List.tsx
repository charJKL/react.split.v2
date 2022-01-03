import react from "react";
import css from "./List.module.scss";

type ListProps = 
{
	className?: string | undefined;
}

const List = ({className}: ListProps): JSX.Element =>
{
	
	const cssList = [className, css.list].join(" ");
	return (
		<section className={cssList}>
			
		</section>
	)
}

export default List;