import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';

import TeamRow from './TeamRow'

export default class League extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component. This component maintains the list of keywords,
    // and a list of movies for a specified keyword.
    this.state = {
      name: this.props.name,
    };

    this.handleNameChange = this.handleNameChange.bind(this);
    this.showTeamLeague = this.showTeamLeague.bind(this);

    console.log("hello", this.state.name)
	};

	handleNameChange(e) {
		this.setState({
			name: e.target.value
		});
    
  };

  // React function that is called when the page load.
  componentDidMount() {
    // Send an HTTP request to the server.
    fetch("http://localhost:8081/leagues/",
    {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.

      return res.json();
    }, err => {
      console.log(err);
    }).then(nameList => {
      if (!nameList) return;

      // Map each keyword in this.state.keywords to an HTML element:
      // A button which triggers the showMovies function for each keyword.
      const nameDivs = nameList.map((nameObj, i) =>
        // <p> team 1 </p>
        <TeamRow
          name={nameObj.name}
      />
      );
      console.log(nameDivs)

      // Set the state of the keywords list to the value returned by the HTTP response from the server.
      this.setState({
        name: nameDivs
      });
    }, err => {
      // Print the error if there is one.
      console.log(err);
    });
  };


  // Show players of teams when a team is called
  showTeamLeague() {
    // Send an HTTP request to the server.
    fetch("http://localhost:8081/leagues/" + this.state.name,
    {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.

      return res.json();
    }, err => {
      console.log(err);
    }).then(nameList => {
      if (!nameList) return;

      // Map each keyword in this.state.keywords to an HTML element:
      // A button which triggers the showMovies function for each keyword.
      const nameDivs = nameList.map((nameObj, i) =>
        // <p> team 1 </p>
        <TeamRow
          name={nameObj.name}
      />
      );
      console.log(nameDivs)

      // Set the state of the keywords list to the value returned by the HTTP response from the server.
      this.setState({
        name: nameDivs
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
            <div className="h5">League Overview: EPL</div>
            <div className="keywords-container">
              {this.state.name}
            </div>
            <div> Country : England</div>
            <div> Average Age (Using 90s): 26.5</div>
          </div>

          <br />
          <div className="jumbotron">
            <div className="h5">Home and Away Performance Differences</div>
            <div className="keywords-container">
              {this.state.name}
            </div>
          </div>
          
          <div className="jumbotron">
            <div className="h5">Attacking Stats</div>
            <div className="keywords-container">
              {this.state.name}
            </div>
          </div>
          
          <div className="jumbotron">
            <div className="h5">Defensive Stats</div>
            <div className="keywords-container">
              {this.state.name}
            </div>
          </div>

        </div>
        </div>
    );
  };
};
