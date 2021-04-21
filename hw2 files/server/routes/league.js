// Fix this Path so that it's local to your computer
const config = require('/Users/markhaghani/Documents/GitHub/550FinalProject/hw2 files/server/db-config.js');
const mysql = require('mysql');

config.connectionLimit = 10;
const connection = mysql.createPool(config);


/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

const getHomeVsAwayGoalDifferential = (req, res) => {
    var query = `
    WITH home_goal_diff AS (
        SELECT home AS team_name, (goals_scored_by_home - goals_scored_by_away) AS goal_diff
        FROM Fixtures
        WHERE league = ${inputLeague}
    ), away_goal_diff AS (
        SELECT away AS team_name, (goals_scored_by_away - goals_scored_by_home) AS goal_diff
        FROM Fixtures
        WHERE league = ${inputLeague}
    ), home_goal_diff_by_team AS (
        SELECT home_goal_diff.team_name, SUM(home_goal_diff.goal_diff) AS goal_diff
        FROM home_goal_diff
        GROUP BY home_goal_diff.team_name
    ), away_goal_diff_by_team AS (
        SELECT away_goal_diff.team_name, SUM(away_goal_diff.goal_diff) AS goal_diff
        FROM away_goal_diff
        GROUP BY away_goal_diff.team_name
    )
    SELECT h.team_name, h.goal_diff AS home_goal_diff, a.goal_diff AS away_goal_diff, h.goal_diff - a.goal_diff AS differential
    FROM home_goal_diff_by_team hß
    JOIN away_goal_diff_by_team a ON h.team_name = a.team_name
    ORDER BY differential DESC;
  `;
    connection.query(query, function(err, rows, fields) {
        console.log('hello')

        if (err) console.log(err);
        else {
            console.log(rows);
            res.json(rows);
        }
    });
};

const getHistoricalLeagueTable = (req, res) => {
    var query = `
    WITH goals_diff_table AS (
        SELECT home, away, (goals_scored_by_home - goals_scored_by_away) AS goals_diff
        FROM Fixtures
        WHERE league = ${inputLeague}
    ), home_wins AS (
        SELECT home AS team_name, 3 AS pts
        FROM goals_diff_table
        WHERE goals_diff > 0
    ), away_wins AS (
        SELECT away AS team_name, 3 AS pts
        FROM goals_diff_table
        WHERE goals_diff < 0
    ), draws AS (
        SELECT home, away, 1 AS pts
        FROM goals_diff_table
        WHERE goals_diff = 0
    ), temp AS(
        (SELECT home_wins.team_name, SUM(home_wins.pts) AS points
        FROM home_wins
        GROUP BY home_wins.team_name)
        union all
        (SELECT away_wins.team_name, SUM(away_wins.pts) AS points
        FROM away_wins
        GROUP BY away_wins.team_name)
        union all
        (SELECT draws.home AS team_name, SUM(draws.pts) AS points
        FROM draws
        GROUP BY draws.home)
        union all
        (SELECT draws.away AS team_name, SUM(draws.pts) AS points
        FROM draws
        GROUP BY draws.away)
        ORDER BY points DESC
    )
    SELECT team_name, SUM(points)
    FROM temp
    GROUP BY team_name;
  `;
    connection.query(query, function(err, rows, fields) {
        console.log('hello')

        if (err) console.log(err);
        else {
            console.log(rows);
            res.json(rows);
        }
    });
};


module.exports = {
    getTeamName: getTeamName,
    getTop20Keywords: getTop20Keywords,
    getTopMoviesWithKeyword: getTopMoviesWithKeyword,
    getRecs: getRecs,
    getDecades: getDecades,
    getGenres: getGenres,
    bestMoviesPerDecadeGenre: bestMoviesPerDecadeGenre
};
