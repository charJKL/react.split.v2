import { useState, useEffect } from "react";
import { Size } from "../types/Size";
import { Page } from "../../../store/slice.pages";

const useGetPageSize = (page: Page | null) : Size=>
{
	const [size, setSize] = useState<Size>({width: 0, height: 0});
	
	useEffect(() => {
		if(page === null) return;
		if(page.status !== "Loaded") return;
		
		setSize(page as Size); // now we are sure that page size is available
	}, [page]);
	
	return size;
}

export default useGetPageSize;