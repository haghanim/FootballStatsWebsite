/**
 * Frontend component that handles the League page. This is where all the subcomponents
 * are dealt with. This helps organize the high end HTML organization as well as organize 
 * how the subcomponents are displayed on the page. 
 * 
 * This page is called from ../App.js given a certain URL and it returns an HTML page after 
 * referencing subcomponents. 
 */

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import '../style/main.css';
import Paper from '@material-ui/core/Paper';
import Table from 'react-bootstrap/Table';
import Grid from '@material-ui/core/Grid';
import '../style/main.css';
import api from '../api';
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
import ReactDOM from "react-dom";

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

/** 
 * States all of the on click actions. A click will display the data for the league
 * that has been clicked
 */ 
export default class League extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keywords: [],
      name: "",
      country: "",
      stats: {},
      im: "https://yamn.s3.amazonaws.com/ucl.png"
    };

    this.onClickP = this.onClickP.bind(this);
    this.onClickE = this.onClickE.bind(this);
    this.onClickC = this.onClickC.bind(this);
    this.onClickLa = this.onClickLa.bind(this);
    this.onClickLi = this.onClickLi.bind(this);
    this.onClickB = this.onClickB.bind(this);
    this.onClickS = this.onClickS.bind(this);

  };

  //Onclicks for each button which will render the leagues
  onClickP() {

    api.leagues.getLeagueProfile('eng Premier League')
    .then((apiLeagueInfo) => {
      console.log(apiLeagueInfo);
      this.setState({
        name: "Premier League",
        country: "England",
        stats: apiLeagueInfo,
        im: apiLeagueInfo.leagueLogo[0].img_src
      });
    })


  };

  onClickE() {

    api.leagues.getLeagueProfile('Europa League')
    .then((apiLeagueInfo) => {
      console.log(apiLeagueInfo);
      this.setState({
        name: "Europa League",
        country: "International",
        stats: apiLeagueInfo,
        im: apiLeagueInfo.leagueLogo[0].img_src
      });
    })


  };

  onClickC() {

    api.leagues.getLeagueProfile('ucl')
    .then((apiLeagueInfo) => {
      console.log(apiLeagueInfo);
      this.setState({
        name: "Champions League",
        country: "International",
        stats: apiLeagueInfo,
        im: apiLeagueInfo.leagueLogo[0].img_src
      });
    })


  };

  onClickLa() {

    api.leagues.getLeagueProfile('es La Liga')
    .then((apiLeagueInfo) => {
      console.log(apiLeagueInfo);
      this.setState({
        name: "La Liga",
        country: "Spain",
        stats: apiLeagueInfo,
        im: apiLeagueInfo.leagueLogo[0].img_src
      });
    })


  };

  onClickLi() {

    api.leagues.getLeagueProfile('fr Ligue 1')
    .then((apiLeagueInfo) => {
      console.log(apiLeagueInfo);
      this.setState({
        name: "Ligue 1",
        country: "France",
        stats: apiLeagueInfo,
        im: apiLeagueInfo.leagueLogo[0].img_src
      });
    })


  };

  onClickB() {

    api.leagues.getLeagueProfile('de Bundesliga')
    .then((apiLeagueInfo) => {
      console.log(apiLeagueInfo);
      this.setState({
        name: "Bundesliga",
        country: "Germany",
        stats: apiLeagueInfo,
        im: apiLeagueInfo.leagueLogo[0].img_src
      });
    })


  };

  onClickS() {

    api.leagues.getLeagueProfile('it Serie A')
    .then((apiLeagueInfo) => {
      console.log(apiLeagueInfo);
      this.setState({
        name: "Serie A",
        country: "Italy",
        stats: apiLeagueInfo,
        im: apiLeagueInfo.leagueLogo[0].img_src
      });
    })


  };


  /**
	 * Creates a list of the buttons for all of the leagues  
	 */
  componentDidMount() {

    var keywordsList = [{ kwd_name: "Champions League" }, { kwd_name: "Europa League" }, { kwd_name: "Premier League" }, { kwd_name: "Ligue 1" }, { kwd_name: "La Liga" }, { kwd_name: "Serie A" }, { kwd_name: "Bundesliga" }, ];


    const keywordsDivs = [<button type="button" class="btn btn-primary pad" onClick = {this.onClickC}>Champions League</button>,
    <button type="button" class="btn btn-primary pad" onClick = {this.onClickE}>Europa League</button>,
    <button type="button" class="btn btn-primary pad" onClick = {this.onClickP}>Premier League</button>,
    <button type="button" class="btn btn-primary pad" onClick = {this.onClickLa}>La Liga</button>,
    <button type="button" class="btn btn-primary pad" onClick = {this.onClickLi}>Ligue 1</button>,
    <button type="button" class="btn btn-primary pad" onClick = {this.onClickB}>Bundesliga</button>,
    <button type="button" class="btn btn-primary pad" onClick = {this.onClickS}>Serie A</button>];


    //Initializes the page with a call for the Champions League data
    api.leagues.getLeagueProfile('ucl')
      .then((apiLeagueInfo) => {
        console.log(apiLeagueInfo);
        this.setState({
          name: "Champions League",
          country: "International",
          stats: apiLeagueInfo,
          keywords: keywordsDivs,
          im: apiLeagueInfo.leagueLogo[0].img_src
        });
      })

  };

  /**
   * HTML section of the file. This will utilize the local data object to display HTML sections specific
   * to the league. Essentially this file dynamically displays the league profile info that we have access
   * to after organization from the function above. 
   */
  render() {
    return (
      <div className="Dashboard">

        <PageNavbar active="dashboard" />

        <br />

        {/* Displays the select league dropdown */}
        <div className="container main-container">
          <div className="j3">
            <div className="let" ><h4>SELECT LEAGUE:</h4></div>
            <div className="keywords-container">
              {this.state.keywords}
            </div>
          </div>

          <br />

          <div className="league-info-container">
            <div className="results-container" id="results">
              <Grid container spacing={4} align="center" justify="center" alignItems="center">
                <Grid item xs={4} >
                  <Paper class="ted" ><h3 class="hed"><strong>{this.state.name} Info </strong></h3></Paper>

                  <Table striped bordered variant="light">

                    <tbody>
                      <tr>
                      <td colSpan= "3"> <img src= {this.state.im} className="photo" alt="new"/></td>
                      <td><p class = "vert"><strong>Country:</strong>  {this.state.country} </p> </td>
                        </tr>
                    </tbody>
                  </Table>
                </Grid>
              </Grid>
          .

             {/* Displays the historical league table */}
          <Grid container spacing={4} align="center" justify="right" alignItems="center">
                <Grid item xs={5} borderRadius={16} borderColor="primary.main">

                  <Paper class="ted" ><h3 class="led"><strong> Historical League Table </strong></h3></Paper>
                  <MaterialTable
                            icons={tableIcons}
                            style={{ width: 450 }}
                            columns={[
                              { title: "Historical Ranking", field: "rank" },
                                { title: "Team Name", field: "team_name" },
                                { title: "Aggregated Points", field: "points" },
                            ]}
                            data={this.state.stats.historicalLeagueTable
                            }
                            title=""
                        />

                </Grid>

                {/* Displays the home and away goals difference amongst teams table */}
                <Grid item xs={7} borderRadius={16} borderColor="primary.main">
                  <Paper class="ted" ><h3 class="led"><strong> Home/Away Goal Differentials </strong></h3></Paper>
                  <MaterialTable
                            icons={tableIcons}
                            style={{ width: 630 }}
                            columns={[
                                { title: "Team Name", field: "team_name" },
                                { title: "Home Goal Differential", field: "home_goal_diff" },
                                { title: "Away Goal Differential", field: "away_goal_diff" },
                                { title: "Total Differential", field: "differential" },
                            ]}
                            data={this.state.stats.homeVsAwayGoalDifferential
                            }
                            title=""
                        />
                </Grid>

                
                {/* Displays the offensive stats for all teams in the league */}
                <Grid item xs={13} borderRadius={16} borderColor="primary.main">

                  <Paper class="ted" ><h3 class="led"><strong> Offensive Stats </strong></h3></Paper>
                  <MaterialTable
                            icons={tableIcons}
                            style={{ width: 1200 }}
                            columns={[
                                { title: "Team Name", field: "team" },
                                { title: "Season", field: "season" },
                                { title: "xG per Game", field: "xG_per_Game" },
                                { title: "Assisted Shots per Game", field: "Assisted_Shots_per_Game" },
                                { title: "Cross Pass Completion %", field: "Comp_Crosses_as_pct_of_Comp_Passes" },
                                { title: "Crosses into 18yd Box per game", field: "Comp_Crosses_into_18yd_Box_per_Game" },
                                { title: "Passes into 18yd Box per game", field: "Comp_Passes_into_18yd_Box_per_Game" },
                                { title: "Goal Creating Actions per Game", field: "Goal_Creating_Actions_per_Game" },
                                { title: "Shot Creating Actions per Game", field: "Shot_Creating_Actions_per_Game" },
                                { title: "Non Penalty xG per Shot per Game", field: "npxG_per_Shot_per_Game" },

                            ]}
                            data={this.state.stats.teamOffensiveStats
                            }
                            title=""
                        />

                </Grid>

                {/* Displays the defensive stats for all teams in the league */}
                <Grid item xs={13} borderRadius={16} borderColor="primary.main">
                  <Paper class="ted" ><h3 class="led"><strong> Defensive Stats </strong></h3></Paper>
                  <MaterialTable
                            icons={tableIcons}
                            style={{ width: 1200 }}
                            columns={[
                                { title: "Team Name", field: "team" },
                                { title: "Season", field: "season" },
                                { title: "Attacking 3rd Tackles", field: "Att 3rd Tackles" },
                                { title: "Attacking 3rd Tackles %", field: "Att 3rd Tackles %" },
                                { title: "Errors Leading to Shots", field: "Errors to shots" },
                                { title: "Fouls", field: "Fouls" },
                                { title: "Successful Pressures", field: "Successful Pressures" },
                                { title: "Tackles + Interceptions", field: "Tackles + Int" },
                                { title: "Tackles Won", field: "Tackles Won" },

                            ]}
                            data={this.state.stats.teamDefensiveStats
                            }
                            title=""
                        />

                </Grid>
              </Grid>
            </div>
          </div>
        </div>
      </div>

    );
  };
};
