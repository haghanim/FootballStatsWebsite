import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import KeywordButton from './KeywordButton';
import DashboardMovieRow from './DashboardMovieRow';

export default class Team extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component. This component maintains the list of keywords,
    // and a list of movies for a specified keyword.
    this.state = {
      name: [],
      keywords: [],
      movies: []
    };


    this.showMovies = this.showMovies.bind(this);
  };

  // React function that is called when the page load.
  componentDidMount() {
    // Send an HTTP request to the server.
    fetch("http://localhost:8081/teams",
    {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(keywordsList => {
      if (!keywordsList) return;
      // Map each keyword in this.state.keywords to an HTML element:
      // A button which triggers the showMovies function for each keyword.
      const keywordsDivs = keywordsList.map((keywordObj, i) =>
        <KeywordButton
          id={"button-" + keywordObj.kwd_name}
          onClick={() => this.showMovies(keywordObj.kwd_name)}
          keyword={keywordObj.kwd_name}
        />
      );

      // Set the state of the keywords list to the value returned by the HTTP response from the server.
      this.setState({
        keywords: keywordsDivs
      });
    }, err => {
      // Print the error if there is one.
      console.log(err);
    });
  };

  /* ---- Q1b (Dashboard) ---- */
  /* Set this.state.movies to a list of <DashboardMovieRow />'s. */
  showMovies(keyword) {
    // Send an HTTP request to the server.
    fetch("http://localhost:8081/keywords/" + keyword,
    {
      method: 'GET' // The type of HTTP request.
    })
      .then(res => res.json())
      .then(moviesList => {
        console.log(moviesList) //displays your JSON object in the console
        let moviesDivs = moviesList.map((movieObj, i) =>
          <DashboardMovieRow
            title={movieObj.title}
            rating={movieObj.rating}
            num_ratings={movieObj.num_ratings}
          />
        );
        
        // Set the state of the movies list to the value returned by the HTTP response from the server.
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
      <div className="Dashboard">

        <PageNavbar active="dashboard" />

        <br />
        <div className="container movies-container">
          <div className="jumbotron">
            <div className="h5">Team Profile</div>
            <div className="keywords-container">
              {this.state.name}
            </div> 
          </div>

          <br />
          <div className="jumbotron">
            <div className="movies-container">
              <div className="movies-header">
                <div className="header-lg"><strong>Title</strong></div>
                <div className="header"><strong>Rating</strong></div>
                <div className="header"><strong>Vote Count</strong></div>
              </div>
              <div className="results-container" id="results">
                {this.state.name}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
};
