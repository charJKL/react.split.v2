import React from 'react';
import logo from './logo.svg';
import css from './App.module.scss';

import Header from "./components/Header";
import List from "./components/List";
import Footer from "./components/Footer";

function App() {
	return (
		<>
			<header className={css.header}>
				<Header />
			</header>
			<section className={css.list}>
				<List />
			</section>
			<main className={css.main}> 
				asd
			</main>
			<footer className={css.footer}>
				<Footer />
			</footer>
		</>
	);
}

export default App;
