import { useEffect } from "react";
import useIsElementVisible from "./useIsElementVisible";
import { useAppDispatch, useAppSelector } from "../../store/store.hooks";
import { loadPage, selectPage, selectPageById, selectSelectedPage } from "../../store/slice.pages";
import { selectMetricsForPage } from "../../store/slice.metrics";
import { selectOcrForPage } from "../../store/slice.ocrs";
import ThumbnailStatusMetric from "./ThumbnailStatusMetric";
import ThumbnailStatusOcr from "./ThumbnailStatusOcr";
import placeholder from "../../assets/placeholder.svg";
import waiting from "../../assets/waiting.svg";
import css from "./Thumbnail.module.scss";

type ThumbnailProps = 
{
	id: string;
}

const Thumbnail = ({id}: ThumbnailProps) : JSX.Element =>
{
	const page = useAppSelector(selectPageById(id));
	const selected = useAppSelector(selectSelectedPage);
	const metric = useAppSelector(selectMetricsForPage(page));
	const ocr = useAppSelector(selectOcrForPage(page));
	const dispatch = useAppDispatch();
	const [element, isVisible] = useIsElementVisible<HTMLDivElement>({threshold: [0, 1]});
	const isSelected = page === selected;
	
	useEffect(() => {
		if(isVisible === true && page.status === "Idle") dispatch(loadPage(id))
	}, [isVisible]);
	
	const onClickHandler = () =>
	{
		dispatch(selectPage(id));
	}
	
	switch(page.status)
	{
		case "Idle":
			var image = <img className={css.placeholder} src={placeholder} />
			break;
			
		case "Loading":
			var image = <img className={css.loading} src={waiting} />;
			break;
			
		case "Loaded":
			var image = <img className={css.image} src={page.url} />;
			break;
			
		case "Error":
			var image = <span>Error occur</span>;
	}
	
	let metricStatus = null;
	let ocrStatus = null;
	
	if(metric)
	{
		metricStatus = <ThumbnailStatusMetric className={css.metric} metric={metric} />
	}
	if(ocr)
	{
		ocrStatus = <ThumbnailStatusOcr className={css.ocr} ocr={ocr} />
	}
	
	const isSelectedClass = isSelected ? css.selected : '';
	const classNameForThumbnail = [css.thumbnail, isSelectedClass].join(" ");
	return (
		<div className={classNameForThumbnail} ref={element} onClick={onClickHandler}>
			{ image }
			{ metricStatus }
			{ ocrStatus }
			<input className={css.name} value={page.name} readOnly />
		</div>
	)
}

export default Thumbnail;