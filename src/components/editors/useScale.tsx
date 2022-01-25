import { SIGFPE } from "node:constants";
import React, { useState, useEffect } from "react";

type Size = 
{
	width: number;
	height: number;
}
type Scale = 
{
	x: number;
	y: number;
}

const useScale = (viewport: Size, element: Size) : [Size, Scale] =>
{
	const scale = calculateRationValue(viewport, element);
	const size = calculateSizeValue(element, scale);
	
	return [size, scale];
}


const calculateRationValue = (viewport: Size, size: Size) : Scale =>
{
	if(size.width === 0 || size.height === 0) return {x: 0, y: 0}

	const x = viewport.width / size.width;
	const y = viewport.height / size.height;
	const ratio = Math.min(x, y);
	console.log('ratio', ratio);
	return {x: ratio, y: ratio};
}

const calculateSizeValue = (element: Size, scale: Scale) : Size =>
{
	return {
		width: element.width * scale.x, 
		height: element.height * scale.y
	}
}

export type { Size };
export default useScale;



/*

type ScaleOperation = "in" | "out";

const useScale = (viewport: React.RefObject<HTMLDivElement>, element: Size | null, sensitivity: number = 0.01) : [Size, Scale] =>
{
	console.log('useScale', viewport, element);
	const [scale, setScale] = useState<Scale>({x: 1, y: 1});
	
	// Recalculate scale on change:
	useEffect(() => {
		console.log('useScale - useEffect', viewport, element);
		if(viewport.current == null)  return;
		if(element == null) return;
		
		const viewportSize = viewport.current.getBoundingClientRect();
		const elementSize = element as Size;
		const sacle = calculateRationValue(viewportSize, elementSize);
		setScale(scale);
	}, [viewport.current, element]);
	
	const onWheelHandler = (e: Event) =>
	{
		console.log('on mouse whell', e);
	}
	const onMouseupHandler = (e: Event) =>
	{
		console.log('on mouse up', e);
	}
	const onMouseleaveHandler = (e: Event) =>
	{
		console.log('on mouse leave', e);
	}
	const onMousedownHandler = (e: Event) =>
	{
		console.log('on mouse dwon', e);
	}
	
	// Add events listeners:
	useEffect(() =>{
		if(viewport.current == null) return;
		viewport.current.addEventListener('wheel', onWheelHandler);
		viewport.current.addEventListener('mouseup', onMouseupHandler);
		viewport.current.addEventListener('mouseleave', onMouseleaveHandler);
		viewport.current.addEventListener('mousedown', onMousedownHandler);
		
		return () =>
		{
			if(viewport.current == null) return;
			viewport.current.removeEventListener('wheel', onWheelHandler);
			viewport.current.removeEventListener('mouseup', onMouseupHandler);
			viewport.current.removeEventListener('mouseleave', onMouseleaveHandler);
			viewport.current.removeEventListener('mousedown', onMousedownHandler);
		}
	}, [viewport.current]);
	
	
	if(viewport.current == null && element == null)
	{
		const size = {width: 0, height: 0};
		return [size, scale];
	}
	
	const size = 
	{
		width: Math.floor(element.width * scale.x),
		height: Math.floor(element.height * scale.y)
	};
	return [size, scale];
}



const changeScale = (operation: ScaleOperation) =>
{
	switch(operation)
	{
		case "in":
			setScale({x: scale.x + sensitivity, y: scale.y + sensitivity});
			return;
			
		case "out":
			setScale({x: scale.x - sensitivity, y: scale.y - sensitivity});
	}
};


export default useScale;
*/