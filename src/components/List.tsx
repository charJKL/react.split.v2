
import { CustomElement, CustomElementProps } from "../type/CustomElement";
import Thumbnail from "./list/Thumbnail";
import { useAppSelector } from "../store/store.hooks";
import { selectPageIds } from "../store/slice.pages";
import css from "./List.module.scss";

const List : CustomElement = ({className}: CustomElementProps) : JSX.Element =>
{
	const pages = useAppSelector(selectPageIds);
	
	const cssList = [className, css.list].join(" ");
	return (
		<section className={cssList}>
			{ pages.map(pageId => <Thumbnail key={pageId} id={pageId}/>) }
		</section>
	)
}

export default List;