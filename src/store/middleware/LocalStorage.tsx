import { Key } from "react";

type Middleware = {dispatch: any, getState: any};
type Action = {type: string, payload?: any}

enum Actions 
{ 
	changeKey = "localStorage/changeKey",
	loadItem = "localStorage/loadItem"
};

const storeKeyInStorage = (key: string, value: any) =>
{
	try
	{
		localStorage.setItem(key, JSON.stringify(value));
		return true;
	}
	catch(e : unknown)
	{
		console.error(`Cant convert object to JSON string.`, e);
	}
	finally
	{
		return false;
	}
}

const loadKeyFromStorage = (key: string) =>
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
	finally
	{
		return null;
	}
}

const changeKey = (key: string) =>
{
	return {type: Actions.changeKey, value: key};
}

const loadItem = (key: string) =>
{
	return {type: Actions.loadItem, value: key};
}

type settings = {[index: string] : string};
const LocalStorage = (prefix: string, settings?: settings) =>
{
	const slices = settings ? Object.keys(settings) : [];
	var custom = "";
	
	return (middleware: Middleware) => (next: any) => (action: Action) =>
	{
		const postfix = slices.find(slice => action.type.startsWith(slice)) ?? custom;
		const key = prefix + '.' + postfix;
		const result = next(action);
		if(action.type === Actions.changeKey)
		{
			custom = action.payload;
			return;
		}
		if(action.type === Actions.loadItem)
		{
			const store = loadKeyFromStorage(key);
			if(store === null) return;
			Object.entries(store).forEach(([name, slice]) =>{
				console.log('load item', name, slice);
				middleware.dispatch({type: `${name}/load`, payload: slice});
			});
			return;
		}
		
		const state = middleware.getState();
		const filter = postfix ? state[postfix] : state;
		storeKeyInStorage(key, filter);
		return result;
	}
}

export default LocalStorage;
export {changeKey, loadItem};