// Fix this Path so that it's local to your computer
const LeagueController = require("../controllers/leagueController");
const config = require('../db-config');
const mysql = require('mysql');

config.connectionLimit = 10;
const connection = mysql.createPool(config);

const getAllLeagues = (req, res) => {
    return LeagueController.getAllLeagues()
        .then((leagueList) => {
            res.status(200).json(leagueList);
        })
        .catch((err) => {
            res.status(400).json({ message: err });
        })
}

const getLeagueProfile = (req, res) => {
    leagueName = req.params.leagueName;
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
//
//
//
//
// const getLeagueLogo = (req, res) => {
//     leagueName = req.params.leagueName;
//     return LeagueController.getLeagueLogo(leagueName)
//         .then((leagueLogo) => {
//             res.status(200).json({
//                     leagueLogo
//                 });
//             })
//         .catch((err) => {
//             console.log(err.message);
//             res.status(400).send(err);
//         })
// }


module.exports = {
    getAllLeagues: getAllLeagues,
    getLeagueProfile: getLeagueProfile,
};
