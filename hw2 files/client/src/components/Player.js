import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom'
import '../style/Player.css';
import { useHistory } from 'react-router-dom';
import { Route, Link, BrowserRouter, withRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
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
import Grid from '@material-ui/core/Grid';

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
    Actions: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.primary,
      justify: 'center',
      container: true
    },
  }));

function Players() {
    const history = useHistory();
    const [playersList, setPlayersList] = useState([]);
    const classes = useStyles();

    useEffect(() => {
        
        api.players.getAllPlayers()
            .then((apiPlayersList) => {


                apiPlayersList = apiPlayersList.map((item) => {
                    item.nationality = item.nationality.slice(-3);
                    return item;
                }
                );


                setPlayersList(apiPlayersList)
            });
    }, [])
    console.log(playersList);
    return (
        <div className="Dashboard">

            <PageNavbar active="dashboard" />



            <br />
            <div className="container movies-container">
            <div className={classes.root}>
            <Grid  spacing={5} align = "center" justify = "center" alignItems = "center">
      <Grid item xs={8}>
                    <Paper className={classes.paper}><h3><strong>Player Database</strong></h3></Paper>
                    <div style={{ maxWidth: "100%" }}>

                        <MaterialTable

                            actions={[
                                {
                                    icon: forwardRef((props, ref) => <Search {...props} ref={ref} />),
                                    tooltip: 'Look Up User',

                                    onClick: (event, rowData) => {
                                        history.push(`/players/profile/` + rowData.player_id);
                                    }
                                }
                            ]}
                            icons={tableIcons}
                            columns={[
                                { title: "Name", field: "name" },
                                { title: "Club", field: "Club" },
                                { title: "Birth Year", field: "year_born", type: "numeric" },
                                {
                                    title: "Nationality",
                                    field: "nationality",
                                },
                                { title: "Current Position", field: "Position" },
                                { title: "id", field: "player_id", hidden: true }
                            ]}
                            data={playersList
                            }
                            title=""
                        />
                    </div></Grid></Grid></div>

                <br />

            </div>
        </div>
    )
}

export default Players;

