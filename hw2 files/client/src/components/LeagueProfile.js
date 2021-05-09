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


const xgData = {
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
		data: [0.3, .3, .4, .45, .46]
	  }
	]
  };

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
      data: [1, 1.5, 1.5, 1.7, 1.3, 2, 1, 1.5, 1.5, 1.7, 1.3, 2,1, 1.5, 1.5, 1.7, 1.3, 2,1, 1.5, 1.5, 1.7, 1.3, 2,1, 1.5, 1.5, 1.7, 1.3, 2]
      },
      {
        name: "xGA",
        data: [0.5, 1.4, 0.9, 0.2, 0.4, 0, 0.5, 0.2, 0.9, 0.2, 0.4, 0, 0.5, 0.2, 0.9, 0.2, 0.4, 0,0.5, 0.2, 0.9, 0.2, 0.4, 0,0.5, 1.4, 0.9, 0.2, 0.4, 0]
      }
    ]
  };




export default function PlayerProfile() {
    let { playerId } = useParams();
    const classes = useStyles();

  return (
    <div className="Dashboard">

    <PageNavbar active="dashboard" />
    <span>  .</span>
  <div className={classes.root}>
    <Grid container spacing={4} align = "center" justify = "center" alignItems = "center">
      <Grid item xs={8} >
      <Paper className={classes.paper}><h3><strong>League Profile: English Premier League </strong></h3>
      </Paper>
      
      <Table striped bordered variant="light">
  
  <tbody>
    <tr>
      <td><strong>Average Age:</strong></td>
      <td>24.9</td>
    </tr>
  </tbody>
</Table>   
      </Grid>
      <Grid item xs={5} className={classes.color} borderRadius={16} borderColor="primary.main">
                  <Paper className={classes.paper}> <b>Team Home/Away Performance</b></Paper>
          
                  <Table striped bordered variant="light">
  
  <tbody>
  <tr className= "tab">
      <td><strong>Best Team:</strong></td>
      <td>Team 1</td>
      <td><strong>Worst Team:</strong></td>
      <td>Team 1</td>
    </tr>
    <tr className= "tab">
      <td><strong>Second Best Team:</strong></td>
      <td>Team 1</td>
      <td><strong>Second Worst Team:</strong></td>
      <td>Team 1</td>
    </tr>
    <tr className= "tab">
      <td><strong>Third Best Team:</strong></td>
      <td>Team 1</td>
      <td><strong>Third Worst Team:</strong></td>
      <td>Team 1</td>
    </tr>
    <tr className= "tab">
      <td><strong>Fourth Best Team:</strong></td>
      <td>Team 1</td>
      <td><strong>Fourth Worst Team:</strong></td>
      <td>Team 1</td>
    </tr>
  </tbody>
</Table> 
            
          </Grid>
      <Grid item xs={5}  className={classes.color} borderRadius={16} borderColor="primary.main">
            <Paper className={classes.paper}> <b>Defensive Statistics</b></Paper>

    </Grid>
      <Grid item xs={5}  className={classes.color} borderRadius={16} borderColor="primary.main">
        <Paper className={classes.paper}> <b>Attacking Statistics</b></Paper>
        
        <Table striped bordered variant="light">
  
  <tbody>
  <tr className= "tab">
      <td><strong>Best Team:</strong></td>
      <td>Team 1</td>
      <td><strong>Worst Team:</strong></td>
      <td>Team 1</td>
    </tr>
    <tr className= "tab">
      <td><strong>Second Best Team:</strong></td>
      <td>Team 1</td>
      <td><strong>Second Worst Team:</strong></td>
      <td>Team 1</td>
    </tr>
    <tr className= "tab">
      <td><strong>Third Best Team:</strong></td>
      <td>Team 1</td>
      <td><strong>Third Worst Team:</strong></td>
      <td>Team 1</td>
    </tr>
    <tr className= "tab">
      <td><strong>Fourth Best Team:</strong></td>
      <td>Team 1</td>
      <td><strong>Fourth Worst Team:</strong></td>
      <td>Team 1</td>
    </tr>
  </tbody>
</Table> 
            
          </Grid>
      <Grid item xs={5}  className={classes.color} borderRadius={3} borderColor="primary.main">
        <Paper className={classes.paper}> <b>Historical League Table</b></Paper>
       
        <Table striped bordered variant="light">
  
  <tbody>
  <tr className= "tab">
      <td><strong>Best Team:</strong></td>
      <td>Team 1</td>
      <td><strong>Worst Team:</strong></td>
      <td>Team 1</td>
    </tr>
    <tr className= "tab">
      <td><strong>Second Best Team:</strong></td>
      <td>Team 1</td>
      <td><strong>Second Worst Team:</strong></td>
      <td>Team 1</td>
    </tr>
    <tr className= "tab">
      <td><strong>Third Best Team:</strong></td>
      <td>Team 1</td>
      <td><strong>Third Worst Team:</strong></td>
      <td>Team 1</td>
    </tr>
    <tr className= "tab">
      <td><strong>Fourth Best Team:</strong></td>
      <td>Team 1</td>
      <td><strong>Fourth Worst Team:</strong></td>
      <td>Team 1</td>
    </tr>
  </tbody>
            </Table>
            
          </Grid>
      
    </Grid>
  </div></div>
);
}
