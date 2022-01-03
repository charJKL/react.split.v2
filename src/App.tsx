import React from 'react';
import logo from './logo.svg';
import css from './App.module.scss';

import Header from "./components/Header";
import List from "./components/List";
import Footer from "./components/Footer";

function App() {
	return (
		<>
			<Header className={css.header}/>
			<List className={css.list}/>
			<main className={css.main}> 
				
			</main>
			<Footer className={css.footer}/>
		</>
	);
}

export default App;
