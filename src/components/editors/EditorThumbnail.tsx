import { CustomHTMLAttributes } from "../types/CustomHTMLAttributes";
import { Page,  } from "../../store/slice.pages";
import { Metric } from "../../store/slice.metrics";
import { calculateScale, applayScaleToSize, applayScaleToMetrics} from "./Editor";
import useRefElement from "./../hooks/useRefElement";
import useGetBoundingRect from "../hooks/useGetBoundingRect";
import useGetPageSize from "./hooks/useGetPageSize";
import LayerPage from "./LayerPage";
import LayerHighlight from "./LayerHighlight";
import css from "./EditorThumbnail.module.scss";

type EditorThumbnailPropsCustom =
{
	page: Page;
	metric: Metric;
}

type EditorThumbnailProps = CustomHTMLAttributes & EditorThumbnailPropsCustom;

const EditorThumbnail = ({className, page, metric} : EditorThumbnailProps): JSX.Element =>
{
	const [editorRef, setEditorRef] = useRefElement<HTMLDivElement>(null);
	const editorSize = useGetBoundingRect(editorRef);
	
	const pageSize = useGetPageSize(page);
	const scale = calculateScale(editorSize, pageSize);
	console.log(editorSize, scale);
	
	const scaledDesktopSize = applayScaleToSize(pageSize, scale);
	const scaledMetrics = applayScaleToMetrics(metric, scale);
	
	var layers: Array<JSX.Element> = [];
	
	if(page && scaledMetrics && page.status === "Loaded")
	{
		layers.push(<LayerPage key="editor-metric-page" className={css.image} page={page} metric={scaledMetrics} desktopSize={scaledDesktopSize} />);
	}
	if(page && metric && scaledMetrics)
	{
		layers.push(<LayerHighlight key="editor-metric-highlight" className={css.highlight} page={page} metric={scaledMetrics} desktopSize={scaledDesktopSize}/>);
	}
	
	const classNameForEditor = [className, css.editor].join(" ");
	return (
		<div className={classNameForEditor} ref={setEditorRef} >
			{ layers.map((layer) => layer ) }
		</div>
	)
}

export default EditorThumbnail;