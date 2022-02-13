import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { GetStoreState, StoreDispatch, StoreState } from "./store";
import StoreException from "./lib/storeException";

type Key = string;
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
	ids: ["123", "124", "125"],
	entities: {
		"123": {id: "123", name: "Project 1"},
		"124": {id: "124", name: "Project 2"},
		"125": {id: "125", name: "Some long book name"},
	},
	selected: null,
}

const Projects = createSlice({
	name: "projects",
	initialState: InitialState,
	reducers: 
	{
		selectProject: (state, action: PayloadAction<Key>) =>
		{
			const id = action.payload;
			if(state.ids.includes(id) === false) throw new StoreException(`You select nonexisting project.`, action.payload);
			state.selected = id;
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
			delete state.entities[id];
			state.ids.splice(state.ids.indexOf(id), 1);
		},
	}
});

export const selectProjects = (state: StoreState) => state.projects.ids;
export const selectProjectById = (id: string) => (state: StoreState) : Project | null => state.projects.entities[id] ?? null;
export const selectSelectedProject = (state: StoreState) : Project | null => state.projects.selected ? state.projects.entities[state.projects.selected] ?? null : null;


const loadProjects = (key: string) => (dispatch: StoreDispatch, getStore: GetStoreState) =>
{
	return new Promise((resolve, reject) => {
		const stored = localStorage.getItem(key);
		console.log("load projects");
		if(stored === null) return;
		const store = JSON.parse(stored);
		Object.entries(store).forEach(([slice, state]) => {
			console.log(slice, state);
		});
		
		resolve(true);
	});
}

export const { selectProject, renameProject, deleteProject } = Projects.actions;
export { loadProjects };

export type { Project };
export default Projects;
