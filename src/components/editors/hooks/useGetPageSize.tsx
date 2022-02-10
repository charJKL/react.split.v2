import { useState, useEffect } from "react";
import { Size } from "../../../types"
import { isPageLoaded, selectPageById } from "../../../store/slice.pages";
import { useAppSelector } from "../../../store/store.hooks";

const useGetPageSize = (pageId: string) : Size | null =>
{
	const page = useAppSelector(selectPageById(pageId));
	const [size, setSize] = useState<Size | null>(null);
	
	useEffect(() => {
		if(page === null) return;
		if(isPageLoaded(page) === false) return;
		
		setSize(page as Size); // now we are sure that page size is available
	}, [page]);
	
	return size;
}

export default useGetPageSize;