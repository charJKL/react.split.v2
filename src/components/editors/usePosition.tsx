import { useEffect } from "react";

type Position =
{
	x: number;
	y: number;
}

const usePosition = (element: React.RefObject<HTMLElement>) : [Position] => 
{
	const position = {x: 0, y: 0};
	
	useEffect(() =>{
		if(element.current)
		{
			//element.current.addEventListener
		}
		
		return () => {
			if(element.current)
			{
				//element.current.removeEventListener()
			}
		}
	}, [element]);
	
	return [position];
}

export default usePosition;