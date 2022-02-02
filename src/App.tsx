import React from 'react';
import css from './App.module.scss';

import Header from "./components/Header";
import List from "./components/List";
import Footer from "./components/Footer";
import Main from "./components/Main";

function App() {
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
