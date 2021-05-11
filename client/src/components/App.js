/**
 * Central app component which handles the first line of client interaction. 
 * This app component reads in the URL and refers the client to a specific frontend 
 * component based on the URL. App.js will organize the frontend components and 
 * provide the connection between URL's and what is displayed on the frontend.
 */

import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';

import Player from './Player';
import Team from './Teams';
import League from './League';
import Teams from './Teams';
import PlayerProfile from './PlayerProfile';
import TeamProfile from './TeamProfile';

export default class App extends React.Component {

	/**
	 * HTML section of the file. This will utilize the local data object to display HTML sections specific
	 * to the App. Essentially this file dynamically displays the App profile info that we have access
	 * to after organization from the function above. 
	 */
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
							path="/players/profile/:playerId"
							render={() => <PlayerProfile />}
						/>

						<Route
							exact
							path="/teams"
							render={() => <Teams />}
						/>

						<Route
							path="/teams/profile/:teamId"
							render={() => <TeamProfile />}
						/>

						<Route
							exact
							path="/leagues"
							render={() => <League />}
						/>

						
					</Switch>
				</Router>
			</div>
		);
	};
};