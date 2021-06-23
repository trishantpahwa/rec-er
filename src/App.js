import React, { useEffect } from 'react';

import { Home, Blog } from './pages';
import { Switch, Route } from 'react-router-dom';

import { UsersService } from './services';

import './App.css';

function App() {
	function logPageRoute() {
		// Removed for dev! Don't push to git
		window.gtag('event', 'page_view', {
			page_location: window.location.href,
			page_path: window.location.pathname,
			page_title: 'Wrec-er ' + window.location.pathname
		});
	}

	useEffect(() => {
		UsersService.checkSession();
	}, []);

	return (
		<div className="App">
			<Switch>
				<Route exact path="/" component={Home} />
				<Route path="/blog/:id" component={Blog} />
			</Switch>
		</div>
	);
}

export default App;
