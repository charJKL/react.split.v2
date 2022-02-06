import { RefObject, useEffect, useLayoutEffect, useState } from "react";

const useGetBoundingRect = (element: HTMLDivElement | null) : DOMRect =>
{
	const [boundingRect, setBoundingRect] = useState<DOMRect>(new DOMRect(0,0,0,0));
	
	useLayoutEffect(() => {
		if(element) setBoundingRect(element.getBoundingClientRect());
	}, [element]);
	
	useEffect(() =>{
		if(element === null)  return;
		const observer = new ResizeObserver((entries) => { setBoundingRect(entries[0].contentRect) });
		observer.observe(element);
		return () =>
		{
			observer.unobserve(element);
		}
	}, [element]);

	return boundingRect;
}

export default useGetBoundingRect;
