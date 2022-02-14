import { pick } from "lodash";

type Middleware = {dispatch: any, getState: any};
type Action = {type: string, payload?: any}

enum Actions 
{ 
	changeKey = "localStorage/changeKey",
	loadItem = "localStorage/loadItem"
};

const storeItemInStorage = (key: string, value: any) =>
{
	try
	{
		localStorage.setItem(key, JSON.stringify(value));
		return true;
	}
	catch(e : unknown)
	{
		console.error(`Cant convert object to JSON string.`, e);
		return false;
	}
}

const loadItemFromStorage = (key: string) =>
{
	const item = localStorage.getItem(key);
	if(item === null) return null;
	try{
		return JSON.parse(item);
	}
	catch(e: unknown)
	{
		console.error(`Item under ${key} is invalid JSON.`, e);
		return null;
	}
}

const filterObject = (object: any, properties: Array<string>) =>
{
	return pick(object, properties);
}

const changeKey = (key: string) =>
{
	return {type: Actions.changeKey, payload: key};
}

const loadItem = (key: string) =>
{
	return {type: Actions.loadItem, payload: key};
}
type setting = { key: string | null, slices: Array<string>} 
type settings = {[index: string] : setting };
const LocalStorage = (prefix: string, settings: settings) =>
{
	const settingsPaths = Object.keys(settings);
	var customKey = "";

	return (middleware: Middleware) => (next: any) => (action: Action) =>
	{
		const result = next(action);
		
		// handle internal middleware actions:
		if(action.type.startsWith('localStorage'))
		{
			switch(action.type)
			{
				case Actions.changeKey:
					customKey = action.payload;
					return;
					
				case Actions.loadItem:
					const key = [prefix, action.payload].join('.');
					const item = loadItemFromStorage(key);
					console.log('load', key, item);
					if(item === null) return;
					Object.entries(item).forEach(([name, slice]) => { middleware.dispatch({type: `localStorage/${name}`, payload: slice}); });
					return;
				
				default:
					return;
			}
		}
		
		// save state into localStorage:
		const settingId = settingsPaths.find(path => action.type.startsWith(path));
		if(settingId !== undefined)
		{
			const setting = settings[settingId] as setting;
			const id = setting.key ?? customKey;
			const key = [prefix, id].join('.');
			const state = filterObject(middleware.getState(), setting?.slices);
			console.log('save', action, key, state);
			storeItemInStorage(key, state);
		}
		return result;
	}
}

export default LocalStorage;
export {changeKey, loadItem};