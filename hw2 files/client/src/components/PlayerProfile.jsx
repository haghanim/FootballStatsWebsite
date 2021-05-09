import { useParams } from 'react-router';
import React, { Component, useEffect, useState } from 'react';
import api from '../api';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import PageNavbar from './PageNavbar';
import Table from 'react-bootstrap/Table';
import ReactApexChart from "react-apexcharts";

const dict = {
    'tackles': 'Tackles', 
    'succ_pressures' : 'Pressures',
    'interceptions' : 'Interceptions',
    'aerials_won' : 'Aerials',
    'prog_passes' : 'Progressive Passes',
    'long_passes_comp' : 'Long Passes',
    'succ_dribbles' : 'Dribbling', 
    'xA' : 'Expected Assists',
    'prog_receptions' : 'Progressive Receptions', 
    'npxG' : 'Non Penalty xG',
    'npxG_per_Shot' : 'Non Penalty Expected Goals / Shot', 
    'Shots' : 'Shots',
    'penalty_save_percentage' : '% of Penalties Saved', 
    'PSxG_difference' : 'Post Shot Expected Goals - Actual Goals',
    'AvgDist' : 'Average Defensive Action Distance', 
    'stop_percentage' : 'Stoppage Rate', 
    'long_pass_completion_pct' : 'Long Pass Completion Rate',
    'defensive_actions' : 'Defensive Actions',
    'players_tackled_plus_interceptions' : 'Tackles + Interceptions', 
    'comp_passes_leading_to_final_third' : 'Completed Passes into Final 3rd', 
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
    const classes = useStyles();
    const [PlayerInfo, setPlayerInfo] = useState([]);
    const [radar, setRadar] = useState({

        series: [{
            name: '',
            data: [0, 0, 0, 0, 0, 0,]
        }],
        options: {
            chart: {
                height: 350,
                type: 'radar',
            },
            title: {
                text: 'Player Stats'
            },
            xaxis: {
                categories: ['', '', '', '', '', '']
            }
        },
    
    
    })

    useEffect( () => {
         api.players.getPlayerProfile({ playerId })
            .then((apiPlayerInfo) => {
                apiPlayerInfo.playerInfo.nationality = apiPlayerInfo.playerInfo.nationality.slice(-3);
                setPlayerInfo(apiPlayerInfo);
                setRadar({

                    series: [{
                        name: '',
                        data: [Object.values(apiPlayerInfo.radarStats[0])[0], Object.values(apiPlayerInfo.radarStats[1])[0], Object.values(apiPlayerInfo.radarStats[2])[0],
                        Object.values(apiPlayerInfo.radarStats[3])[0], Object.values(apiPlayerInfo.radarStats[4])[0], Object.values(apiPlayerInfo.radarStats[5])[0]]
                    }],
                    options: {
                        chart: {
                            height: 500,
                            type: 'radar',
                        },
                        title: {
                            text: 'Player Stats'
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
                
                
                });
            })
    }, []);

    

    

    return (
        <div className="Dashboard">

            <PageNavbar active="dashboard" />
            <span>  .</span>
            <div className={classes.root}>
                <Grid container spacing={3} align="center" justify="center" alignItems="center">
                    <Grid item xs={7}>
                        <Paper className={classes.paper}><h3><strong>{PlayerInfo && PlayerInfo.playerInfo && PlayerInfo.playerInfo.name} Profile</strong></h3></Paper>
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
                    <Grid item xs={6} className={classes.color}>
                        <div id="chart">
                            <ReactApexChart options={radar.options} series={radar.series} type="radar" height={460} />
                        </div>
                    </Grid>
                    <Grid item xs={5}>
                        <Paper className={classes.paper}><h5><strong>Player Stats</strong></h5></Paper>
                        <Table striped bordered variant="light">

                            <tbody>
                                <tr>
                                    <td><strong>Shooting:</strong></td>
                                    <td>99</td>
                                </tr>
                                <tr>
                                    <td><strong>Passing:</strong></td>
                                    <td>49</td>
                                </tr>
                                <tr>
                                    <td><strong>Field goal:</strong></td>
                                    <td>78</td>
                                </tr>
                                <tr>
                                    <td><strong>Saves:</strong></td>
                                    <td>84</td>
                                </tr>
                                <tr>
                                    <td><strong>Fouls:</strong></td>
                                    <td>23</td>
                                </tr>
                                <tr>
                                    <td><strong></strong></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </Table>
                    </Grid>
                </Grid>
            </div></div>
    );
}

export default PlayerProfile;
