import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store.hooks";
import { Page, isPageIdle, loadPage, selectPageById, selectSelectedPage } from "../../store/slice.pages";
import { Metric, selectMetricsForPage } from "../../store/slice.metrics";
import { selectOcrForPage } from "../../store/slice.ocrs";
import { selectPage, selectSearching } from "../../store/slice.gui";
import useIsElementVisible from "../hooks/useIsElementVisible";
import EditorThumbnail from "../editors/EditorThumbnail";
import ThumbnailStatusMetrics from "./ThumbnailStatusMetrics";
import ThumbnailStatusText from "./ThumbnailStatusText";
import ThumbnailName from "./ThumbnailName";
import placeholder from "../../assets/placeholder.svg";
import waiting from "../../assets/waiting.svg";
import css from "./Thumbnail.module.scss";

type ThumbnailProps = 
{
	id: string;
}

const Thumbnail = ({id}: ThumbnailProps) : JSX.Element =>
{
	const page = useAppSelector(selectPageById(id)) as Page;
	const metric = useAppSelector(selectMetricsForPage(page.id)) as Metric;
	const selected = useAppSelector(selectSelectedPage);
	const ocr = useAppSelector(selectOcrForPage(page.id));
	const searching = useAppSelector(selectSearching);
	const [isVisible, setElementRef] = useIsElementVisible<HTMLDivElement>({threshold: [0, 1]});
	const isSelected = page === selected;
	const dispatch = useAppDispatch();
	
	useEffect(() => {
		if(isVisible === true) dispatch(loadPage(id))
	}, [isVisible, id, dispatch]);
	
	const onClickHandler = () =>
	{
		dispatch(selectPage(id));
	}
	
	switch(page.status)
	{
		case "Idle":
			var image = <img className={css.placeholder} src={placeholder} alt="" /> // eslint-disable-line @typescript-eslint/no-redeclare
			break;
		
		case "Restored":
		case "Stalled":
			var image = <img className={css.placeholder} src={placeholder} alt="" /> // eslint-disable-line @typescript-eslint/no-redeclare
			break;
		
		case "Loading":
			var image = <img className={css.loading} src={waiting} alt=""/>; // eslint-disable-line @typescript-eslint/no-redeclare
			break;
			
		case "Loaded":
			var image = <EditorThumbnail page={page} metric={metric} />; // eslint-disable-line @typescript-eslint/no-redeclare
			break;
			
		case "Error":
			var image = <span>Error occur</span>; // eslint-disable-line @typescript-eslint/no-redeclare
	}
	
	const isSelectedClass = isSelected ? css.selected : '';
	const classNameForThumbnail = [css.thumbnail, isSelectedClass].join(" ");
	return (
		<div className={classNameForThumbnail} ref={setElementRef} onClick={onClickHandler}>
			{ image }
			{ metric && <ThumbnailStatusMetrics className={css.metric} metric={metric} /> }
			{ ocr && <ThumbnailStatusText className={css.ocr} ocr={ocr} /> }
			<ThumbnailName className={css.name} name={page.name} searching={searching} />
		</div>
	)
}

export default Thumbnail;