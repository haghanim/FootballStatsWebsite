// Fix this Path so that it's local to your computer
const config = require('/Users/nikolasmihailidis/Desktop/550_Project/550FinalProject/hw2 files/server/db-config.js');
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
        WHERE league = ${input_league}
    ), away_goal_diff AS (
        SELECT away AS team_name, (goals_scored_by_away - goals_scored_by_home) AS goal_diff
        FROM Fixtures
        WHERE league = ${input_league}
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
    FROM home_goal_diff_by_team h
    JOIN away_goal_diff_by_team a ON h.team_name = a.team_name
    ORDER BY differential DESC;
  `;
    connection.query(query, function (err, rows, fields) {
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
        WHERE league = ${input_league}
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
    connection.query(query, function (err, rows, fields) {
        console.log('hello')

        if (err) console.log(err);
        else {
            console.log(rows);
            res.json(rows);
        }
    });
};

const getTeamOffensiveStats = (req, res) => {
    var query = `
    WITH relevant_stats AS(
        SELECT ppts.player_id, ppts.team, ppts.season, ppts.minutes_played,
            pss.xG,
            pss.npxG_per_Shot AS npxG_per_Shot,
            pgsct.shot_creating_actions AS sca,
            pgsct.goal_creating_actions AS gca,
            pps.assisted_shots AS key_passes,
            pps.comp_passes_into_18_yd_box AS comp_passes,
            pps.comp_crosses_into_18_yd_box AS comp_crosses

        FROM player_playing_time_stats ppts
        NATURAL JOIN player_goal_shot_creation_stats pgsct
        NATURAL JOIN player_shooting_stats pss
        NATURAL JOIN player_passing_stats pps
        WHERE ppts.league = ${input_league}
    ), aggregated_by_team AS(
        SELECT r.team, r.season,
        SUM(xG) AS xG,
        SUM(npxG_per_Shot) AS npxG_per_Shot,
        SUM(sca) AS sca,
        SUM(gca) AS gca,
        SUM(key_passes) AS key_passes,
        SUM(comp_passes) AS comp_passes,
        SUM(comp_crosses) AS comp_crosses

        FROM relevant_stats r
        GROUP BY r.team, r.season
        ORDER BY r.team, r.season
    ), total_minutes_played AS(
        SELECT team, season, SUM(minutes_played) AS tot
        FROM relevant_stats
        GROUP BY team, season
        ORDER BY team, season
    ), mins_weighting AS(
    	SELECT team, season, MAX(minutes_played_percent) as weight
        FROM player_playing_time_stats
        GROUP BY team, season
    ), norm_total_minutes_played AS(
        SELECT t.team, t.season, t.tot/(w.weight/100) AS tot
        FROM total_minutes_played t
        NATURAL JOIN mins_weighting w
        GROUP BY t.team, t.season
        ORDER BY t.team, t.season
    )
    	SELECT a.team, a.season,
        a.xG/(t.tot/10)*90,
        a.npxG_per_Shot/(t.tot/10)*90,
        a.sca/(t.tot/10)*90,
        a.gca/(t.tot/10)*90,
        a.key_passes/(t.tot/10)*90,
        a.comp_passes/(t.tot/10)*90,
        a.comp_crosses/a.comp_passes

        FROM aggregated_by_team a
        NATURAL JOIN norm_total_minutes_played t
        ORDER BY team, season
  `;
    connection.query(query, function (err, rows, fields) {
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
