import React from 'react';
import '../style/Player.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import KeywordButton from './KeywordButton';
import DashboardMovieRow from './DashboardMovieRow';
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
import api from '../api';

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

export default class Player extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component. This component maintains the list of keywords,
    // and a list of movies for a specified keyword.
    this.state = {
      playersList = [],
    };

    this.showPlayers = this.showPlayers.bind(this);
  };

  // React function that is called when the page load.
  componentDidMount() {
    // Send an HTTP request to the server.
    // fetch("http://localhost:8081/players",
    // {
    //   method: 'GET' // The type of HTTP request.
    // }).then(res => {
    //   // Convert the response data to a JSON.
    //   return res.json();
    // }, err => {
    //   // Print the error if there is one.
    //   console.log(err);
    // }).then(keywordsList => {
    //   if (!keywordsList) return;
    api.players.getAllPlayers().then((apiPlayersList) => {
      this.setState(
        {playersList: apiPlayersList}
      )
    })

      // Map each keyword in this.state.keywords to an HTML element:
      // A button which triggers the showMovies function for each keyword.
      
  };

  /* ---- Q1b (Dashboard) ---- */
  /* Set this.state.movies to a list of <DashboardMovieRow />'s. <div className="jumbotron">
            <div className="movies-container">
              <div className="movies-header">
                <div className="header-lg"><strong>Title</strong></div>
                <div className="header"><strong>Rating</strong></div>
                <div className="header"><strong>Vote Count</strong></div>
              </div>
              <div className="results-container" id="results">
                {this.state.movies}
              </div>
            </div>
          </div>*/
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
            <div className="h3 text-center mb-5">Player Database</div>
            <div style={{ maxWidth: "100%" }}>
              
        <MaterialTable
        icons={tableIcons}
          columns={[
            { title: "Name", field: "Name" },
            { title: "Club", field: "Club" },
            { title: "Birth Year", field: "BirthYear", type: "numeric" },
            {
              title: "Nationality",
              field: "Nationality",
            },
            {title: "Current Position", field: "Position"}
          ]}
          data={[
            {
              Name: "Leo Messi",
              Club: "Barcelona",
              BirthYear: 1987,
              Nationality: "Argentina",
              Position: "Midfield"
            },
            {
              Name: "Niko Mihailidis",
              Club: "Penn",
              BirthYear: 2000,
              Nationality: "USA",
              Position: "Forward"
            },
            {
              Name: "Yuan Han Li",
              Club: "Penn",
              BirthYear: 2000,
              Nationality: "USA",
              Position: "Midfield"
            },
            {
              Name: "Alan Frastai",
              Club: "Penn",
              BirthYear: 2000,
              Nationality: "USA",
              Position: "Winger"
            },
            {
              Name: "Mark Haghani",
              Club: "Penn",
              BirthYear: 1987,
              Nationality: "Defense",
              Position: "Midfield"
            },
            {
              Name: "Niko",
              Club: "Mihailidis",
              BirthYear: 2000,
              Nationality: "USA",
              Position: "Forward"
            },
          ]}
          title=""
        />
      </div>
            <div className="keywords-container">
              {this.state.keywords}
            </div> 
          </div>

          <br />
          
        </div>
      </div>
    );
  };
};