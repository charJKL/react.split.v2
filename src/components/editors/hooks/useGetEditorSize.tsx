import { RefObject, useEffect, useState } from "react";
import {Size} from "../useScale";

const useGetEditorSize = (element: RefObject<HTMLDivElement>) : Size =>
{
	const [size, setSize] = useState<Size>({width: 0, height: 0});
	
	useEffect(() => {
		if(element.current) setSize(element.current.getBoundingClientRect());
	}, [element.current]);
	
	return size;
}

export default useGetEditorSize;