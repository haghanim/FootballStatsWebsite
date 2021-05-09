import { useParams } from 'react-router';
import React, { Component, useEffect, useState } from 'react';
import api from '../api';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import PageNavbar from './PageNavbar';
import Table from 'react-bootstrap/Table';
import ReactApexChart from "react-apexcharts";

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

const radar = {

    series: [{
        name: 'dsdfsdf 1',
        data: [80, 50, 30, 40, 100, 20],
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
            categories: ['Shooting', 'Passing', 'Scoring', 'Defence', 'Offense', 'Saves']
        }
    },


};

function PlayerProfile() {
    let { playerId } = useParams();
    const classes = useStyles();
    const [PlayerInfo, setPlayerInfo] = useState([]);

    useEffect(() => {
        console.log(playerId);
        api.players.getPlayerProfile(playerId)
            .then((apiPlayerInfo) => {
                setPlayerInfo(apiPlayerInfo)
            });
    }, [])

    return (
        <div className="Dashboard">

            <PageNavbar active="dashboard" />
            <span>  .</span>
            <div className={classes.root}>
                <Grid container spacing={3} align="center" justify="center" alignItems="center">
                    <Grid item xs={7}>
                        <Paper className={classes.paper}><h3><strong>{PlayerInfo.playerInfo.name} Profile</strong></h3></Paper>
                        <Table striped bordered variant="light">

                            <tbody>
                                <tr>
                                    <td><strong>Club:</strong></td>
                                    <td>Mark</td>
                                    <td><strong>Birth Year:</strong></td>
                                    <td>@mdo</td>
                                </tr>
                                <tr>
                                    <td><strong>Nationality:</strong></td>
                                    <td>Jacob</td>
                                    <td><strong>Primary Position:</strong></td>
                                    <td>@fat</td>
                                </tr>
                                <tr>
                                    <td><strong>Nationality:</strong></td>
                                    <td>Larry the Bird</td>
                                    <td><strong>Nationality:</strong></td>
                                    <td>Larry the Bird</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Grid>
                    <Grid item xs={6} className={classes.color}>
                        <div id="chart">
                            <ReactApexChart options={radar.options} series={radar.series} type="radar" height={350} />
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
