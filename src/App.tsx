import React from 'react';
import css from './App.module.scss';

import Header from "./components/Header";
import List from "./components/List";
import Footer from "./components/Footer";
import EditorMetrics from './components/editors/EditorMetrics';

function App() {
	return (
		<>
			<Header className={css.header}/>
			<List className={css.list}/>
			<main className={css.main}> 
				<EditorMetrics />
			</main>
			<Footer className={css.footer}/>
		</>
	);
}

export default App;
