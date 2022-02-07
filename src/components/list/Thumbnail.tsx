import React, { useEffect, useRef, useState } from "react";
import useIsElementVisible from "./useIsElementVisible";
import { useAppDispatch, useAppSelector } from "../../store/store.hooks";
import { loadPage, selectPage, selectPageById } from "../../store/slice.pages";
import { selectMetricsForPage } from "../../store/slice.metrics";
import { selectOcrForPage } from "../../store/slice.ocrs";
import css from "./Thumbnail.module.scss";
import placeholder from "../../assets/placeholder.svg";
import waiting from "../../assets/waiting.svg";
import ThumbnailStatusMetric from "./ThumbnailStatusMetric";

type ThumbnailProps = 
{
	id: string;
}

const Thumbnail = ({id}: ThumbnailProps) : JSX.Element =>
{
	const page = useAppSelector(selectPageById(id));
	const metric = useAppSelector(selectMetricsForPage(page));
	const ocr = useAppSelector(selectOcrForPage(page));
	const dispatch = useAppDispatch();
	const [element, isVisible] = useIsElementVisible<HTMLDivElement>({threshold: [0, 1]});
	
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
	
	if(metric)
	{
		metricStatus = <ThumbnailStatusMetric className={css.metric} metric={metric} />
	}
	return (
		<div className={css.thumbnail} ref={element} onClick={onClickHandler}>
			{ image }
			{ metricStatus }
			<input className={css.name} value={page.name} readOnly />
		</div>
	)
}

export default Thumbnail;