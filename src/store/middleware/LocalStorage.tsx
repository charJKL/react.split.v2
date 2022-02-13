type Middleware = {dispatch: any, getState: any};
type Action = {type: string, payload?: any}

const localStorageKey = "epub.split.key";
const loadActionKey = "localStorage/load";

const load = (id: string) =>
{
	return {type: loadActionKey, payload: id};
}

const LocalStorage = (middleware: Middleware) => (next: any) => (action: Action) =>
{
	if(action.type == loadActionKey)
	{
		const key = action.payload as string;
		const store = loadKeyFromStorage(key);
		if(store === null) return;
		Object.entries(store).forEach(([name, slice]) =>{
			console.log(name, slice);
			middleware.dispatch({type: `${name}/load`, payload: slice});
		});
		return;
	}

	const result = next(action);
	
	// Store redux state int localStorage:
	if(action.type.startsWith('projects'))
	{
		console.log('store action', action);
		storeKeyInStorage('projects', middleware.getState());
	}
	
	return result;
}

const storeKeyInStorage = (key: string, value: any) =>
{
	try
	{
		localStorage.setItem(localStorageKey, JSON.stringify(value));
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

export default LocalStorage;
export {load};