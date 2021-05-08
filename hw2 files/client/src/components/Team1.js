import React from 'react';
import '../style/Player.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';

import TeamRow from './TeamRow'

import MaterialTable from "material-table";
import { forwardRef } from 'react';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
}; 

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
            <div className="h3 text-center mb-5">Teams Database</div>
            <div style={{ maxWidth: "100%" }}>
              
        <MaterialTable
        icons={tableIcons}
          columns={[
            { title: "Team", field: "Team" },
            { title: "Country", field: "Country" },
            { title: "League", field: "League" },
            
          ]}
          data={[
            {
              Team: "Barcelona",
              Country: "Spain",
              League: "La Liga",
            },
            {
              Team: "Real Madrid",
              Country: "Spain",
              League: "La Liga",
            },
            {
              Team: "Man City",
              Country: "England",
              League: "Premier League",
            },
            {
              Team: "Chelsea",
              Country: "England",
              League: "Premier League",
            },
            {
              Team: "Bayern Munich",
              Country: "Germany",
              League: "Bundesliga",
            },
            {
              Team: "PSG",
              Country: "France",
              League: "Ligue 1",
            },
            {
              Team: "Juventus",
              Country: "Italy",
              League: "Serie A",
            }
          ]}
          title=""
        />
      </div>
            <div className="keywords-container">
              {this.state.keywords}
            </div> 
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
