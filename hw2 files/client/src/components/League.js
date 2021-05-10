import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import DashboardMovieRow from './DashboardMovieRow';
import '../style/Player.css';
import Paper from '@material-ui/core/Paper';
import Table from 'react-bootstrap/Table';
import Grid from '@material-ui/core/Grid';
import '../style/Player.css';
import api from '../api';

export default class League extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keywords: [],
      stats: { Country: "Select a League", Age: "Select a League" }
    };

    this.showStats = this.showStats.bind(this);
  };


  componentDidMount() {

    var keywordsList = [{ kwd_name: "Premier League" }, { kwd_name: "Ligue 1" }, { kwd_name: "La Liga" }, { kwd_name: "Serie A" }, { kwd_name: "Bundesliga" }, { kwd_name: "Champions League" }, { kwd_name: "Europa League" }];


    const keywordsDivs = keywordsList.map((keywordObj, i) =>
      <button type="button" class="btn btn-primary pad">{keywordObj.kwd_name}</button>

    );

    this.setState({
      keywords: keywordsDivs
    });

    api.leagues.getLeagueProfile('ucl')
      .then((apiLeagueInfo) => {
        console.log(apiLeagueInfo);
      })

  };
  showStats() {

  };

  render() {
    return (
      <div className="Dashboard">

        <PageNavbar active="dashboard" />

        <br />
        <div className="container movies-container">
          <div className="j2 ">
            <div className="leg" ><h4>LEAGUES</h4></div>
            <div className="keywords-container">
              {this.state.keywords}
            </div>
          </div>

          <br />

          <div className="movies-container">
            <div className="results-container" id="results">
              <Grid container spacing={4} align="center" justify="center" alignItems="center">
                <Grid item xs={6} >
                  <Paper class="ted" ><h3 class="hed"><strong> League Info </strong></h3></Paper>

                  <Table striped bordered variant="light">

                    <tbody>
                      <tr>
                        <td><strong>Country:</strong></td>
                        <td>{this.state.stats.Country}</td>
                        <td><strong>Average Age:</strong></td>
                        <td>{this.state.stats.Age}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Grid>
              </Grid>
          .

          <Grid container spacing={4} align="center" justify="center" alignItems="center">
                <Grid item xs={6} borderRadius={16} borderColor="primary.main">

                  <Paper class="ted" ><h3 class="led"><strong> Home/Away Performance </strong></h3></Paper>
                  <Table striped bordered variant="light">

                    <thead>
                      <tr className="tab">
                        <td><strong>Val1</strong></td>
                        <td><strong>Val1</strong></td>
                        <td><strong>Val1</strong></td>
                        <td><strong>Val1</strong></td>
                      </tr>
                    </thead><tbody>
                      <tr className="tab">
                        <td>Val1</td>
                        <td>Val2</td>
                        <td>Val3</td>
                        <td>Val4</td>
                      </tr>
                    </tbody>
                  </Table>

                </Grid>
                <Grid item xs={6} borderRadius={16} borderColor="primary.main">
                  <Paper class="ted" ><h3 class="led"><strong> Defensive Stats </strong></h3></Paper>
                  <Table striped bordered variant="light">

                    <thead>
                      <tr className="tab">
                        <td><strong>Val1</strong></td>
                        <td><strong>Val1</strong></td>
                        <td><strong>Val1</strong></td>
                        <td><strong>Val1</strong></td>
                      </tr>
                    </thead><tbody>
                      <tr className="tab">
                        <td>Val1</td>
                        <td>Val2</td>
                        <td>Val3</td>
                        <td>Val4</td>
                      </tr>
                    </tbody>
                  </Table>
                </Grid>
                <Grid item xs={6} borderRadius={16} borderColor="primary.main">

                  <Paper class="ted" ><h3 class="led"><strong> Attacking Stats </strong></h3></Paper>
                  <Table striped bordered variant="light">

                    <thead>
                      <tr className="tab">
                        <td><strong>Val1</strong></td>
                        <td><strong>Val1</strong></td>
                        <td><strong>Val1</strong></td>
                        <td><strong>Val1</strong></td>
                      </tr>
                    </thead><tbody>
                      <tr className="tab">
                        <td>Val1</td>
                        <td>Val2</td>
                        <td>Val3</td>
                        <td>Val4</td>
                      </tr>
                    </tbody>
                  </Table>

                </Grid>
                <Grid item xs={6} borderRadius={16} borderColor="primary.main">

                  <Paper class="ted" ><h3 class="led"><strong> Historical League Table </strong></h3></Paper>
                  <Table striped bordered variant="light">

                    <thead>
                      <tr className="tab">
                        <td><strong>Val1</strong></td>
                        <td><strong>Val1</strong></td>
                        <td><strong>Val1</strong></td>
                        <td><strong>Val1</strong></td>
                      </tr>
                    </thead><tbody>
                      <tr className="tab">
                        <td>Val1</td>
                        <td>Val2</td>
                        <td>Val3</td>
                        <td>Val4</td>
                      </tr>
                    </tbody>
                  </Table>

                </Grid>
              </Grid>
            </div>
          </div>
        </div>
      </div>

    );
  };
};