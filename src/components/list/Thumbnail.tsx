import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store.hooks";
import { loadPage, selectPage, selectPageById } from "../../store/slice.pages";
import css from "./Thumbnail.module.scss";
import placeholder from "../../assets/placeholder.svg";
import waiting from "../../assets/waiting.svg";

type ThumbnailProps = 
{
	id: string;
}

const Thumbnail = ({id}: ThumbnailProps) : JSX.Element =>
{
	const file = useAppSelector(selectPageById(id));
	const dispatch = useAppDispatch();
	const element = useRef<HTMLDivElement>(null);
	
	useEffect(() =>{
		const option : IntersectionObserverInit = { root: null, threshold: [0, 1] }
		const intersection = new IntersectionObserver((entries) => {
			const [entry] = entries;
			if(entry.isIntersecting) dispatch(loadPage(id));
		}, option);
		if(element.current) intersection.observe(element.current);
		
		return () =>
		{
			if(element.current) intersection.unobserve(element.current);
		}
	}, [element])

	const onClickHandler = () =>
	{
		dispatch(selectPage(id));
	}

	switch(file.status)
	{
		case "Idle":
			var image = <img className={css.placeholder} src={placeholder} />
			break;
			
		case "Loading":
			var image = <img className={css.loading} src={waiting} />;
			break;
			
		case "Loaded":
			var image = <img className={css.image} src={file.url} />;
			break;
			
		case "Error":
			var image = <span>Error occur</span>;
	}
	return (
		<div className={css.thumbnail} ref={element} onClick={onClickHandler}>
			{ image }
			<input className={css.name} value={file.name} />
		</div>
	)
}

export default Thumbnail;