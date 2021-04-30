// Fix this Path so that it's local to your computer
const config = require('C:/Users/alanf/OneDrive/Desktop/CIS450/Project/550FinalProject/hw2 files/server/db-config.js');
const mysql = require('mysql');

config.connectionLimit = 10;
const connection = mysql.createPool(config);


/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

const getTeamNames = (req, res) => {
    teamName = req.team_name

    console.log(req);

    // teamName = 'Arsenal'

    var query = `
    SELECT name
    FROM team
    WHERE name = '${teamName}';
  `;

    connection.query(query, function (err, rows, fields) {
        if (err) console.log(err);
        else {
            console.log(rows);
            res.json(rows);
        }
    })
};

// query a - Player who contributed highest % of team’s xG, xA, and xG + xA in any given season over last few years (player_name, season, xg, percentage_xg).
// This is for all comps. 

const getMostXGContributer = (req, res) => {
    teamName = req.team_id

    teamName = 'Arsenal'

    var query = `
    WITH teamHomeXgXga AS(
        SELECT season, home AS team, sum(xG_Home) AS team_xg, sum(xG_Away) AS team_xga, COUNT(*) AS match_count
        FROM Fixtures
        WHERE home = ${teamName}
        GROUP BY season, home
    ),
    teamAwayXgXga AS(
        SELECT season, away AS team, sum(xG_Away) AS team_xg, sum(xG_Home) AS team_xga, COUNT(*) AS match_count
        FROM Fixtures
        WHERE away = ${teamName}
        GROUP BY season, away
    ),
    combineHomeAwayXg AS (
        SELECT *
        FROM teamHomeXgXga
        UNION
        SELECT *
        FROM teamAwayXgXga
    ),
    totalXgTeamSeason AS (
        SELECT season, team,
        SUM(team_xg) AS team_xg,
        SUM(team_xga) AS team_xga,
        SUM(match_count) as match_count
        FROM combineHomeAwayXg
        GROUP BY season, team
    ),
    playerSeasonXaTotals AS (
        SELECT player_id, season, team,
        SUM(xA) AS xA
        FROM player_passing_stats
        WHERE team = ${teamName} 
        GROUP BY player_id, season, team 
    ),
    playerSeasonXgTotals AS (
        SELECT player_id, season, team,
        SUM(xG) AS xG
        FROM player_shooting_stats
        WHERE team = ${teamName} 
        GROUP BY player_id, season, team 
    ),
    combineXgXaPlayers AS (
        SELECT t1.player_id, t1.season, t1.team, t1.xG, t2.xA
        FROM playerSeasonXgTotals t1
        JOIN playerSeasonXaTotals t2 ON t1.player_id = t2.player_id AND
        t1.season = t2.season AND t1.team = t2.team
    ),
    combinePlayersAndTeams AS (
        SELECT t1.player_id, t1.team, t1.season,
        t1.xG / t2.team_xg AS percentXgContribution,
        t1.xA / t2.team_xg AS percentXaContribution,
        (t1.xG + t1.xA) / t2.team_xg AS percentXgXAContribution
        FROM combineXgXaPlayers t1 
        JOIN totalXgTeamSeason t2 ON t1.season = t2.season
        ORDER BY percentXgContribution DESC
        LIMIT 10
    )
    
    SELECT *    
    FROM combinePlayersAndTeams
  `;

    connection.query(query, function (err, rows, fields) {
        console.log('helloGetTeamNames')

        if (err) console.log(err);
        else {
            console.log(rows);
            res.json(rows);
        }
    });

};

