import { useState, useEffect, ForwardedRef } from "react";
import useRefElement from "./useRefElement";

const useIsElementVisible = <T extends HTMLElement>(options: IntersectionObserverInit) : [boolean, ForwardedRef<T>] =>
{
	const [isVisible, setIsVisible] = useState(false);
	const [element, setElementRef] = useRefElement<T>(null);
	
	useEffect(() =>{
		const intersection = new IntersectionObserver((entries) => { setIsVisible(entries[0]!.isIntersecting) }, options);
		if(element) intersection.observe(element);
		return () => {
			if(element) intersection.unobserve(element);
		}
	}, [element, options])
	
	return [isVisible, setElementRef];
}

export default useIsElementVisible;