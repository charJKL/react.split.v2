import {LayerProps} from "./EditorMetrics";

const LayerPage = ({className, page, metric}: LayerProps) : JSX.Element=>
{
	const styleForImage = { transform: `rotate(${metric.rotate}deg)` }
	return (<img className={className} style={styleForImage} src={page.url} alt="" />)
}

export default LayerPage;