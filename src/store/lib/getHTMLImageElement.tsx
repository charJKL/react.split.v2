// https://developer.mozilla.org/en-US/docs/Web/API/Document/images
const getHTMLImageElement = (url: string) : HTMLImageElement | undefined =>
{
	return Array.from(document.images).find(img => img.src === url);
}

export default getHTMLImageElement;