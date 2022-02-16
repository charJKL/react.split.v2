
import type { GetStoreState, StoreDispatch, ThunkStoreTypes } from "./store";


const getTxtResult = () => (dispatch: StoreDispatch, getState: GetStoreState ) : Promise<Blob> => 
{
	const {ocrs} = getState();
	
	return new Promise((resolve, reject) =>{
		const text = Object.values(ocrs.entities).reduce((text, page) => text += page.text, "");
		const blob = new Blob([text], {type: "text/plain"});
		resolve(blob);
	});
}

export default getTxtResult;

