import react from "react";
import Thumbnail from "./list/Thumbnail";
import { useAppSelector, useAppDispatch } from "../store/store.hooks";
import { selectPageIds } from "../store/slice.pages";
import css from "./List.module.scss";

type ListProps = 
{
	className?: string | undefined;
}

const List = ({className}: ListProps): JSX.Element =>
{
	const pages = useAppSelector(selectPageIds);
	
	const cssList = [className, css.list].join(" ");
	return (
		<section className={cssList}>
			{ pages.map(pageId => <Thumbnail id={pageId}/>) }
		</section>
	)
}

export default List;