// Fix this Path so that it's local to your computer
const LeagueController = require("../controllers/leagueController");
const config = require('../db-config');
const mysql = require('mysql');

config.connectionLimit = 10;
const connection = mysql.createPool(config);

// route handler that runs queries once a given team is selected
const getLeagueProfile = (req, res) => {
    leagueName = req.params.leagueName;

    //sequentially run all these queries then return all of their results
    return LeagueController.getHomeVsAwayGoalDifferential(leagueName)
        .then((homeVsAwayGoalDifferential) => {
            return LeagueController.getHistoricalLeagueTable(leagueName)
                .then((historicalLeagueTable) => {
                    return LeagueController.getTeamOffensiveStats(leagueName)
                        .then((teamOffensiveStats) => {
                            return LeagueController.getTeamDefensiveStats(leagueName)
                                .then((teamDefensiveStats) => {
                                    return LeagueController.getLeagueLogo(leagueName)
                                        .then((leagueLogo) => {

                                            // finally, return results from the queries run above
                                            res.status(200).json({
                                                homeVsAwayGoalDifferential, historicalLeagueTable, teamOffensiveStats,
                                                teamDefensiveStats, leagueLogo
                                            });
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
    getLeagueProfile: getLeagueProfile,
};
