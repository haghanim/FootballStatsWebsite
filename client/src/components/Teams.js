/**
 * Frontend component that handles the Teams page. This is where all the subcomponents
 * are dealt with. This helps organize the high end HTML organization as well as organize 
 * how the subcomponents are displayed on the page. 
 * 
 * This page is called from ../App.js given a certain URL and it returns an HTML page after 
 * referencing subcomponents. 
 */

import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../style/main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import MaterialTable from "material-table";
import { forwardRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
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
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

/* Specifies the formating style
*/
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


  /**
   * HTML section of the file. This will utilize the local data object to display HTML sections specific
   * to the team. Essentially this file dynamically displays the team profile info that we have access
   * to after organization from the function above. 
   */
function Teams() {
    const [teamsList, setTeamsList] = useState([]);
    const history = useHistory();
    const classes = useStyles();

    useEffect(() => {
        api.teams.getAllTeams()
            .then((apiTeamsList) => {

                setTeamsList(apiTeamsList)
            });
    }, [])
    return (
        <div className="Dashboard">

            <PageNavbar active="dashboard" />



            <br /><div className="container main-container">
            <div className={classes.root}>
            <Grid  spacing={5} align = "center" justify = "center" alignItems = "center">
      <Grid item xs={4}>
                    <Paper className={classes.paper}><h3><strong>Teams Database</strong></h3></Paper>
                    <div style={{ maxWidth: "100%" }}>

                    <MaterialTable
                        actions={[
                            {
                                icon: forwardRef((props, ref) => <Search {...props} ref={ref} />),
                                tooltip: 'Look Up Team',

                                onClick: (event, rowData) => {
                                    history.push(`/teams/profile/` + rowData.team_id);
                                }
                            }
                        ]}
                            icons={tableIcons}
                            style={{ width: 370 }}
                            columns={[
                                { title: "Team Name", field: "name" },
                                { title: "id", field: "team_id", hidden: true },
                            ]}
                            data={teamsList
                            }
                            title=""
                        />
                    </div></Grid></Grid></div>

                <br />

            </div>
        </div>
    )
}

export default Teams;
