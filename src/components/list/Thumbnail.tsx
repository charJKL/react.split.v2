import React from "react";
import { useAppSelector } from "../../store/store.hooks";
import { selectPageById } from "../../store/slice.pages";

type ThumbnailProps = 
{
	id: string;
}

const Thumbnail = ({id}: ThumbnailProps) : JSX.Element =>
{
	const file = useAppSelector(selectPageById(id));
	
	return (
		<div>
			{file.name}
		</div>
	)
}

export default Thumbnail;