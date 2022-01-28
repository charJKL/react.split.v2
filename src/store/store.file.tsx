import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ThunkStoreTypes } from "./store";
import { Page, addPage } from "./slice.pages";
import { Metric, addMetric } from "./slice.metrics";

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
		const metric : Metric = {id: id, wasEdited: false, x1: 0, x2: 0, y1: 0, y2: 0, rotate: 0};
		dispatch(addPage(page));
		dispatch(addMetric(metric));
	});
});

export { loadFile };