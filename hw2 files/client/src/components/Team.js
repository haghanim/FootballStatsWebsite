import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';

export default class Team extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component. This component maintains the list of keywords,
    // and a list of movies for a specified keyword.
    this.state = {
      names: [],
    };

  };

  // React function that is called when the page load.
  componentDidMount() {
    // Send an HTTP request to the server.
    fetch("http://localhost:8081/teams",
    {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      
      console.log("hello")

      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(namesList => {
      if (!namesList) return;

      // Map each keyword in this.state.keywords to an HTML element:
      // A button which triggers the showMovies function for each keyword.
      const namesDivs = namesList.map((namesObj, i) =>
        <div> Example Team Name </div>
      );
      console.log("hello")

      // Set the state of the keywords list to the value returned by the HTTP response from the server.
      this.setState({
        names: namesDivs
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
              {this.state.names}
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
                {this.state.names}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
};
