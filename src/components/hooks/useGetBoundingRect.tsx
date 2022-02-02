import { RefObject, useEffect, useState } from "react";

const useGetBoundingRect = (element: RefObject<HTMLDivElement>) : DOMRect =>
{
	const [boundingRect, setBoundingRect] = useState<DOMRect>(new DOMRect(0,0,0,0));
	
	useEffect(() => {
		if(element.current) setBoundingRect(element.current.getBoundingClientRect());
	}, [element]);
	
	return boundingRect;
}

export default useGetBoundingRect;
