import type { GetStoreState, StoreDispatch } from "./store";
import { Page, Source, addPage, updateUrl } from "./slice.pages";
import { Metric, addMetric } from "./slice.metrics";
import { Ocr, addOcr } from "./slice.ocrs";
import StoreException from "./lib/storeException";


const areFilesEqual = (one: Source, two: File) =>
{
	return one.name === two.name && one.size == two.size && one.lastModified === two.lastModified && one.type === two.type;
}

const loadFiles = (files: Array<File>) => (dispatch: StoreDispatch, getState: GetStoreState) =>
{
	const { pages } = getState();
	if(files.length === 0) throw new StoreException(`Array of files is empty.`, {type: `projects/loadFile`, payload: files});
	
	// load files:
	let counter = pages.ids.length;
	files.forEach((file) => {
		const page = Object.values(pages.entities).find(page => areFilesEqual(page.source, file));
		if(page)
		{
			const id = page.id;
			const url = URL.createObjectURL(file);
			dispatch(updateUrl({id, url}));
		}
		else
		{
			const id = (counter++).toString();
			const evenOdd = (counter % 2) ? 'eve' : 'odd';
			const name = `page-${evenOdd}-${id}`;
			const source = { name: file.name, type: file.type, size: file.size, lastModified: file.lastModified };
			const url = URL.createObjectURL(file);
			const page : Page = {id: id, status: "Idle", name: name, source, url};
			const metric : Metric = {id: id, status: "Idle", details: null, x1: 10, x2:150, y1: 10, y2: 250, rotate: 0};
			const ocr: Ocr = {id: id, status: "Idle", details: null, text: "", lines: [], words: []};
			dispatch(addPage(page));
			dispatch(addMetric(metric));
			dispatch(addOcr(ocr));
		}
	});
};


export default loadFiles;