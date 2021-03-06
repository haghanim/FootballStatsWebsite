/**
 * Frontend component that handles the Team Profile page. This is where all the subcomponents
 * are dealt with. This helps organize the high end HTML organization as well as organize 
 * how the subcomponents are displayed on the page. 
 * 
 * This page is called from ../App.js given a certain URL and it returns an HTML page after 
 * referencing subcomponents. This paged is linked from the Team page after the client
 * clicks on a specific Team. 
 */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Chart from "react-apexcharts";
import '../style/main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import '../style/main.css';
import Table from 'react-bootstrap/Table';
import api from '../api';
import { useHistory } from "react-router-dom";


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(3),
    textAlign: 'center',
    color: theme.palette.text.Secondary,
    justify: 'center',
    container: true
  },
  color: {
    backgroundColor: '#f3f3f3f5'
  }
}));

/**
 * For display purposes, we map the league strings from the database 
 * to a prettier formatted league string. This is the standard format for
 * a league name.
 */
let dict = {
  'UCL' : 'Champions League',
  'eng Premier League' : 'Premier League',
  'es La Liga' : 'La Liga',
  'it Serie A' : 'Serie A',
  'de Bundesliga' : 'Bundesliga',
  'fr Ligue 1': 'Ligue 1',
  'Europa League': 'Europa League'
  }


  /**
   * Input: Data Object. 
   * Function that takes in data from the API fetch and displays the data by assigning it 
   * to components. This function displays these components. 
   * 
   * We call multiple subcomponents for visualization purposes. Furthermore we assign data to
   * these components by using useState(). 
   * 
   * Outputs: Visuals and general HTML. 
   */
