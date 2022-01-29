import { RefObject, useEffect, useState } from "react";
import {Size} from "../types/Size";
import {Position} from "../types/Position";

const useGetEditorRect = (element: RefObject<HTMLDivElement>) =>
{
	const [position, setPosition] = useState<Position>({left: 0, top: 0});
	const [size, setSize] = useState<Size>({width: 0, height: 0});
	
	useEffect(() => {
		if(element.current) 
		{
			setPosition(element.current.getBoundingClientRect());
			setSize(element.current.getBoundingClientRect());
		}
		
	}, [element.current]);
	
	return {position, size};
}

export default useGetEditorRect;