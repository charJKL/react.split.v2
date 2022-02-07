import { useLayoutEffect } from "react";
import { LayerProps } from "./EditorMetrics";
import useRefElement from "../hooks/useRefElement";

type LayerHighlightType = LayerProps;

const LayerHighlight = ({className, desktopSize, metric}: LayerHighlightType) : JSX.Element => 
{
	const [canvasRef, setCanvasRef] = useRefElement<HTMLCanvasElement>(null);
	
	useLayoutEffect(() =>{
		if(canvasRef === null) return;
		const context = canvasRef.getContext("2d");
		if(context === null) return;
		context.globalCompositeOperation = "source-over";
		context.fillStyle = "#fff";
		context.clearRect(0, 0, desktopSize.width, desktopSize.height);
		context.fillRect(0, 0, desktopSize.width, desktopSize.height);
		
		context.globalCompositeOperation = "destination-out";
		const width = metric.x2 - metric.x1;
		const height = metric.y2 - metric.y1;
		context.fillRect(metric.x1, metric.y1, width, height);
	}, [canvasRef, desktopSize.width, desktopSize.height, metric.x1, metric.x2, metric.y1, metric.y2]);
	
	const styleForCanvas = { ...desktopSize };
	const classNameForCanvas = [className].join(" ");
	return (
		<canvas className={classNameForCanvas} style={styleForCanvas} width={desktopSize.width} height={desktopSize.height} ref={setCanvasRef}/>
	);
}

export default LayerHighlight;