const getMostProgressivePlayer = (req, res) => {
    var query = `
    WITH team_outfielders AS(
        SELECT ppts.player_id,
            SUM(ppts.90s_played) AS 90s_played,
            SUM(ppas.prog_passes) AS prog_passes,
            SUM(ppas.comp_passes_leading_to_final_third) AS comp_passes_f3,
            SUM(ppos.att_3rd_carries) AS f3_carries,
            SUM(ppos.prog_dist_carried) AS prog_dist_carried
    	  FROM player_playing_time_stats ppts
    	  NATURAL JOIN player_passing_stats ppas
    	  NATURAL JOIN player_possession_stats ppos
    	  JOIN team t ON t.name = ppts.team
    	  WHERE t.team_id = ${input_teamID} AND ppts.season = ${input_year}
    	  GROUP BY ppts.player_id
    ), team_outfielders_per_90 AS(
    	  SELECT player_id, prog_passes/90s_played AS prog_passes_p90, comp_passes_f3/90s_played AS comp_passes_f3_p90, f3_carries/90s_played AS f3_carries_p90, prog_dist_carried/90s_played AS prog_dist_carried_p90
    	  FROM team_outfielders
        WHERE 90s_played > 2
    ), ranked AS(
    	  SELECT player_id,
            ROW_NUMBER() OVER(ORDER BY prog_passes_p90) ROWNUMBER1,
            ROW_NUMBER() OVER(ORDER BY comp_passes_f3_p90) ROWNUMBER2,
            ROW_NUMBER() OVER(ORDER BY f3_carries_p90) ROWNUMBER3,
            ROW_NUMBER() OVER(ORDER BY prog_dist_carried_p90) ROWNUMBER4
    	  FROM team_outfielders_per_90
    ), number_of_players AS(
    	  SELECT COUNT(*) AS total
    	  FROM team_outfielders_per_90
    ), percentiles AS(
    	   SELECT r.player_id,
             r.ROWNUMBER1/n.total AS prog_passes_percentile,
             r.ROWNUMBER2/n.total AS comp_passes_f3_percentile,
             r.ROWNUMBER3/n.total AS f3_carries_percentile,
             r.ROWNUMBER4/n.total AS prog_dist_carried_percentile
    	   FROM ranked r, number_of_players n
    )
    SELECT name, (prog_passes_percentile+comp_passes_f3_percentile+f3_carries_percentile+prog_dist_carried_percentile)/4 AS ranking
    FROM percentiles
    NATURAL JOIN Player_Outfield
    ORDER BY ranking DESC
    LIMIT 5;
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

const getMostDominantAgainst = (req, res) => {
    var query = `
    WITH goals_diff AS(
    		(SELECT t2.team_id AS against_id, (goals_scored_by_home - goals_scored_by_away) AS goals_diff
    		FROM Fixtures
    		JOIN team t1 ON home = t1.name
    		JOIN team t2 ON away = t2.name
    		WHERE t1.team_id = ${input_teamID})
    		UNION ALL
    		(SELECT t1.team_id AS against_id, (goals_scored_by_away - goals_scored_by_home) AS goals_diff
    		FROM Fixtures
    		JOIN team t1 ON home = t1.name
    		JOIN team t2 ON away = t2.name
    		WHERE t2.team_id = ${input_teamID})
    ), temp AS(
    		SELECT goals_diff.against_id, AVG(goals_diff.goals_diff)
    		FROM goals_diff
    		GROUP BY goals_diff.against_id
    		ORDER BY AVG(goals_diff.goals_diff) DESC
    )
    SELECT team.name AS opponent, temp.avg_goal_diff AS avg_goal_advantage
    FROM temp
    JOIN team ON team_id = against_id
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

const getAvgAge = (req, res) => {
    var query = `
    WITH team_outfielders AS(
        SELECT ppts.player_id, ppts.league, ppts.minutes_played
    	  FROM team t
    		JOIN player_playing_time_stats ppts ON t.name = ppts.team
    		WHERE t.team_id = ${input_teamID} AND ppts.season = ${input_year}
    ), team_gks AS(
    	  SELECT pgpts.player_id, pgpts.league, pgpts.minutes_played
    	  FROM team t
    	  JOIN player_gk_playing_time_stats pgpts ON t.name = pgpts.team
      	WHERE t.team_id = ${input_teamID} AND pgpts.season = ${input_year}
    ), team_squad AS(
    	  (SELECT *
    		FROM team_outfielders)
    		UNION ALL
    		(SELECT *
    		FROM team_gks)
    ), total_minutes_played AS(
    	  SELECT SUM(minutes_played) AS tot
    		FROM team_squad
    ), mod_team_squad AS(
    	  SELECT player_id, league, t.minutes_played/tmp.tot AS weight
    		FROM team_squad t, total_minutes_played tmp
    ), with_birthyear AS(
    		(SELECT mts.player_id, mts.league, mts.weight * (2021 - po.year_born) AS weighted_age
    		FROM mod_team_squad mts
    		JOIN Player_Outfield po ON mts.player_id = po.player_id)
            UNION
            (SELECT mts.player_id, mts.league, mts.weight * (2021 - pgk.year_born) AS weighted_age
    		FROM mod_team_squad mts
    		JOIN Player_GK pgk ON mts.player_id = pgk.player_id)
    )
    SELECT SUM(weighted_age) AS weighted_team_age
    FROM with_birthyear;
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

const getWinPcts = (req, res) => {
    var query = `
    WITH goals_diff_table AS(
    	SELECT t1.team_id AS home_id, t2.team_id AS away_id, (goals_scored_by_home - goals_scored_by_away) AS goals_diff
    	FROM Fixtures
    	JOIN team t1 ON home = t1.name
    	JOIN team t2 ON away = t2.name
    	WHERE t1.team_id = ${input_teamID} OR t2.team_id = ${input_teamID}
    ), home_wins AS(
    	SELECT COUNT(*) AS home_wins
    	FROM goals_diff_table
    	WHERE goals_diff > 0 AND home_id = ${input_teamID}
    ), home_games AS(
    	SELECT COUNT(*) AS num_home_games
    	FROM goals_diff_table
    	WHERE home_id = ${input_teamID}
    ), away_wins AS(
    	SELECT COUNT(*) AS away_wins
    	FROM goals_diff_table
        WHERE goals_diff < 0 AND away_id = ${input_teamID}
    ), away_games AS(
    	SELECT COUNT(*) AS num_away_games
    	FROM goals_diff_table
    	WHERE away_id = ${input_teamID}
    ), draws AS(
        SELECT COUNT(*) AS draws
        FROM goals_diff_table
        WHERE goals_diff = 0 AND (home_id = ${input_teamID} OR away_id = ${input_teamID} )
    )
    SELECT home_wins.home_wins / home_games.num_home_games AS home_win_pct,
            away_wins.away_wins / away_games.num_away_games AS away_win_pct,
            (home_wins.home_wins+away_wins.away_wins)/(home_games.num_home_games+away_games.num_away_games) AS total_win_pct,
            (draws)/(home_games.num_home_games+away_games.num_away_games) AS total_draw_pct
    FROM home_wins, home_games, away_wins, away_games, draws;
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


// query g: xG and xG recent trendline and performance of last 10-30 matches. (Definitely) 
const get30RecentGames = (req, res) => {
    teamName = 'Arsenal'

    var query = `
    WITH mostRecent30Games AS(
        SELECT * 
        FROM Fixtures
        WHERE home = 'Arsenal'
        ORDER BY date DESC
        )

    SELECT *
    FROM mostRecent30Games
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




/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */


// /* ---- Q1a (Dashboard) ---- */
// // Equivalent to: function getTop20Keywords(req, res) {}
// const getTop20Keywords = (req, res) => {
//     var query = `
//     WITH temp AS(
//         SELECT kwd_name, COUNT(*) AS count
//         FROM movie_keyword mk
//         GROUP BY kwd_name
//         ORDER BY COUNT(*) DESC
//     )

//     SELECT kwd_name
//     FROM temp t
//     LIMIT 20;
//   `;
//     connection.query(query, function(err, rows, fields) {
//         if (err) console.log(err);
//         else {
//             console.log(rows);
//             res.json(rows);
//         }
//     });
// };


// /* ---- Q1b (Dashboard) ---- */
// const getTopMoviesWithKeyword = (req, res) => {
//     var inputKeyword = req.params.keyword;

//     var query = `
//     SELECT title, rating, num_ratings
//     FROM movie m
//     JOIN movie_keyword mk ON m.movie_id = mk.movie_id
//     WHERE kwd_name = '${inputKeyword}'
//     ORDER BY rating DESC, num_ratings DESC
//     LIMIT 10;
//   `;
//     connection.query(query, function(err, rows, fields) {
//         if (err) console.log(err);
//         else {
//             console.log(rows);
//             res.json(rows);
//         }
//     });
// };


// /* ---- Q2 (Recommendations) ---- */
// const getRecs = (req, res) => {
//     var inputMovie = req.params.movieName;

//     var query = `
//     WITH input_movie AS(
//       SELECT m.movie_id
//       FROM movie m
//       WHERE m.title = '${inputMovie}'
//       ORDER BY m.release_year DESC
//       LIMIT 1
//     ), input_movie_cast AS(
//       SELECT cast_id
//       FROM input_movie im
//       JOIN cast_in c ON im.movie_id = c.movie_id
//     ), temp AS(
//       SELECT c.movie_id, COUNT(*) as count
//       FROM input_movie_cast imc
//       LEFT JOIN cast_in c ON c.cast_id = imc.cast_id
//       GROUP BY c.movie_id
//     )

//     SELECT m.title, t.movie_id, m.rating, m.num_ratings
//     FROM temp t
//     JOIN movie m ON m.movie_id = t.movie_id
//     WHERE m.title <> '${inputMovie}'
//     ORDER BY t.count DESC, m.rating DESC, m.num_ratings DESC
//     LIMIT 10;
//   `;
//     connection.query(query, function(err, rows, fields) {
//         if (err) console.log(err);
//         else {
//             console.log(rows);
//             res.json(rows);
//         }
//     });
// };


// /* ---- Q3a (Best Movies) ---- */
// const getDecades = (req, res) => {
//     const query = `
//     WITH years AS(
//         SELECT DISTINCT m.release_year AS year
//         FROM movie m
//         ORDER BY m.release_year ASC
//     )

//     SELECT DISTINCT TRUNCATE(year, -1) as decade
//     FROM years
//     ORDER BY decade ASC;
//   `;

//     connection.query(query, (err, rows, fields) => {
//         if (err) console.log(err);
//         else {
//             console.log(rows);
//             res.json(rows);
//         }
//     });
// };


// /* ---- (Best Movies) ---- */
// const getGenres = (req, res) => {
//     const query = `
//     SELECT name
//     FROM genre
//     WHERE name <> 'genres'
//     ORDER BY name ASC;
//   `;

//     connection.query(query, (err, rows, fields) => {
//         if (err) console.log(err);
//         else {
//             console.log(rows);
//             res.json(rows);
//         }
//     });
// };


// /* ---- Q3b (Best Movies) ---- */
// const bestMoviesPerDecadeGenre = (req, res) => {
//     var inputGenre = req.params.selectedGenre;
//     var inputDecade = req.params.selectedDecade;

//     var query = `
//     WITH master_table AS(
//         SELECT m.release_year, m.movie_id, m.title, m.rating, mg.genre_name
//         FROM movie m
//         JOIN movie_genre mg ON mg.movie_id = m.movie_id
//         WHERE m.release_year BETWEEN ${inputDecade} AND ${inputDecade}+9
//     ), input_movies_by_decade AS (
//         SELECT DISTINCT mstr.release_year, mstr.movie_id, mstr.title, mstr.rating
//         FROM master_table mstr
//     ), relevant_movies AS(
//         SELECT mstr.release_year, mstr.movie_id, mstr.title, mstr.rating
//         FROM master_table mstr
//         WHERE mstr.genre_name = '${inputGenre}'
//     ), relevant_genres AS(
//         SELECT DISTINCT mg.genre_name
//         FROM relevant_movies rm
//         JOIN movie_genre mg ON rm.movie_id = mg.movie_id
//     ), genre_decade_averages AS(
//         SELECT mg.genre_name, AVG(imbd.rating) AS avg_rating
//         FROM movie_genre mg
//         JOIN input_movies_by_decade imbd ON imbd.movie_id = mg.movie_id
//         WHERE mg.genre_name IN (SELECT * FROM relevant_genres rg)
//         GROUP BY mg.genre_name
//     )
//     SELECT DISTINCT rm.movie_id, rm.title, rm.rating
//     FROM relevant_movies rm
//     JOIN movie_genre mg ON rm.movie_id = mg.movie_id
//     WHERE rm.rating > ALL (SELECT gda.avg_rating
//                           FROM genre_decade_averages gda
//                           JOIN master_table mstr ON mstr.genre_name = gda.genre_name
//                           WHERE rm.movie_id = mstr.movie_id)
//     ORDER BY rm.title ASC
//     LIMIT 100;
//   `;
//     connection.query(query, function(err, rows, fields) {
//         if (err) console.log(err);
//         else {
//             console.log(rows);
//             res.json(rows);
//         }
//     });
// };

module.exports = {
    getTeamNames: getTeamNames,
    getMostXGContributer: getMostXGContributer,
    // getTop20Keywords: getTop20Keywords,
    // getTopMoviesWithKeyword: getTopMoviesWithKeyword,
    // getRecs: getRecs,
    // getDecades: getDecades,
    // getGenres: getGenres,
    // bestMoviesPerDecadeGenre: bestMoviesPerDecadeGenre
};