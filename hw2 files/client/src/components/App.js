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
import Team from './Team';
import League from './League';

export default class App extends React.Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						{/* Routes */}
						<Route
							exact
							path="/"
							render={() => <Player />}
						/>
						
						<Route
							exact
							path="/players"
							render={() => <Player />}
						/>

						<Route
							exact
							path="/teams"
							render={() => <Team />}
						/>

						<Route
							exact
							path="/leagues"
							render={() => <League />}
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