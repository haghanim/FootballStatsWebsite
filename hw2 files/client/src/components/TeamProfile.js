import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import Chart from "react-apexcharts";

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

import DropdownButton from 'react-bootstrap/DropdownButton'

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


/*
* Data that we pass into our charts. 
*/ 

const xgData = {
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

function Teams() {
    const [teamsList, setTeamsList] = useState([]);

  
    useEffect(() => {
        api.teams.getAllTeams()
            .then((apiTeamsList) => {
                setTeamsList(apiTeamsList)
            });
    }, [])
    return (
        <div className="Dashboard">

            <PageNavbar active="dashboard" />



            <br />
            <div className="container movies-container">
                <div className="jumbotron">
                    <div className="h3 text-center mb-5">Team Profile</div>
                    <div style={{ maxWidth: "100%" }}>
                    </div>

                </div>

                <br />

            </div>
        </div>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.Primary,
      justify: 'center',
      container: true
    },
  }));

export default function PlayerProfile() {
    let { playerId } = useParams();
    const classes = useStyles();

  return (
    <div className="Dashboard">

    <PageNavbar active="dashboard" />
    <span>  .</span>
  <div className={classes.root}>
    <Grid container spacing={3} align = "center" justify = "center" alignItems = "center">
      <Grid item xs={7}>
        <Paper className={classes.paper}><h3><strong>Team Profile: -Name- </strong></h3>
            <div> League:</div>
            <div> Home Win %:</div>
            <div> Away Win %:</div>
            <div> Total Win %:</div>
            <div> Total Draw %:</div>
            
            {/* dropdown to choose season */}
                          <div> Average Age in *
                <select name="selectList" id="selectList">
                  <option value="option 1">2020</option>
                  <option value="option 2">2021</option>
                </select>              * Season: 26</div>
                          
        </Paper>
      </Grid>
      <Grid item xs={6}>
                  <Paper className={classes.paper}> <b>Historical xG% Contribution</b></Paper>
            
                  <Chart
              options={xgData.options}
              series={xgData.series}
              type="bar"
              width="500"
            />
            
          </Grid>
      <Grid item xs={6}>
            <Paper className={classes.paper}> <b>Historical xA% Contribution</b></Paper>
            
            <Chart
              options={xAData.options}
              series={xAData.series}
              type="bar"
              width="500"
            />
            

    </Grid>
    <Grid item xs={6}>
        <Paper className={classes.paper}> <b>Historical xG + xA% Contribution</b></Paper>
        <Chart
              options={xAxGData.options}
              series={xAxGData.series}
              type="bar"
              width="500"
            />
            
          </Grid>
    <Grid item xs={6}>
        <Paper className={classes.paper}> <b>Ball Progression</b></Paper>
        <Chart
              options={ballProgressionData.options}
              series={ballProgressionData.series}
              type="bar"
              width="500"
            />
          </Grid>
    <Grid item xs={6}>
        <Paper className={classes.paper}> <b> Best and Worst Opponents</b></Paper>
                  </Grid>
    <Grid item xs={6}>
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
