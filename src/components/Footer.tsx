import {CustomHTMLAttributes} from "../types";
import { useAppDispatch } from "../store/store.hooks";
import getTxtResult from "../store/store.result"
import useRefElement from "./hooks/useRefElement";
import EditorInput from "../components/editors/EditorInput";
import css from "./Footer.module.scss";



const Footer = ({className}: CustomHTMLAttributes) : JSX.Element => 
{
	const dispatch = useAppDispatch();
	const [downloadRef, setDownloadRef] = useRefElement<HTMLAnchorElement>(null);

	const saveResultHandler = async () =>
	{
		if(downloadRef == null) return;
		const blob = await dispatch(getTxtResult());
	
		downloadRef.download = "filename.txt";
		downloadRef.href = URL.createObjectURL(blob);
		downloadRef.click();
	}
	
	const classNameForFooter = [className, css.footer].join(" ");
	return (
		<footer className={classNameForFooter}>
			<EditorInput className={css.editor} />
			<div className={css.buttons}>
				<button className={css.button} onClick={saveResultHandler}>Save</button>
			</div>
			<a href="blob:" download="mock.txt" ref={setDownloadRef}></a>
		</footer>
	)
}
export default Footer;