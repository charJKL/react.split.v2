import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Metric } from "./slice.metrics";
import { Page, PageLoaded } from "./slice.pages";
import { StoreState, ThunkStoreTypes } from "./store";
import { Baseline, Bbox, Choice, createWorker,  } from 'tesseract.js';
import getHTMLImageElement from "./lib/getHTMLImageElement"
import drawRotateImage from "./lib/drawRotateImage"


type Key = string;
type OcrStatus = "Idle" | "Processing" | "Tesseract" | "Parsed" | "Loaded" | "Error";
type OcrLine = { bbox: Bbox, baseline: Baseline, text: string; }
type OcrWord = { bbox: Bbox, baseline: Baseline, text: string; choices: Choice[]; }

type Ocr = 
{
	id: Key;
	status: OcrStatus;
	detail: string | number | null;
	text: string;
	lines: OcrLine[];
	words: OcrWord[];
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
		upsertOcr: (state, action: PayloadAction<Partial<Ocr> & {id: string}>) =>
		{
			const id = action.payload.id;
			state.entities[id] = { ...state.entities[id], ...action.payload };
		},
		tesseractLog: (state, action: PayloadAction<{id: string, log: any}>) => 
		{
			const id = action.payload.id;
			state.entities[id].detail = action.payload.log;
		}
	}
});

export const selectOcrForPage = (page: Page | null) => (state: StoreState) => page ? state.ocrs.entities[page.id] : null;

type ReadPageBatch = {page: PageLoaded, metrics: Metric};
const readPage = createAsyncThunk<void, ReadPageBatch, ThunkStoreTypes>('ocrs/readPage', async (batch, thunk) => {
	const dispatch = thunk.dispatch;
	const upsertOcr = Ocrs.actions.upsertOcr;
	const tesseractLog = Ocrs.actions.tesseractLog;
	
	const page = batch.page;
	const metrics = batch.metrics;
	
	// Process image for tesseract.js, apply rotation:
	dispatch(upsertOcr({id: page.id, status: "Processing", detail: "Applying rotation."}));
	const rotatedCanvas = new OffscreenCanvas(page.width, page.height);
	const rotatedContext = rotatedCanvas.getContext("2d", {alpha: false});
	if(rotatedContext === null) return;
	const image = getHTMLImageElement(page.url);
	if(image === undefined) return;
	drawRotateImage(rotatedContext, image, metrics.rotate);
	
	// Continue process image for tesseract.js, apply cliping:
	dispatch(upsertOcr({id: page.id, status: "Processing", detail: "Clipping image."}));
	const width = metrics.x2 - metrics.x1;
	const height = metrics.y2 - metrics.y1;
	const clippedCanvas = new OffscreenCanvas(width, height);
	const clippedContext = clippedCanvas.getContext("2d", {alpha: false});
	if(clippedContext === null) return;
	clippedContext.drawImage(rotatedCanvas, metrics.x1, metrics.y1, width, height, 0, 0, width, height);

	// Convert canvas to blob:
	dispatch(upsertOcr({id: page.id, status: "Processing", detail: "Converting to blob."}));
	const blob : any = await clippedCanvas.convertToBlob({ type: 'image/png' });
			blob.name = 'some-string' // there is a bug in tesseract which require that blob should have name property.
	
	// Initialize tesseract:
	dispatch(upsertOcr({id: page.id, status: "Tesseract", detail: "Converting to blob."}));
	const tesseract = createWorker({
		workerPath: '/tesseract/worker.min.js',
		langPath: '/tesseract',
		corePath: '/tesseract/tesseract-core.wasm.js',
		logger: (log: any) => dispatch(tesseractLog({id: page.id, log})),
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
	const lines = result.data.lines.map(line => ({bbox: line.bbox, baseline: line.baseline, text: line.text }) as OcrLine );
	const words = result.data.words.map(word => ({bbox: word.bbox, baseline: word.baseline, text: word.text, choices: word.choices }) as OcrWord );
	dispatch(upsertOcr({id: page.id, status: "Parsed", detail: null, text: result.data.text, lines, words}));
	
	await tesseract.terminate();
});

export const { addOcr } = Ocrs.actions;
export { readPage };

export type { Ocr };
export default Ocrs;
