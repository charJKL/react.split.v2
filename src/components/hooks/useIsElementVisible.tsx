import React, { useState, useRef, useEffect } from "react";

const useIsElementVisible = <T extends HTMLElement>(options: IntersectionObserverInit) : [React.RefObject<T>, boolean] =>
{
	const [isVisible, setIsVisible] = useState(false);
	const element = useRef<T>(null);
	
	useEffect(() =>{
		const intersection = new IntersectionObserver((entries) => { setIsVisible(entries[0]!.isIntersecting) }, options);
		if(element.current) intersection.observe(element.current);
		return () => {
			if(element.current) intersection.unobserve(element.current);
		}
	}, [element])
	
	return [element, isVisible];
}

export default useIsElementVisible;