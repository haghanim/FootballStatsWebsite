/**
 * Frontend component that 
 */

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

export default class TeamRow extends React.Component {

	/* ---- Q1b (Team) ---- */
	/* Change the contents (NOT THE STRUCTURE) of the HTML elements to show a team row. */
	render() {
		return (
			<div className="team">
				<div className="name">{this.props.name}</div>
			</div>
		);
	};
};
