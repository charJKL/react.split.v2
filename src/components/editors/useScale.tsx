import React, { useState, useEffect, MouseEvent, WheelEvent } from "react";
import MouseButton from "./MouseButton";

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

const SENSITIVITY = 0.0001;

type ScaleAction = null | "scale-out" | "scale-in";

const useScale = (viewport: Size, element: Size) =>
{
	const [scale, setScale] = useState<Scale>({x: 1, y: 1});
	const [isScaling, setScaling] = useState<boolean>(false);
	const [wasScaled, setWasScaled] = useState<ScaleAction>(null);
	const size = calculateSizeValue(element, scale);
	
	useEffect(() => { // calculate inital sale
		setScale(calculateRationValue(viewport, element));
	}, [viewport, element]);
	
	useEffect(() => { // reset indicator that operation scaled was performed
		if(wasScaled == null) return;
		const id = setTimeout(() => { setWasScaled(null); }, 200);
		return () => { clearTimeout(id); }
	}, [wasScaled]);
	
	const mouseDown = (e: MouseEvent) =>
	{
		if(e.button !== MouseButton.right) return;
		setScaling(true);
	}
	
	const mouseUp = (e: MouseEvent) => 
	{
		setScaling(false);
	}
	
	const mouseLeave = (e: MouseEvent) =>
	{
		setScaling(false);
	}
	
	const mouseWheel = (e: WheelEvent) =>
	{
		if(isScaling === false) return;
		const x = scale.x - e.deltaY * SENSITIVITY;
		const y = scale.y - e.deltaY * SENSITIVITY;
		setScale({x: x, y: y});
		setWasScaled(e.deltaY > 0 ? "scale-out" : "scale-in");
	}

	return {size, scale, isScaling, wasScaled, mouseDown, mouseUp, mouseLeave, mouseWheel};
}

const calculateRationValue = (viewport: Size, size: Size) : Scale =>
{
	if(size.width === 0 || size.height === 0) return {x: 0, y: 0}

	const x = viewport.width / size.width;
	const y = viewport.height / size.height;
	const ratio = Math.min(x, y);
	return {x: ratio, y: ratio};
}

const calculateSizeValue = (element: Size, scale: Scale) : Size =>
{
	return {
		width: element.width * scale.x, 
		height: element.height * scale.y
	}
}

export type { Size, ScaleAction };
export default useScale;