import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ThunkStoreTypes } from "./store";
import { Page, addPage } from "./slice.pages";
import { Metric, addMetric } from "./slice.metrics";
import { Ocr, addOcr } from "./slice.ocrs";

const loadFile = createAsyncThunk<void, Array<File>, ThunkStoreTypes>('pages/loadFile', (files: Array<File>, thunk) => {
	const state = thunk.getState();
	const dispatch = thunk.dispatch;
	
	let counter = state.pages.ids.length;
	files.forEach((file) => {
		const id = (counter++).toString();
		const evenOdd = (counter % 2) ? 'eve' : 'odd';
		const name = `page-${evenOdd}-${id}`;
		const url = URL.createObjectURL(file);
		const page : Page = {id: id, status: "Idle", url: url, name: name};
		const metric : Metric = {id: id, status: "Idle", wasEdited: false, details: null, x1: 10, x2:150, y1: 10, y2: 250, rotate: 0};
		const ocr: Ocr = {id: id, status: "Idle", details: null, text: "", lines: [], words: []};
		dispatch(addPage(page));
		dispatch(addMetric(metric));
		dispatch(addOcr(ocr));
	});
});

export { loadFile };