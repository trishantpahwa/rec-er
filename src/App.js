import React, { useEffect } from 'react';

import { Home, Blog } from './pages';
import { Switch, Route } from 'react-router-dom';

import { UsersService } from './services';

import './App.css';

function App() {

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
