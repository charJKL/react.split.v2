import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { GetStoreState, StoreDispatch, StoreState } from "./store";
import StoreException from "./lib/storeException";
import getRandomId from "./lib/getRandomId";
import trimFileExtension from "./lib/trimFileExtension";
import { Page, addPage } from "./slice.pages";
import { Metric, addMetric } from "./slice.metrics";
import { Ocr, addOcr } from "./slice.ocrs";
import { changeKey } from "./middleware/LocalStorage";

type Key = string;
type ProjectValue = {id: Key, name: string};
type NameValue = {id: Key, name: string};
type Project = 
{
	id: Key,
	name: string;
}

type InitialStateProjects =
{
	ids: Array<string>,
	entities: { [key: Key]: Project },
	selected: Key | null;
}

const InitialState : InitialStateProjects = 
{
	ids: [],
	entities: { },
	selected: null,
}

const Projects = createSlice({
	name: "projects",
	initialState: InitialState,
	reducers: 
	{
		load: (state, action: PayloadAction<InitialStateProjects>) =>
		{
			state.ids = action.payload.ids;
			state.entities = action.payload.entities;
			state.selected = action.payload.selected;
		},
		addProject: (state, action: PayloadAction<ProjectValue>) =>
		{
			const id = action.payload.id;
			const project = action.payload;
			state.ids.push(id);
			state.entities[id] = project;
		},
		selectProject: (state, action: PayloadAction<Key>) =>
		{
			state.selected = action.payload;
		},
		renameProject: (state, action: PayloadAction<NameValue>) =>
		{
			const id = action.payload.id;
			const project = state.entities[id];
			if(project === undefined) throw new StoreException(`You rename nonexisting project.`, action.payload);
			project.name = action.payload.name;
		},
		deleteProject: (state, action: PayloadAction<Key>) =>
		{
			const id = action.payload;
			if(state.selected === id) state.selected = null; 
			delete state.entities[id];
			state.ids.splice(state.ids.indexOf(id), 1);
		},
	}
});

export const selectProjects = (state: StoreState) => state.projects.ids;
export const selectProjectById = (id: string) => (state: StoreState) : Project | null => state.projects.entities[id] ?? null;
export const selectSelectedProject = (state: StoreState) : Project | null => state.projects.selected ? state.projects.entities[state.projects.selected] ?? null : null;

const selectProject = (projectId: Key) => (dispatch: StoreDispatch, getState: GetStoreState) =>
{
	const { projects } = getState();
	const { selectProject } = Projects.actions;
	if(projects.ids.includes(projectId)) 
	{
		dispatch(changeKey(projectId));
		dispatch(selectProject(projectId));
	}
}

const loadFile = (files: Array<File>) => (dispatch: StoreDispatch, getState: GetStoreState) =>
{
	const { projects, pages } = getState();
	const { addProject } = Projects.actions;
	
	if(files.length === 0) throw new StoreException(`Array of files is empty.`, {type: `projects/loadFile`, payload: files});
	
	// create project:
	let id = getRandomId(10);
	while(projects.ids.includes(id)) id = getRandomId(10);
	const name = files[0] ? trimFileExtension(files[0].name) : "";
	dispatch(addProject({id, name}));
	dispatch(selectProject(id));
	
	// load files:
	let counter = pages.ids.length;
	files.forEach((file) => {
		const id = (counter++).toString();
		const evenOdd = (counter % 2) ? 'eve' : 'odd';
		const name = `page-${evenOdd}-${id}`;
		const url = URL.createObjectURL(file);
		const page : Page = {id: id, status: "Idle", url: url, name: name};
		const metric : Metric = {id: id, status: "Idle", details: null, x1: 10, x2:150, y1: 10, y2: 250, rotate: 0};
		const ocr: Ocr = {id: id, status: "Idle", details: null, text: "", lines: [], words: []};
		dispatch(addPage(page));
		dispatch(addMetric(metric));
		dispatch(addOcr(ocr));
	});
};


export const { renameProject, deleteProject } = Projects.actions;
export { selectProject, loadFile };

export type { Project };
export default Projects;
