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
		categories: ['Aubameyang 2021', 'Lacazette 2020', 'Lacazette 2019', 'Ramsey 2018', 'Aubameyang 2020']
	  }
	},
  chart: {
    background: '#111'
},
	series: [
	  {
		name: "xG",
		data: [30, 40, 45, 50, 91]
	  }
	]
  };

  const xAData = {
    options: {
      chart: {
      id: "basic-bar"
      },
      xaxis: {
      categories: ['Aubameyang 2021', 'Lacazette 2020', 'Lacazette 2019', 'Ramsey 2018', 'Aubameyang 2020']
      }
    },
    series: [
      {
      name: "xA",
      data: [30, 40, 45, 50, 91]
      }
    ]
  };
    
  const xAxGData = {
    options: {
      chart: {
      id: "basic-bar"
      },
      xaxis: {
      categories: ['Aubameyang 2021', 'Lacazette 2020', 'Lacazette 2019', 'Ramsey 2018', 'Aubameyang 2020']
      }
    },
    series: [
      {
      name: "xG + xA",
      data: [30, 40, 45, 50, 91]
      }
    ]
    };

    const ballProgressionData = {
      options: {
        chart: {
        id: "basic-bar"
        },
        xaxis: {
        categories: ['Aubameyang 2021', 'Lacazette 2020', 'Lacazette 2019', 'Ramsey 2018', 'Aubameyang 2020']
        }
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
      },
      xaxis: {
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
      <Paper className={classes.paper}><h3><strong>Chelsea Team Profile </strong></h3>
      <p class="font-weight-light">Stats for <select name="selectList" id="selectList">
                  <option value="option 1">2021</option>
                  <option value="option 2">2020</option>
                <option value="option 2">2019</option>
                <option value="option 2">2018</option>
                <option value="option 2">2017</option>
                </select> season</p></Paper>
      
      <Table striped bordered variant="light">
  
  <tbody>
    <tr>
      <td><strong>League:</strong></td>
      <td>Premier League</td>
      <td><strong>Home Win %:</strong></td>
      <td>77%</td>
    </tr>
    <tr>
      <td><strong>Away Win %:</strong></td>
      <td>44%</td>
      <td><strong>Total Win %:</strong></td>
      <td>59%</td>
    </tr>
    <tr>
      <td><strong>Total Draw %:</strong></td>
      <td>22%</td>
      <td><strong>Average Age:</strong></td>
      <td>29</td>
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
              chart = {xgData.chart}
              
            />
            
          </Grid>
      <Grid item xs={5}  className={classes.color} borderRadius={16} borderColor="primary.main">
            <Paper className={classes.paper}> <b>Historical xA% Contribution</b></Paper>
            
            <Chart
              options={xAData.options}
              series={xAData.series}
              type="bar"
              width="500"
              class = "apexcharts-canvas"
            />
            

    </Grid>
      <Grid item xs={5}  className={classes.color} borderRadius={16} borderColor="primary.main">
        <Paper className={classes.paper}> <b>Historical xG + xA% Contribution</b></Paper>
        <Chart
              options={xAxGData.options}
              series={xAxGData.series}
              type="bar"
              width="500"
            />
            
          </Grid>
      <Grid item xs={5}  className={classes.color} borderRadius={3} borderColor="primary.main">
        <Paper className={classes.paper}> <b>Most Progressive Players</b></Paper>
        <Chart
              options={ballProgressionData.options}
              series={ballProgressionData.series}
              type="bar"
              width="500"
            />
          </Grid>
      <Grid item xs={5}  className={classes.color} borderRadius={16} borderColor="primary.main">
        <Paper className={classes.paper}> <b> Most and Least Dominant Against</b></Paper>
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
