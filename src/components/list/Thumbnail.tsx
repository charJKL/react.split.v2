import React from "react";
import { useAppSelector } from "../../store/store.hooks";
import { selectPageById } from "../../store/slice.pages";
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
	
	switch(file.status)
	{
		case "Idle":
			var image = <img className={css.placeholder} src={placeholder} />
			break;
			
		case "Loading":
			var image = <img className={css.loading} src={waiting} />;
			break;
			
		case "Loaded":
			var image = <img className={css.image} src="sss" />;
			break;
			
		case "Error":
			var image = <span>Error occur</span>;
	}
	
	return (
		<div className={css.thumbnail}>
			{ image }
			
			<input className={css.name} value={file.name} />
			
		</div>
	)
}

export default Thumbnail;