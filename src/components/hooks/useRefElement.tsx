import { useState, useCallback, ForwardedRef } from "react";

const useRefElement = <T, >(inital: T | null) : [T | null, ForwardedRef<T>] => {
	const [ref, setRef] = useState<T | null>(inital);
	const callbackRef = useCallback(ref => setRef(ref), []);
	
	return [ref, callbackRef];
}

export default useRefElement;
