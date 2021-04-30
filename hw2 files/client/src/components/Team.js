import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';

import TeamRow from './TeamRow'

export default class Team extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component. This component maintains the list of keywords,
    // and a list of movies for a specified keyword.
    this.state = {
      name: this.props.name,
    };

    // this.handleNameChange = this.handleNameChange.bind(this);
    // this.showTeamLeague = this.showTeamLeague.bind(this);

    // console.log("hello", this.state.name)
	};

	// handleNameChange(e) {
	// 	this.setState({
	// 		name: e.target.value
	// 	});
    
  // };

  // React function that is called when the page load.
  componentDidMount() {
    // Send an HTTP request to the server.
    fetch("http://localhost:8081/teams/" + this.state.name,
    {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.

      return res.json();
    }, err => {
      console.log(err);
    }).then(res => {
      if (!res) return;

      console.log(res)
      
      // Set the state of the keywords list to the value returned by the HTTP response from the server.
      this.setState({
        name: res[0]
      });
    }, err => {
      // Print the error if there is one.
      console.log(err);
    });
  };


  // // Show players of teams when a team is called
  // showTeamLeague() {
  //   // Send an HTTP request to the server.
  //   fetch("http://localhost:8081/teams/" + this.state.name,
  //   {
  //     method: 'GET' // The type of HTTP request.
  //   }).then(res => {
  //     // Convert the response data to a JSON.

  //     return res.json();
  //   }, err => {
  //     console.log(err);
  //   }).then(nameList => {
  //     if (!nameList) return;

  //     // Map each keyword in this.state.keywords to an HTML element:
  //     // A button which triggers the showMovies function for each keyword.
  //     const nameDivs = nameList.map((nameObj, i) =>
  //       // <p> team 1 </p>
  //       <TeamRow
  //         name={nameObj.name}
  //     />
  //     );
  //     console.log(nameDivs)

  //     // Set the state of the keywords list to the value returned by the HTTP response from the server.
  //     this.setState({
  //       name: nameDivs
  //     });
  //   }, err => {
  //     // Print the error if there is one.
  //     console.log(err);
  //   });
  // };

  render() {
    return (
      <div className="Dashboard">
        <PageNavbar active="dashboard" />

        <br />
        <div className="container movies-container">
          <div className="jumbotron">
            <div className="h5">Team Profile: Arsenal</div>
            <div className="keywords-container">
              {this.state.name}
            </div>
            <div> Country : England</div>
            <div> League : EPL </div>
            <div> Record : 14-8-14 </div>
            <div> Average Age (Using 90s): 26.5</div>
            <div> Home win % : 40% </div>
            <div> Away win % : 35%</div>
            <div> xG/90 : 1.4</div>
            <div> xGA/90 : 1.1</div>
          </div>

          <br />
          <div className="jumbotron">
            <div className="h5">xG Trendline</div>
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
          
          <div className="jumbotron">
            <div className="h5">Player xG Contribution Stats</div>
            <div className="keywords-container">
              {this.state.name}
            </div>
          </div>
          
          <div className="jumbotron">
            <div className="h5">Player Ball Progression</div>
            <div className="keywords-container">
              {this.state.name}
            </div>
          </div>

          <div className="jumbotron">
            <div className="h5">Best Opponents</div>
            <div className="keywords-container">
              {this.state.name}
            </div>
          </div>

        </div>
        </div>
    );
  };
};
