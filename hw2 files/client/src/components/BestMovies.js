import React from 'react';
import PageNavbar from './PageNavbar';
import BestMoviesRow from './BestMoviesRow';
import '../style/BestMovies.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class BestMovies extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedDecade: "",
			selectedGenre: "",
			decades: [],
			genres: [],
			movies: []
		};

		this.submitDecadeGenre = this.submitDecadeGenre.bind(this);
		this.handleDecadeChange = this.handleDecadeChange.bind(this);
		this.handleGenreChange = this.handleGenreChange.bind(this);
	};

	/* ---- Q3a (Best Movies) ---- */
	componentDidMount() {
		// Send an HTTP request to the server.
    fetch("http://localhost:8081/genres",
    {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(genresList => {
			console.log(genresList);
      if (!genresList) return;

      // Map each keyword in this.state.keywords to an HTML element:
      // A button which triggers the showMovies function for each keyword.
      const genresDivs = genresList.map((genresObj, i) =>
        <option className="genresOption" value={genresObj.name}>
					{genresObj.name}
				</option>
      );

      // Set the state of the genres list to the value returned by the HTTP response from the server.
      this.setState({
        genres: genresDivs
      });
    }, err => {
      // Print the error if there is one.
      console.log(err);
    });

		// Send an HTTP request to the server.
    fetch("http://localhost:8081/decades",
    {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(decadesList => {
			console.log(decadesList);
      if (!decadesList) return;

      // Map each keyword in this.state.keywords to an HTML element:
      // A button which triggers the showMovies function for each keyword.
      const decadesDivs = decadesList.map((decadesObj, i) =>
        <option className="decadesOption" value={decadesObj.decade}>
					{decadesObj.decade}
				</option>
      );

			console.log(decadesDivs);

      // Set the state of the genres list to the value returned by the HTTP response from the server.
      this.setState({
        decades: decadesDivs
      });
    }, err => {
      // Print the error if there is one.
      console.log(err);
    });
	};

	/* ---- Q3a (Best Movies) ---- */
	handleDecadeChange(e) {
		this.setState({
			selectedDecade: e.target.value
		});
		console.log(this.state.selectedDecade);
	};

	handleGenreChange(e) {
		this.setState({
			selectedGenre: e.target.value
		});
		console.log(this.state.selectedGenre);
	};

	/* ---- Q3b (Best Movies) ---- */
	submitDecadeGenre() {
		fetch("http://localhost:8081/best-movies/" + this.state.selectedDecade
																							 + "/"
																							 + this.state.selectedGenre, {
			method: "GET"
		})
			.then(res => res.json())
			.then(moviesList => {
				console.log(moviesList); //displays your JSON object in the console
				let moviesDivs = moviesList.map((movieObj, i) =>
					<BestMoviesRow
						title={movieObj.title}
						movie_id={movieObj.movie_id}
						rating={movieObj.rating}
					/>
				);

				//This saves our HTML representation of the data into the state, which we can call in our render function
				this.setState({
					movies: moviesDivs
				});
			}, err => {
        // Print the error if there is one.
        console.log(err);
      });
	};

	render() {
		return (
			<div className="BestMovies">

				<PageNavbar active="bestgenres" />

				<div className="container bestmovies-container">
					<div className="jumbotron">
						<div className="h5">Best Movies</div>
						<div className="dropdown-container">
							<select value={this.state.selectedDecade} onChange={this.handleDecadeChange} className="dropdown" id="decadesDropdown">
								{this.state.decades}
							</select>
							<select value={this.state.selectedGenre} onChange={this.handleGenreChange} className="dropdown" id="genresDropdown">
								{this.state.genres}
							</select>
							<button className="submit-btn" id="submitBtn" onClick={this.submitDecadeGenre}>Submit</button>
						</div>
					</div>
					<div className="jumbotron">
						<div className="movies-container">
							<div className="movie">
			          <div className="header"><strong>Title</strong></div>
			          <div className="header"><strong>Movie ID</strong></div>
								<div className="header"><strong>Rating</strong></div>
			        </div>
			        <div className="movies-container" id="results">
			          {this.state.movies}
			        </div>
			      </div>
			    </div>
			  </div>
			</div>
		);
	};
};
