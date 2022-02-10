
import { isPageLoaded, Page,  } from "../../store/slice.pages";
import { Metric } from "../../store/slice.metrics";
import { calculateScale, applayScaleToSize, applayScaleToMetrics} from "./Editor";
import useRefElement from "./../hooks/useRefElement";
import useGetBoundingRect from "../hooks/useGetBoundingRect";
import useGetPageSize from "./hooks/useGetPageSize";
import LayerPage from "./LayerPage";
import LayerHighlight from "./LayerHighlight";
import css from "./EditorThumbnail.module.scss";

interface EditorThumbnailProps 
{
	page: Page;
	metric: Metric;
}

const EditorThumbnail = ({page, metric} : EditorThumbnailProps): JSX.Element =>
{
	const [editorRef, setEditorRef] = useRefElement<HTMLDivElement>(null);
	
	const editorSize = useGetBoundingRect(editorRef);
	const pageSize = useGetPageSize(page.id);
	const scale = editorSize && pageSize && calculateScale(editorSize, pageSize);
	const scaledDesktopSize = pageSize && scale && applayScaleToSize(pageSize, scale);
	const scaledMetrics = scale && applayScaleToMetrics(metric, scale);
	
	var layers: Array<JSX.Element> = [];
	if(isPageLoaded(page) && scaledDesktopSize && scaledMetrics)
	{
		layers.push(<LayerPage key="editor-metric-page" className={css.page} page={page} metric={scaledMetrics} desktopSize={scaledDesktopSize} />);
		layers.push(<LayerHighlight key="editor-metric-highlight" className={css.highlight} page={page} metric={scaledMetrics} desktopSize={scaledDesktopSize}/>);
	}
	return (
		<div className={css.editor} ref={setEditorRef} >
			{ layers.map((layer) => layer ) }
		</div>
	)
}

export default EditorThumbnail;