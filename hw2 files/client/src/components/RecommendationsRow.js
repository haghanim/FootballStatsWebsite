import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class RecommendationsRow extends React.Component {
	/* ---- Q2 (Recommendations) ---- */
	render() {
		return (
			<div className="movieResults">
				<div className="title">TITLE</div>
				<div className="id">MOVIE_ID</div>
				<div className="rating">RATING</div>
				<div className="votes">NUM_RATINGS</div>
			</div>
		);
	};
};
