import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Chart from "react-apexcharts";
import '../style/Player.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import '../style/Player.css';
import Table from 'react-bootstrap/Table';
import api from '../api';



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

const xAData = {
  options: {
    chart: {
      id: "basic-bar"
    },
    xaxis: {
      categories: ['Aubameyang 2021', 'Lacazette 2020', 'Lacazette 2019', 'Ramsey 2018', 'Aubameyang 2020'],
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
      data: [0.3, .3, .4, .45, .46]
    }
  ]
};

const xAxGData = {
  options: {
    chart: {
      id: "basic-bar"
    },
    xaxis: {
      categories: ['Aubameyang 2021', 'Lacazette 2020', 'Lacazette 2019', 'Ramsey 2018', 'Aubameyang 2020'],
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
      data: [0.3, .35, .4, .49, .55]
    }
  ]
};

const ballProgressionData = {
  options: {
    chart: {
      id: "basic-bar"
    },
    xaxis: {
      categories: ['Aubameyang 2021', 'Lacazette 2020', 'Lacazette 2019', 'Ramsey 2018', 'Aubameyang 2020'],
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
      data: [30, 40, 45, 50, 91]
    }
  ]
};

const trendlineData = {
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
      data: [1, 1.5, 1.5, 1.7, 1.3, 2, 1, 1.5, 1.5, 1.7, 1.3, 2, 1, 1.5, 1.5, 1.7, 1.3, 2, 1, 1.5, 1.5, 1.7, 1.3, 2, 1, 1.5, 1.5, 1.7, 1.3, 2]
    },
    {
      name: "xGA",
      data: [0.5, 1.4, 0.9, 0.2, 0.4, 0, 0.5, 0.2, 0.9, 0.2, 0.4, 0, 0.5, 0.2, 0.9, 0.2, 0.4, 0, 0.5, 0.2, 0.9, 0.2, 0.4, 0, 0.5, 1.4, 0.9, 0.2, 0.4, 0]
    }
  ]
};




export default function TeamProfile() {
  let { teamId } = useParams();
  const classes = useStyles();
  const [dominant, setDominant] = useState({b1: "Not Enough Data", b2: "Not Enough Data", b3: "Not Enough Data", b4: "Not Enough Data"
                                            ,w1: "Not Enough Data", w2: "Not Enough Data", w3: "Not Enough Data", w4: "Not Enough Data"});
  const [teamInfo, setTeamInfo] = useState([]);
  const [year, setYear] = useState("2021");
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

        const x = apiTeamInfo.mostDominantAgainst;
        if(x.length > 3){
        setDominant({b1: x[0].opponent, b2: x[1].opponent, b3: x[2].opponent, b4: x[3].opponent
        ,w1: x[(x.length) -1].opponent, w2: x[x.length-2].opponent, w3: x[x.length-3].opponent, w4: x[x.length-4].opponent})
        }

        
        if (apiTeamInfo.mostXgXaContributor.length >9){

        const names = [apiTeamInfo.mostXgXaContributor[0].name, apiTeamInfo.mostXgXaContributor[1].name, apiTeamInfo.mostXgXaContributor[2].name, apiTeamInfo.mostXgXaContributor[3].name, apiTeamInfo.mostXgXaContributor[4].name
                      , apiTeamInfo.mostXgXaContributor[5].name, apiTeamInfo.mostXgXaContributor[6].name, apiTeamInfo.mostXgXaContributor[7].name, apiTeamInfo.mostXgXaContributor[8].name, apiTeamInfo.mostXgXaContributor[9].name];
        const xgvals = [apiTeamInfo.mostXgXaContributor[0].percentXgContribution, apiTeamInfo.mostXgXaContributor[1].percentXgContribution, apiTeamInfo.mostXgXaContributor[2].percentXgContribution, apiTeamInfo.mostXgXaContributor[3].percentXgContribution, apiTeamInfo.mostXgXaContributor[4].percentXgContribution
                      , apiTeamInfo.mostXgXaContributor[5].percentXgContribution, apiTeamInfo.mostXgXaContributor[6].percentXgContribution, apiTeamInfo.mostXgXaContributor[7].percentXgContribution, apiTeamInfo.mostXgXaContributor[8].percentXgContribution, apiTeamInfo.mostXgXaContributor[9].percentXgContribution];

        const xavals = [apiTeamInfo.mostXgXaContributor[0].percentXaContribution, apiTeamInfo.mostXgXaContributor[1].percentXaContribution, apiTeamInfo.mostXgXaContributor[2].percentXaContribution, apiTeamInfo.mostXgXaContributor[3].percentXaContribution, apiTeamInfo.mostXgXaContributor[4].percentXaContribution
                      , apiTeamInfo.mostXgXaContributor[5].percentXaContribution, apiTeamInfo.mostXgXaContributor[6].percentXaContribution, apiTeamInfo.mostXgXaContributor[7].percentXaContribution, apiTeamInfo.mostXgXaContributor[8].percentXaContribution, apiTeamInfo.mostXgXaContributor[9].percentXaContribution];
                       console.log(xgvals);
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
                    } 

        
      });
  }, [])

  return (
    <div className="Dashboard">

      <PageNavbar active="dashboard" />
      <span>  .</span>
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
                  <td>{teamInfo && teamInfo.leaguesList && teamInfo.leaguesList[0] && teamInfo.leaguesList[0].league}</td>
                  <td><strong>Home Win %:</strong></td>
                  <td>{teamInfo && teamInfo.winPcts && teamInfo.winPcts[0] && teamInfo.winPcts[0].home_win_pct + "%"}</td>
                </tr>
                <tr>
                  <td><strong>Away Win %:</strong></td>
                  <td>{teamInfo && teamInfo.winPcts && teamInfo.winPcts[0] && teamInfo.winPcts[0].away_win_pct + "%"}</td>
                  <td><strong>Total Win %:</strong></td>
                  <td>{teamInfo && teamInfo.winPcts && teamInfo.winPcts[0] && teamInfo.winPcts[0].total_win_pct + "%"}</td>
                </tr>
                <tr>
                  <td><strong>Total Draw %:</strong></td>
                  <td>{teamInfo && teamInfo.winPcts && teamInfo.winPcts[0] && teamInfo.winPcts[0].total_draw_pct + "%"}</td>
                  <td><strong>Weighted Average Age:</strong></td>
                  <td>{teamInfo && teamInfo.avgAge && teamInfo.avgAge.weighted_team_age}</td>
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
            <Paper className={classes.paper}> <b>xG and xA Trendline (30 most recent games)</b></Paper>
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