export default function TeamProfile() {
  let { teamId } = useParams();
  const classes = useStyles();
  let history = useHistory();
  const [leg, setLeg] = useState("No data this year");
  const [dominant, setDominant] = useState({b1: "Not Enough Games Played", b2: "Not Enough Games Played", b3: "Not Enough Games Played", b4: "Not Enough Games Played"
                                            ,w1: "Not Enough Games Played", w2: "Not Enough Games Played", w3: "Not Enough Games Played", w4: "Not Enough Games Played"});
  const [teamInfo, setTeamInfo] = useState([]);
  const [year, setYear] = useState("2021");

  const [trendlineData, setTl] = useState({
    options: {
      chart: {
        id: "basic-bar"
      },
      stroke: {
        width: 1
      }
    },
    series: [
      {
        name: "n/a",
        data: [0]
      },
      {
        name: "n/A",
        data: [0]
      }
    ]
  });

  const [ballProgressionData, setBp] = useState({
    options: {
      chart: {
        id: "basic-bar"
      },
      xaxis: {
        categories: ['n/a'],
        title: {
          text: 'Player'
        }
      },
      yaxis: {
        title: {
          text: 'Ball Progression'
        }
      },
    },
    series: [
      {
        name: "Ball Progression",
        data: [0]
      }
    ]
  });

  const [xAxGData, setXga] = useState({
    options: {
      chart: {
        id: "basic-bar"
      },
      xaxis: {
        categories: ['n/a'],
        title: {
          text: 'Player'
        }
      },
      yaxis: {
        title: {
          text: 'Expected Goals + Assists % Contribution'
        }
      },
    },
    series: [
      {
        name: "xG + xA",
        data: [0]
      }
    ]
  });

  const [xgData, setXg] = useState({
    options: {
      chart: {
        id: "basic-bar"
      },
      xaxis: {
        categories: ['n/a'],
        title: {
          text: 'Player'
        }
      },
      yaxis: {
        title: {
          text: 'Expected Goals % Contribution'
        }
      },
    },
    chart: {
      background: '#111'
    },
    series: [
      {
        name: "xG",
        data: [0]
      }
    ]
  });

  const [xAData, setXa] = useState({
    options: {
      chart: {
        id: "basic-bar"
      },
      xaxis: {
        categories: ['n/a'],
        title: {
          text: 'Player'
        }
      },
      yaxis: {
        title: {
          text: 'Expected Assists % Contribution'
        }
      },
    },
    series: [
      {
        name: "xA",
        data: [0]
      }
    ]
  });

  const onYearChanged = (newYear) => {
    // console.log("newYear input", newYear);
    setYear(newYear);
    // console.log("current year state", year);
    api.teams.getTeamProfile(teamId, newYear)
      .then((apiTeamInfo) => {
        // console.log(teamInfo);
        setTeamInfo(apiTeamInfo)
        // console.log(teamInfo);
      });
  }

  useEffect(() => {
    api.teams.getTeamProfile(teamId, year)
      .then((apiTeamInfo) => {
        console.log(apiTeamInfo);
        setTeamInfo(apiTeamInfo);

        if(apiTeamInfo.leaguesList.length > 0){
        setLeg(dict[apiTeamInfo.leaguesList[0].league]);
        }

        const x = apiTeamInfo.mostDominantAgainst;
        if(x.length > 3){
        setDominant({b1: x[0].opponent, b2: x[1].opponent, b3: x[2].opponent, b4: x[3].opponent
        ,w1: x[(x.length) -1].opponent, w2: x[x.length-2].opponent, w3: x[x.length-3].opponent, w4: x[x.length-4].opponent})
        }

        if(apiTeamInfo.recentGames.length > 5){

          var xG = [];
          var xA = [];

            for(var i = 0; i< Math.min(apiTeamInfo.recentGames.length,30); i++){
                xG.push(apiTeamInfo.recentGames[i].team_xG);
                xA.push(apiTeamInfo.recentGames[i].team_xGA);
            }

            setTl({
              options: {
                chart: {
                  id: "basic-bar"
                },
                stroke: {
                  width: 1
                }
              },
              series: [
                {
                  name: "xG",
                  data: xG
                },
                {
                  name: "xGA",
                  data: xA
                }
              ]
            });

        }

        if(apiTeamInfo.mostProgressivePlayer[0]!= null && apiTeamInfo.mostProgressivePlayer.length == 5){

          setBp({
            options: {
              chart: {
                id: "basic-bar"
              },
              xaxis: {
                categories: [apiTeamInfo.mostProgressivePlayer[0].name, apiTeamInfo.mostProgressivePlayer[1].name, apiTeamInfo.mostProgressivePlayer[2].name, apiTeamInfo.mostProgressivePlayer[3].name, apiTeamInfo.mostProgressivePlayer[4].name],
                title: {
                  text: 'Player'
                }
              },
              yaxis: {
                title: {
                  text: 'Ball Progression'
                }
              },
            },
            series: [
              {
                name: "Ball Progression",
                data: [apiTeamInfo.mostProgressivePlayer[0].ranking, apiTeamInfo.mostProgressivePlayer[1].ranking, apiTeamInfo.mostProgressivePlayer[2].ranking, apiTeamInfo.mostProgressivePlayer[3].ranking, apiTeamInfo.mostProgressivePlayer[4].ranking]
              }
            ]
          });

        }

        if (apiTeamInfo.mostXgXaContributor.length >9){

          /**
           * Organizes the data object passed through.
           */
        const names = [apiTeamInfo.mostXgXaContributor[0].name, apiTeamInfo.mostXgXaContributor[1].name, apiTeamInfo.mostXgXaContributor[2].name, apiTeamInfo.mostXgXaContributor[3].name, apiTeamInfo.mostXgXaContributor[4].name
                      , apiTeamInfo.mostXgXaContributor[5].name, apiTeamInfo.mostXgXaContributor[6].name, apiTeamInfo.mostXgXaContributor[7].name, apiTeamInfo.mostXgXaContributor[8].name, apiTeamInfo.mostXgXaContributor[9].name];

        const xgvals = [apiTeamInfo.mostXgXaContributor[0].percentXgContribution, apiTeamInfo.mostXgXaContributor[1].percentXgContribution, apiTeamInfo.mostXgXaContributor[2].percentXgContribution, apiTeamInfo.mostXgXaContributor[3].percentXgContribution, apiTeamInfo.mostXgXaContributor[4].percentXgContribution
                      , apiTeamInfo.mostXgXaContributor[5].percentXgContribution, apiTeamInfo.mostXgXaContributor[6].percentXgContribution, apiTeamInfo.mostXgXaContributor[7].percentXgContribution, apiTeamInfo.mostXgXaContributor[8].percentXgContribution, apiTeamInfo.mostXgXaContributor[9].percentXgContribution];

        const xavals = [apiTeamInfo.mostXgXaContributor[0].percentXaContribution, apiTeamInfo.mostXgXaContributor[1].percentXaContribution, apiTeamInfo.mostXgXaContributor[2].percentXaContribution, apiTeamInfo.mostXgXaContributor[3].percentXaContribution, apiTeamInfo.mostXgXaContributor[4].percentXaContribution
                      , apiTeamInfo.mostXgXaContributor[5].percentXaContribution, apiTeamInfo.mostXgXaContributor[6].percentXaContribution, apiTeamInfo.mostXgXaContributor[7].percentXaContribution, apiTeamInfo.mostXgXaContributor[8].percentXaContribution, apiTeamInfo.mostXgXaContributor[9].percentXaContribution];


        const xgavals = [apiTeamInfo.mostXgXaContributor[0].percentXgXAContribution, apiTeamInfo.mostXgXaContributor[1].percentXgXAContribution, apiTeamInfo.mostXgXaContributor[2].percentXgXAContribution, apiTeamInfo.mostXgXaContributor[3].percentXgXAContribution, apiTeamInfo.mostXgXaContributor[4].percentXgXAContribution
        , apiTeamInfo.mostXgXaContributor[5].percentXgXAContribution, apiTeamInfo.mostXgXaContributor[6].percentXgXAContribution, apiTeamInfo.mostXgXaContributor[7].percentXgXAContribution, apiTeamInfo.mostXgXaContributor[8].percentXgXAContribution, apiTeamInfo.mostXgXaContributor[9].percentXgXAContribution];


          /**
           * Sets the chart data to the data object for the chart visuals
           */
                      setXg({
                        options: {
                          chart: {
                            id: "basic-bar"
                          },
                          xaxis: {
                            categories: names,
                            title: {
                              text: 'Player'
                            }
                          },
                          yaxis: {
                            title: {
                              text: 'Expected Goals % Contribution'
                            }
                          },
                        },
                        chart: {
                          background: '#111'
                        },
                        series: [
                          {
                            name: "xG",
                            data: xgvals}
                        ]
                      });

                      setXa({
                        options: {
                          chart: {
                            id: "basic-bar"
                          },
                          xaxis: {
                            categories: names,
                            title: {
                              text: 'Player'
                            }
                          },
                          yaxis: {
                            title: {
                              text: 'Expected Assists % Contribution'
                            }
                          },
                        },
                        chart: {
                          background: '#111'
                        },
                        series: [
                          {
                            name: "xG",
                            data: xavals}
                        ]
                      });

                      setXga({
                        options: {
                          chart: {
                            id: "basic-bar"
                          },
                          xaxis: {
                            categories: names,
                            title: {
                              text: 'Player'
                            }
                          },
                          yaxis: {
                            title: {
                              text: 'Expected Assists/Goals & Contrib.'
                            }
                          },
                        },
                        chart: {
                          background: '#111'
                        },
                        series: [
                          {
                            name: "xG",
                            data: xgavals}
                        ]
                      });

                    }




      });
  }, [])


  /**
   * HTML section of the file. This will utilize the local data object to display HTML sections specific
   * to the team. Essentially this file dynamically displays the team profile info that we have access
   * to after organization from the function above. 
   */
  return (
    <div className="Dashboard">

      <PageNavbar active="dashboard" />

      <button type="button" class="btn btn-secondary pad" onClick={() => history.goBack() } >Go Back</button>
      <div className={classes.root}>
        <Grid container spacing={4} align="center" justify="center" alignItems="center">
          <Grid item xs={8} >
            <Paper className={classes.paper}><h3><strong>{teamInfo && teamInfo.leaguesList && teamInfo.leaguesList[0] && teamInfo.leaguesList[0].name} Team Profile </strong></h3>
              <p class="font-weight-light">Stats for <select name="selectList" id="selectList" onChange={(e) => { onYearChanged(e.target.value) }}>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2019">2019</option>
                <option value="2018">2018</option>
                <option value="2017">2017</option>
              </select> season</p></Paper>

            <Table striped bordered variant="light">

              <tbody>
                <tr>
                  <td><strong>League:</strong></td>
                  <td>{leg}</td>
                  <td><strong>Home Win %:</strong></td>
                  <td>{(teamInfo && teamInfo.winPcts && teamInfo.winPcts[0] && teamInfo.winPcts[0].home_win_pct) == null ? <p>No data this year</p>: <p>{teamInfo && teamInfo.winPcts && teamInfo.winPcts[0] && teamInfo.winPcts[0].home_win_pct + "%"}</p>}</td>
                </tr>
                <tr>
                  <td><strong>Away Win %:</strong></td>
                  <td>{(teamInfo && teamInfo.winPcts && teamInfo.winPcts[0] && teamInfo.winPcts[0].home_win_pct) == null ? <p>No data this year</p>: <p>{teamInfo && teamInfo.winPcts && teamInfo.winPcts[0] && teamInfo.winPcts[0].away_win_pct + "%"}</p>}</td>
                  <td><strong>Total Win %:</strong></td>
                  <td>{(teamInfo && teamInfo.winPcts && teamInfo.winPcts[0] && teamInfo.winPcts[0].home_win_pct) == null ? <p>No data this year</p>: <p>{teamInfo && teamInfo.winPcts && teamInfo.winPcts[0] && teamInfo.winPcts[0].total_win_pct + "%"}</p>}</td>
                </tr>
                <tr>
                  <td><strong>Total Draw %:</strong></td>
                  <td>{(teamInfo && teamInfo.winPcts && teamInfo.winPcts[0] && teamInfo.winPcts[0].home_win_pct) == null ? <p>No data this year</p>: <p>{teamInfo && teamInfo.winPcts && teamInfo.winPcts[0] && teamInfo.winPcts[0].total_draw_pct + "%"}</p>}</td>
                  <td><strong>Weighted Average Age:</strong></td>
                  <td>{(teamInfo && teamInfo.winPcts && teamInfo.winPcts[0] && teamInfo.winPcts[0].home_win_pct) == null ? <p>No data this year</p>: <p>{teamInfo && teamInfo.avgAge && teamInfo.avgAge.weighted_team_age}</p>}</td>
                </tr>
              </tbody>
            </Table>
          </Grid>
          <Grid item xs={5} className={classes.color} borderRadius={16} borderColor="primary.main">
            <Paper className={classes.paper}> <b>Historical xG% Contribution</b></Paper>

            <Chart
              options={xgData.options}
              series={xgData.series}
              type="bar"
              width="500"
              chart={xgData.chart}

            />

          </Grid>
          <Grid item xs={5} className={classes.color} borderRadius={16} borderColor="primary.main">
            <Paper className={classes.paper}> <b>Historical xA% Contribution</b></Paper>

            <Chart
              options={xAData.options}
              series={xAData.series}
              type="bar"
              width="500"
              class="apexcharts-canvas"
            />


          </Grid>
          <Grid item xs={5} className={classes.color} borderRadius={16} borderColor="primary.main">
            <Paper className={classes.paper}> <b>Historical xG + xA% Contribution</b></Paper>
            <Chart
              options={xAxGData.options}
              series={xAxGData.series}
              type="bar"
              width="500"
            />

          </Grid>
          <Grid item xs={5} className={classes.color} borderRadius={3} borderColor="primary.main">
            <Paper className={classes.paper}> <b>Most Progressive Players</b></Paper>
            <Chart
              options={ballProgressionData.options}
              series={ballProgressionData.series}
              type="bar"
              width="500"
            />
          </Grid>
          <Grid item xs={5} className={classes.color} borderRadius={16} borderColor="primary.main">
            <Paper className={classes.paper}> <b> Most and Least Dominant Against</b></Paper>
            <Table striped bordered variant="light">

              <tbody>
                <tr className="tab">
                  <td><strong>Easiest Opponent:</strong></td>
                  <td>{dominant.b1}</td>
                  <td><strong>Worst Rival:</strong></td>
                  <td>{dominant.w1}</td>
                </tr>
                <tr className="tab">
                  <td><strong>Second Easiest Opponent:</strong></td>
                  <td>{dominant.b2}</td>
                  <td><strong>Second Worst Rival:</strong></td>
                  <td>{dominant.w2}</td>
                </tr>
                <tr className="tab">
                  <td><strong>Third Easiest Opponent:</strong></td>
                  <td>{dominant.b3}</td>
                  <td><strong>Third Worst Rival:</strong></td>
                  <td>{dominant.w3}</td>
                </tr>
                <tr className="tab">
                  <td><strong>Fourth Easiest Opponent:</strong></td>
                  <td>{dominant.b4}</td>
                  <td><strong>Fourth Worst Rival:</strong></td>
                  <td>{dominant.w4}</td>
                </tr>
              </tbody>
            </Table>
          </Grid>
          <Grid item xs={5} className={classes.color} borderRadius={16} borderColor="primary.main">
            <Paper className={classes.paper}> <b>xG and xGA Trendline (Most recent games)</b></Paper>
            <Chart
              options={trendlineData.options}
              series={trendlineData.series}
              type="line"
              width="500"
            />
          </Grid>
        </Grid>
      </div></div>
  );
}
