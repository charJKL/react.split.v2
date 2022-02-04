import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Metric } from "./slice.metrics";
import { Page, PageLoaded } from "./slice.pages";
import { StoreState, ThunkStoreTypes } from "./store";
import { createWorker } from 'tesseract.js';
import getHTMLImageElement from "./lib/getHTMLImageElement"
import drawRotateImage from "./lib/drawRotateImage"


type Key = string;

type Ocr = 
{
	id: Key;
}

type InitialStateMetrics =
{
	ids: Array<string>,
	entities: { [key: string]: Ocr },
}

const InitialState : InitialStateMetrics = 
{
	ids: [],
	entities: {},
}

const Ocrs = createSlice({
	name: "ocr",
	initialState: InitialState,
	reducers: 
	{
		addOcr: (state, action: PayloadAction<Ocr>) =>
		{
			const id = action.payload.id;
			state.ids.push(id);
			state.entities[id] = action.payload;
		},
	}
});

export const selectOcrForPage = (page: Page | null) => (state: StoreState) => page ? state.ocrs.entities[page.id] : null;

type ReadPageBatch = {page: PageLoaded, metrics: Metric};
const readPage = createAsyncThunk<void, ReadPageBatch, ThunkStoreTypes>('ocrs/readPage', async (batch, thunk) => {
	const page = batch.page;
	const metrics = batch.metrics;
	
	// Process image for tesseract.js, apply rotation:
	const rotatedCanvas = new OffscreenCanvas(page.width, page.height);
	const rotatedContext = rotatedCanvas.getContext("2d", {alpha: false});
	if(rotatedContext === null) return;
	const image = getHTMLImageElement(page.url);
	if(image === undefined) return;
	drawRotateImage(rotatedContext, image, metrics.rotate);
	
	// Continue process image for tesseract.js, apply cliping:
	const width = metrics.x2 - metrics.x1;
	const height = metrics.y2 - metrics.y1;
	const clippedCanvas = new OffscreenCanvas(width, height);
	const clippedContext = clippedCanvas.getContext("2d", {alpha: false});
	if(clippedContext === null) return;
	clippedContext.drawImage(rotatedCanvas, metrics.x1, metrics.y1, width, height, 0, 0, width, height);

	// Convert canvas to blob:
	const blob : any = await clippedCanvas.convertToBlob({ type: 'image/png' });
			blob.name = 'some-string' // there is a bug in tesseract which require that blob should have name property.
	
	// Initialize tesseract:
	const tesseract = createWorker({
		workerPath: '/tesseract/worker.min.js',
		langPath: '/tesseract',
		corePath: '/tesseract/tesseract-core.wasm.js',
		logger: (log: any) => console.log(log),
		errorHandler: (log: any) => console.log(log),
	});
	const parameters = {
		user_defined_dpi: '96',
		tessjs_create_hocr: '0',
		tessjs_create_tsv: '0',
		tessjs_create_box: '0',
		tessjs_create_unlv: '0',
		tessjs_create_osd: '0'
	};
	
	await tesseract.load();
	await tesseract.loadLanguage('eng+pol');
	await tesseract.initialize('pol');
	await tesseract.setParameters(parameters);
	const result = await tesseract.recognize(blob);
	console.log(result);
	await tesseract.terminate();
});

export const { addOcr } = Ocrs.actions;
export { readPage };

export type { Ocr };
export default Ocrs;
