import { useParams } from 'react-router';
import React, { Component, useEffect, useState } from 'react';
import api from '../api';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import PageNavbar from './PageNavbar';
import Table from 'react-bootstrap/Table';
import ReactApexChart from "react-apexcharts";
import { useHistory } from "react-router-dom";
import '../style/Player.css';

const JsonTable = require('ts-react-json-table');   
const dict = {
    'tackles': 'Tackles', 
    'succ_pressures' : 'Successful Pressures',
    'interceptions' : 'Interceptions',
    'aerials_won' : 'Aerials',
    'prog_passes' : 'Progressive Passes',
    'long_passes_comp': 'Long Passes Completed',
    'succ_dribbles' : 'Successful Dribbles', 
    'xA': 'Expected Assists',
    'prog_receptions' : 'Progressive Receptions', 
    'npxG' : 'Non Penalty Expected Goals',
    'Shots': 'Shots',
    'long_passes_completed': 'Long Passes Comp. GK',
    'penalties_allowed': 'Penalties Allowed',
    'PSxG_difference': 'Post Shot xG - Actual',
    'SoTA' : 'Shots on Target Against',
    'crosses_stopped' : 'Crosses Stopped', 
    'defensive_actions' : 'Defensive Actions',
    'players_tackled_plus_interceptions' : 'Tackles + Interceptions', 
    'comp_passes_leading_to_final_third' : 'Comp. Passes into Final 3rd', 
    'tot_dist_traveled_by_comp_passes' : 'Dist. Traveled by Comp. Passes', 
    'aerials_won' : 'Aerials Won', 
    'loose_balls_recovered' : 'Loose Balls Recovered', 
    'fouls_drawn' : 'Fouls Drawn', 
    'comp_passes_into_18_yd_box' : 'Passes into Box', 
};


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
    color: {
        backgroundColor: '#FFFFFF'
    }
}));

const Player = "Joe Soccer";



function PlayerProfile() {
    let { playerId } = useParams();
    let history = useHistory();
    const classes = useStyles();
    const [PlayerInfo, setPlayerInfo] = useState([]);
    const [items, setItems] = useState([{"Season": "n/a", "Team":  "n/a","League":  "n/a"}]);
    const [radar, setRadar] = useState({

        series: [{
            name: '',
            data: [0, 0 ,0]
        }],
        options: {
            chart: {
                height: 350,
                type: 'radar',
            },
            title: {
                text: 'Not Enough Games Played'
            },
            xaxis: {
                categories: ['n/a', 'n/a', 'n/a']
            }
        },
    
    
    })

    useEffect( () => {
         api.players.getPlayerProfile({ playerId })
            .then((apiPlayerInfo) => {
                apiPlayerInfo.playerInfo.nationality = apiPlayerInfo.playerInfo.nationality.slice(-3);
                setPlayerInfo(apiPlayerInfo);

                if(apiPlayerInfo.playerStats.length > 0){


                    var js = JSON.stringify(apiPlayerInfo.playerStats);
                    var jsf = JSON.parse(js.replaceAll("/90s_played", "").replaceAll("succ_dribbles", "Successful Dribbles").replaceAll("prog_receptions", "Progressive Receptions  ").replaceAll("npxG_per_Shot", "npxG Per Shot").replaceAll("season", "Season").replaceAll("team", "Team").replaceAll("league", "League").replaceAll("comp_passes_into_18_yd_box", "Passes Into 18yd Box").replaceAll("fouls_drawn", "Fouls Drawn").replaceAll("eng", "").replaceAll("pct_of_dribblers_tackled", "Dribblers Tackled %").replaceAll("succ_pressure_pct", "Successful Pressure %").replaceAll("prog_passes", "Progressive Passes").replaceAll("aerials_won_pct", "Aerials Won %").replaceAll("penalty_save_percentage", "Penalty Save %").replaceAll("stop_percentage", "Stop %").replaceAll("long_pass_completion_pct", "Long Pass Comp %").replaceAll("PSxG_difference", "PS xG Diff").replaceAll("defensive_actions", "Defensive Actions"));

                    setItems(jsf);

                }

                if(apiPlayerInfo.radarStats[0] != null){
                setRadar({

                    series: [{
                        name: '',
                        data: [Object.values(apiPlayerInfo.radarStats[0])[0], Object.values(apiPlayerInfo.radarStats[1])[0], Object.values(apiPlayerInfo.radarStats[2])[0],
                        Object.values(apiPlayerInfo.radarStats[3])[0], Object.values(apiPlayerInfo.radarStats[4])[0], Object.values(apiPlayerInfo.radarStats[5])[0]]
                    }],
                    options: {
                        chart: {
                            height: 430,
                            type: 'radar',
                        },
                        title: {
                            text: 'Player Stat Percentiles'
                        },
                        xaxis: {
                            categories: [dict[Object.keys(apiPlayerInfo.radarStats[0])[0]], dict[Object.keys(apiPlayerInfo.radarStats[1])[0]], dict[Object.keys(apiPlayerInfo.radarStats[2])[0]], 
                            dict[Object.keys(apiPlayerInfo.radarStats[3])[0]], dict[Object.keys(apiPlayerInfo.radarStats[4])[0]], dict[Object.keys(apiPlayerInfo.radarStats[5])[0]]]
                        },
                        yaxis: {show: false, min: 0, max: 100,}, 
                        dataLabels: {
                            enabled: false,
                            background: {
                              enabled: true,
                              borderRadius:2,
                            }
                          }
                    },
                
                
                });}
            })
    }, []);

    return (
        <div className="Dashboard">

            <PageNavbar active="dashboard" />
            <div className={classes.root}>
            <button type="button" class="btn btn-secondary pad" onClick={() => history.goBack() } >Go Back</button>
                <Grid container spacing={3} align="center" justify="center" alignItems="center">
                    <Grid item xs={7}>
                        <Paper className={classes.paper}><h3><strong>{PlayerInfo && PlayerInfo.playerInfo && PlayerInfo.playerInfo.name}</strong></h3></Paper>
                        <Table striped bordered variant="light">

                            <tbody>
                                <tr>
                                    <td><strong>Club:</strong></td>
                                    <td>{PlayerInfo && PlayerInfo.playerInfo && PlayerInfo.playerInfo.Club}</td>
                                    <td><strong>Birth Year:</strong></td>
                                    <td>{PlayerInfo && PlayerInfo.playerInfo && PlayerInfo.playerInfo.year_born}</td>
                                </tr>
                                <tr>
                                    <td><strong>Nationality:</strong></td>
                                    <td>{PlayerInfo && PlayerInfo.playerInfo && PlayerInfo.playerInfo.nationality}</td>
                                    <td><strong>Primary Position:</strong></td>
                                    <td>{PlayerInfo && PlayerInfo.playerInfo && PlayerInfo.playerInfo.Position}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Grid>
                    
                    <Grid item xs={7}>
                        <Paper className={classes.paper}><h5><strong>Player Stats, per 90s played</strong></h5></Paper>
                        <JsonTable rows = {items} className = "jsonOdd" header = {false} />
                        
                    </Grid>
                    <Grid item xs={4} className={classes.color}>
                        <div id="chart">
                            <ReactApexChart options={radar.options} series={radar.series} type="radar" height={radar.options.chart.height} />
                        </div>
                    </Grid>
                </Grid>
            </div></div>
    );
}

export default PlayerProfile;
