const config = require('../db-config');
const mysql = require('mysql');
config.connectionLimit = 10;
const connection = mysql.createPool(config);
const MongoClient = require('mongodb').MongoClient;

//Mogo query to return a given league's logo
function getLeagueLogo(leagueName) {
    const uri = "mongodb+srv://admin:admin@football-db.vnhhi.mongodb.net/football_db?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    return client.connect().then(() => {
        return new Promise(async (resolve, reject) => {
            const database = client.db("football_db");
            //query returns a cursor, so need to turn that into an array and return the result
            database.collection("league_logos").find({name: leagueName}).toArray(
                function(err, documents) {
                    if(err) {
                        return reject(err);
                    } else {
                        return resolve(documents);
                    }
                }
            );
        })
    });

}

/* SQL query to return, for every team in the selected league and for every season in our db,
   (Goals scored at home - Goals scored against them at home)
   (Goals scored away - Goals scored against them away)
   and the difference in this */
async function getHomeVsAwayGoalDifferential(leagueName) {
    var query = `
    WITH home_goal_diff AS (
        SELECT home AS team_name, (goals_scored_by_home - goals_scored_by_away) AS goal_diff
        FROM Fixtures
        WHERE league = "${leagueName}"
    ), away_goal_diff AS (
        SELECT away AS team_name, (goals_scored_by_away - goals_scored_by_home) AS goal_diff
        FROM Fixtures
        WHERE league = "${leagueName}"
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
    return new Promise((resolve, reject) => {
        connection.query(query, function (err, rows, fields) {
            if (err) {
                reject(new Error(err));
            }
            else {
                resolve(rows);
            }
        });
    })
}

/* SQL query to return the cumulative league table for all teams in a given
   league over all the seasons in our database. Specifically, a win gives 3
   points, a draw gives 1, and a loss is 0 points */
async function getHistoricalLeagueTable(leagueName) {
    var query = `
    WITH goals_diff_table AS (
        SELECT home, away, (goals_scored_by_home - goals_scored_by_away) AS goals_diff
        FROM Fixtures
        WHERE league = "${leagueName}"
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
    ),
    orderedTemp AS (
		SELECT team_name, SUM(points) AS points
        FROM temp
        GROUP BY team_name
        ORDER BY points DESC
    )

    SELECT RANK() OVER(ORDER BY points desc) AS 'rank', team_name, points
    FROM orderedTemp
    `;
    return new Promise((resolve, reject) => {
        connection.query(query, function (err, rows, fields) {
            if (err) {
                reject(new Error(err));
            }
            else {
                resolve(rows);
            }
        });
    })
}

/* SQL query to return that computes team level offensive stats for a few
   selected offensive stats within a given league over all seasons in our DB.
   Specifically, we aggregate the offensive stats at the player level to
   calculate them at the team level(i.e. we find the players on each team
   in every season, find their offensive stat, then sum it all up, but in
   such a way that accounts for their minutes players as a % of minutes played
   of all outfield players). */
async function getTeamOffensiveStats(leagueName) {
    var query = `
    WITH relevant_stats AS(
        SELECT ppts.team, ppts.season, ppts.minutes_played,
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
        WHERE ppts.league = "${leagueName}"
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
    a.xG/(t.tot/10)*90 AS xG_per_Game,
    a.npxG_per_Shot/(t.tot/10)*90 AS npxG_per_Shot_per_Game,
    a.sca/(t.tot/10)*90 AS Shot_Creating_Actions_per_Game,
    a.gca/(t.tot/10)*90 AS Goal_Creating_Actions_per_Game,
    a.key_passes/(t.tot/10)*90 AS Assisted_Shots_per_Game,
    a.comp_passes/(t.tot/10)*90 AS Comp_Passes_into_18yd_Box_per_Game,
    a.comp_crosses/(t.tot/10)*90 AS Comp_Crosses_into_18yd_Box_per_Game,
    a.comp_crosses/a.comp_passes AS Comp_Crosses_as_pct_of_Comp_Passes

    FROM aggregated_by_team a
    NATURAL JOIN norm_total_minutes_played t
    ORDER BY team, season;
    `;
    return new Promise((resolve, reject) => {
        connection.query(query, function (err, rows, fields) {
            if (err) {
                reject(new Error(err));
            }
            else {
                resolve(rows);
            }
        });
    })
}

/* SQL query to return that computes team level defensive stats for a few
   selected defensive stats within a given league over all seasons in our DB.
   Specifically, we aggregate the defensive stats at the player level to
   calculate them at the team level(i.e. we find the players on each team
   in every season, find their defensive stat, then sum it all up, but in
   such a way that accounts for their minutes players as a % of minutes played
   of all outfield players). */
async function getTeamDefensiveStats(leagueName) {
    var query = `
    WITH relevant_stats AS(
        SELECT ppts.team, ppts.season, ppts.minutes_played,
            pdas.tackles_won,
            pdas.tackles_in_att_3rd,
            pdas.pressures_attempted,
            pdas.succ_pressures,
            pdas.pressures_in_att_3rd,
            pdas.players_tackled_plus_interceptions,
            pdas.errors_leading_to_shot_attempts,
            pms.fouls_committed,
            pms.pks_conceded,
            pms.loose_balls_recovered,
            pms.aerials_won

        FROM player_playing_time_stats ppts
        NATURAL JOIN player_defensive_actions_stats pdas
        NATURAL JOIN player_misc_stats pms
        WHERE ppts.league = "${leagueName}"
    ), aggregated_by_team AS(
        SELECT r.team, r.season,
        SUM(tackles_won) AS tackles_won,
        SUM(tackles_in_att_3rd) AS tackles_in_att_3rd,
        SUM(pressures_attempted) AS pressures_attempted,
        SUM(succ_pressures) AS succ_pressures,
        SUM(players_tackled_plus_interceptions) AS players_tackled_plus_interceptions,
        SUM(errors_leading_to_shot_attempts) AS errors_leading_to_shot_attempts,
        SUM(fouls_committed) AS fouls_committed,
        SUM(pks_conceded) AS pks_conceded,
        SUM(loose_balls_recovered) AS loose_balls_recovered,
        SUM(aerials_won) AS aerials_won

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
    ROUND(a.tackles_won/(t.tot/10)*90, 2) AS 'Tackles Won',
    ROUND(a.tackles_in_att_3rd/(t.tot/10)*90, 2) AS 'Att 3rd Tackles',
    ROUND(a.tackles_in_att_3rd/a.tackles_won*100, 2) AS 'Att 3rd Tackles %',
    ROUND(a.succ_pressures/(t.tot/10)*90, 2) AS 'Successful Pressures',
    ROUND(a.players_tackled_plus_interceptions/(t.tot/10)*90, 2) AS 'Tackles + Int',
    ROUND(a.errors_leading_to_shot_attempts/(t.tot/10)*90, 2) AS 'Errors to shots',
    ROUND(a.fouls_committed/(t.tot/10)*90, 2) AS 'Fouls'

    FROM aggregated_by_team a
    NATURAL JOIN norm_total_minutes_played t
    ORDER BY team, season;
    `;
    return new Promise((resolve, reject) => {
        connection.query(query, function (err, rows, fields) {
            if (err) {
                reject(new Error(err));
            }
            else {
                resolve(rows);
            }
        });
    })
}

module.exports = {
    getLeagueLogo,
    getHomeVsAwayGoalDifferential,
    getHistoricalLeagueTable,
    getTeamOffensiveStats,
    getTeamDefensiveStats
};
