import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { GetStoreState, StoreDispatch, StoreState } from "./store";
import { changeKey, deleteItem, loadItem } from "./middleware/LocalStorage";
import { resetState } from "./store.reset";
import StoreException from "./lib/storeException";
import getRandomId from "./lib/getRandomId";

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

const SliceName = "projects";
const LoadProjectAction = createAction<InitialStateProjects>('localStorage/projects');
const Projects = createSlice({
	name: SliceName,
	initialState: InitialState,
	reducers: 
	{
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
	},
	extraReducers: (builder) => { builder
		.addCase(LoadProjectAction, (state, action) => {
			const projects = action.payload;
			projects.selected = null; // remove selected project.
			return projects;
		})
		.addCase(resetState, (state, action) => {
			if(action.payload.includes(SliceName)) return InitialState;
		});
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
		dispatch(selectProject(projectId));
		dispatch(changeKey(projectId));
		dispatch(loadItem(projectId));
	}
}

const createProject = (name?: string) => (dispatch: StoreDispatch, getState: GetStoreState) =>
{
	const { projects } = getState();
	const { addProject, selectProject } = Projects.actions;
	
	let projectId = getRandomId(10);
	let projectName = name ?? "New project";
	while(projects.ids.includes(projectId)) projectId = getRandomId(10); // make sure Id is unique
	for(let i=1; Object.values(projects.entities).some(project => project.name === projectName); i++) projectName = `New project (${i})`; // make sure name is unique
	
	dispatch(addProject({id: projectId, name: projectName}));
	dispatch(selectProject(projectId));
	dispatch(changeKey(projectId));
	dispatch(resetState(['pages', 'metrics', 'ocrs', 'gui']));
	dispatch(loadItem(projectId));
}

const deleteProject = (projectId: Key) => (dispatch: StoreDispatch, getState: GetStoreState) =>
{
	const { projects } = getState();
	const { deleteProject } = Projects.actions;
	if(projects.ids.includes(projectId)) 
	{
		dispatch(deleteProject(projectId));
		dispatch(deleteItem(projectId));
	}
}

export const { renameProject } = Projects.actions;
export { createProject, selectProject, deleteProject };

export type { Project };
export default Projects;
