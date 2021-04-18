import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class BestGenreRow extends React.Component {
	/* ---- Q3b (Best Movies) ---- */
	render() {
		return (
			<div className="movieResults">
				<div className="title">TITLE</div>
				<div className="id">MOVIE_ID</div>
				<div className="rating">RATING</div>
			</div>
		);
	};
};
