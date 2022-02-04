// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Transformations#rotating

type CanvasRenderingContext2DType = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
const drawRotateImage = (context : CanvasRenderingContext2DType, image: HTMLImageElement, rotate: number, x = 0, y = 0 ) : void => 
{
	
	const halfX = image.naturalWidth / 2;
	const halfY = image.naturalHeight / 2;
	
	context.save();
	context.translate(halfX, halfY);
	context.rotate(rotate * Math.PI / 180);
	context.translate(-halfX, -halfY);
	context.drawImage(image, x, y);
	context.restore();
}
export default drawRotateImage;