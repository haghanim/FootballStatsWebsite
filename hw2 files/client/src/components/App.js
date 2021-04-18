import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';

// Delete
import Dashboard from './Dashboard';
import Recommendations from './Recommendations';
import BestMovies from './BestMovies';

// Import components 
import Player from './Player';

export default class App extends React.Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route
							exact
							path="/"
							render={() => <Player />}
						/>
						
						{/* Routes */}
						<Route
							exact
							path="/players"
							render={() => <Player />}
						/>
						
						{/* Delete later */}
						<Route
							exact
							path="/dashboard"
							render={() => <Dashboard />}
						/>
						<Route
							path="/recommendations"
							render={() => <Recommendations />}
						/>
						<Route
							path="/bestmovies"
							render={() => <BestMovies />}
						/>
					</Switch>
				</Router>
			</div>
		);
	};
};