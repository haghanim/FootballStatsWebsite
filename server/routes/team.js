// Fix this Path so that it's local to your computer
const TeamController = require("../controllers/teamController");
const config = require('../db-config');
const mysql = require('mysql');

config.connectionLimit = 10;
const connection = mysql.createPool(config);


/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

// route handler that runs query to get all teams, where user can select a given team
const getAllTeams = (req, res) => {
    return TeamController.getAllTeams()
        .then((teamList) => {
            res.status(200).json(teamList);
        })
        .catch((err) => {
            res.status(400).json({ message: err });
        })
};

// route handler that runs queries once a given team is selected
const getTeamProfile = (req, res) => {
    teamId = req.body.teamId;
    season = req.body.season;

    //sequentially run all these queries then return all of their results
    return TeamController.getTeamLeagues(teamId)
        .then((leaguesList) => {
            return TeamController.getMostXgXaContributor(teamId)
                .then((mostXgXaContributor) => {
                    return TeamController.getMostProgressivePlayer(teamId, season)
                        .then((mostProgressivePlayer) => {
                            return TeamController.getMostDominantAgainst(teamId)
                                .then((mostDominantAgainst) => {
                                    return TeamController.getAvgAge(teamId, season)
                                        .then((avgAge) => {
                                            return TeamController.get30RecentGames(teamId)
                                                .then((recentGames) => {
                                                    return TeamController.getWinPcts(teamId, season)
                                                        .then((winPcts) => {

                                                            // finally, return results from the queries run above
                                                            res.status(200).json({ leaguesList, mostXgXaContributor, mostProgressivePlayer, mostDominantAgainst, avgAge, recentGames, winPcts });
                                                        })
                                                })
                                        })
                                })
                        })
                })
        })
        .catch((err) => {
            console.log(err.message);
            res.status(400).send(err);
        })
}

module.exports = {
    getAllTeams: getAllTeams,
    getTeamProfile: getTeamProfile,
};
