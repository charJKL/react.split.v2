import {LayerProps} from "./Layer";
import css from "./LayerPage.module.scss";

const LayerPage = ({className, page, desktopSize, metric}: LayerProps) : JSX.Element =>
{
	const styleForBoundary = { width: desktopSize.width, height: desktopSize.height };
	const classNameForBoundary = [className, css.boundary].join(" ");
	const styleForImage = { transform: `rotate(${metric.rotate}deg)` }
	return (
		<div className={classNameForBoundary} style={styleForBoundary}>
			<img className={css.image} style={styleForImage} src={page.url} alt="" />
		</div>
	)
}

export default LayerPage;