import { useEffect } from 'react';
import { useAppDispatch } from './store/store.hooks';
import { loadItem } from "./store/middleware/LocalStorage";
import css from './App.module.scss';

import Header from "./components/Header";
import List from "./components/List";
import Footer from "./components/Footer";
import Main from "./components/Main";

function App() {
	const dispatch = useAppDispatch();

	useEffect(()=>{
		dispatch(loadItem("projects"));
	}, []);
	
	
	useEffect(() =>{
		// https://bugzilla.mozilla.org/show_bug.cgi?id=801176
		if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
			alert("Firefox doesn't support `OffscreenCanvas`, henve tesseract will not work.");
		}
	}, [])
	
	return (
		<>
			<Header className={css.header}/>
			<List className={css.list}/>
			<Main className={css.main}/>
			<Footer className={css.footer}/>
		</>
	);
}

export default App;
