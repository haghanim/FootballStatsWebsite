// Fix this Path so that it's local to your computer
const config = require('C:/Users/alanf/OneDrive/Desktop/CIS450/Project/550FinalProject/hw2 files/server/db-config.js');
const mysql = require('mysql');

config.connectionLimit = 10;
const connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

const getAllPlayers = (req, res) => {
    console.log('yo');
    var query = `
    WITH get_outfielders_team AS(
        SELECT player_id, MAX(season) AS season, MIN(team) AS team, primary_position AS 'primary_position'
        FROM player_position
        GROUP BY player_id
    ), get_gks_team as (
        SELECT player_id, 'GK' AS 'primary_position', MAX(season) AS season, MIN(team) AS team
        FROM player_gk_basic_stats
        GROUP BY player_id
    ), get_outfielders as (
        SELECT b.name as 'name', b.year_born, b.nationality, a.team as 'Club', a.primary_position as 'Position', a.player_id
        FROM get_outfielders_team a
        JOIN Player_Outfield b on a.player_id = b.player_id
	), get_gks as (
        SELECT b.name as 'name', b.year_born, b.nationality, a.team as 'Club', a.primary_position as 'Position', a.player_id
        FROM get_gks_team a
        JOIN Player_GK b on a.player_id = b.player_id
    )
   (SELECT *
    FROM get_outfielders)
    UNION
   (SELECT *
    FROM get_gks)`;

    connection.query(query, function (err, rows, fields) {
        if (err) {
            // console.log(err);
            res.status(400).json({ 'message': 'generic error message' });
        } else {
            console.log(rows);
            res.status(200).json(rows);
        }
    });
}

const getPlayerName = (req, res) => {
    var query = `
    SELECT name
    FROM player
    LIMIT 20;

  `;
    connection.query(query, function (err, rows, fields) {
        if (err) console.log(err);
        else {
            console.log(rows);
            res.json(rows);
        }
    });
};


const getPercentileForSelectedStatAndYear_Outfield = (req, res) => {
    var query = `
    WITH selected_player_position AS(
	     SELECT pp.primary_position, pp.secondary_position
	     FROM player_position pp
	     WHERE pp.player_id = ${input_player_id} AND pp.season = ${inputYear}
	     LIMIT 1
    ), same_position_players AS(
       SELECT pp.player_id
       FROM player_position pp
       WHERE pp.season = ${inputYear} AND
		       ((pp.primary_position, pp.secondary_position) IN (SELECT * FROM selected_player_position) OR
		        (pp.secondary_position, pp.primary_position) IN (SELECT * FROM selected_player_position))
    ), ranked AS(
	     SELECT player_id, season, team, league, ${inputStat}, ${inputStat}/90s_played, ROW_NUMBER() OVER(ORDER BY ${inputStat}/90s_played) ROWNUMBER
       FROM player_playing_time_stats
       NATURAL JOIN player_shooting_stats
		   NATURAL JOIN player_passing_stats
		   NATURAL JOIN player_possession_stats
		   NATURAL JOIN player_goal_shot_creation_stats
	     NATURAL JOIN player_pass_type_stats
   	 	 NATURAL JOIN player_misc_stats
	   	 NATURAL JOIN player_defensive_actions_stats
	   	 NATURAL JOIN same_position_players
       WHERE 90s_played > 2 AND season = ${inputYear}
    ), number_of_player_stats AS(
	     SELECT COUNT(*) AS total
	     FROM ranked r
    ), selected_players_ranking AS(
	     SELECT ROWNUMBER
	     FROM ranked r
	     WHERE player_id = ${input_player_id} AND season = ${inputYear}
	     ORDER BY ROWNUMBER ASC
	     LIMIT 1
    )
    SELECT spr.ROWNUMBER / nops.total AS ${inputStat}_Percentile
    FROM number_of_player_stats nops, selected_players_ranking spr
    `;
    connection.query(query, function (err, rows, fields) {
        if (err) console.log(err);
        else {
            console.log(rows);
            res.json(rows);
        }
    });
};

const getPercentileForSelectedStatAndYear_GK = (req, res) => {
    var query = `
    WITH ranked AS(
    	SELECT player_id, season, team, league, ${inputStat}, ${inputStat}/90s_played, ROW_NUMBER() OVER(ORDER BY ${inputStat}/90s_played) ROWNUMBER
        FROM player_gk_playing_time_stats
    		NATURAL JOIN player_gk_basic_stats
    		NATURAL JOIN player_gk_advanced_stats
        WHERE 90s_played > 2 AND season = ${inputYear}
    ), number_of_player_stats AS(
    	SELECT COUNT(*) AS total
    	FROM ranked r
    ), selected_players_ranking AS(
    	SELECT ROWNUMBER
    	FROM ranked r
    	WHERE player_id = ${input_player_id} AND season = ${inputYear}
    	ORDER BY ROWNUMBER ASC
    	LIMIT 1
    )
    SELECT 1 - spr.ROWNUMBER / nops.total AS ${inputStat}_Percentile
    FROM number_of_player_stats nops, selected_players_ranking spr
    `;
    connection.query(query, function (err, rows, fields) {
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

/* ---- Q1a (Dashboard) ---- */
// Equivalent to: function getTop20Keywords(req, res) {}
const getTop20Keywords = (req, res) => {
    var query = `
    WITH temp AS(
        SELECT kwd_name, COUNT(*) AS count
        FROM movie_keyword mk
        GROUP BY kwd_name
        ORDER BY COUNT(*) DESC
    )

    SELECT kwd_name
    FROM temp t
    LIMIT 20;
  `;
    connection.query(query, function (err, rows, fields) {
        if (err) console.log(err);
        else {
            console.log(rows);
            res.json(rows);
        }
    });
};


/* ---- Q1b (Dashboard) ---- */
const getTopMoviesWithKeyword = (req, res) => {
    var inputKeyword = req.params.keyword;

    var query = `
    SELECT title, rating, num_ratings
    FROM movie m
    JOIN movie_keyword mk ON m.movie_id = mk.movie_id
    WHERE kwd_name = '${inputKeyword}'
    ORDER BY rating DESC, num_ratings DESC
    LIMIT 10;
  `;
    connection.query(query, function (err, rows, fields) {
        if (err) console.log(err);
        else {
            console.log(rows);
            res.json(rows);
        }
    });
};


/* ---- Q2 (Recommendations) ---- */
const getRecs = (req, res) => {
    var inputMovie = req.params.movieName;

    var query = `
    WITH input_movie AS(
      SELECT m.movie_id
      FROM movie m
      WHERE m.title = '${inputMovie}'
      ORDER BY m.release_year DESC
      LIMIT 1
    ), input_movie_cast AS(
      SELECT cast_id
      FROM input_movie im
      JOIN cast_in c ON im.movie_id = c.movie_id
    ), temp AS(
      SELECT c.movie_id, COUNT(*) as count
      FROM input_movie_cast imc
      LEFT JOIN cast_in c ON c.cast_id = imc.cast_id
      GROUP BY c.movie_id
    )

    SELECT m.title, t.movie_id, m.rating, m.num_ratings
    FROM temp t
    JOIN movie m ON m.movie_id = t.movie_id
    WHERE m.title <> '${inputMovie}'
    ORDER BY t.count DESC, m.rating DESC, m.num_ratings DESC
    LIMIT 10;
  `;
    connection.query(query, function (err, rows, fields) {
        if (err) console.log(err);
        else {
            console.log(rows);
            res.json(rows);
        }
    });
};


/* ---- Q3a (Best Movies) ---- */
const getDecades = (req, res) => {
    const query = `
    WITH years AS(
        SELECT DISTINCT m.release_year AS year
        FROM movie m
        ORDER BY m.release_year ASC
    )

    SELECT DISTINCT TRUNCATE(year, -1) as decade
    FROM years
    ORDER BY decade ASC;
  `;

    connection.query(query, (err, rows, fields) => {
        if (err) console.log(err);
        else {
            console.log(rows);
            res.json(rows);
        }
    });
};


/* ---- (Best Movies) ---- */
const getGenres = (req, res) => {
    const query = `
    SELECT name
    FROM genre
    WHERE name <> 'genres'
    ORDER BY name ASC;
  `;

    connection.query(query, (err, rows, fields) => {
        if (err) console.log(err);
        else {
            console.log(rows);
            res.json(rows);
        }
    });
};


/* ---- Q3b (Best Movies) ---- */
const bestMoviesPerDecadeGenre = (req, res) => {
    var inputGenre = req.params.selectedGenre;
    var inputDecade = req.params.selectedDecade;

    var query = `
    WITH master_table AS(
        SELECT m.release_year, m.movie_id, m.title, m.rating, mg.genre_name
        FROM movie m
        JOIN movie_genre mg ON mg.movie_id = m.movie_id
        WHERE m.release_year BETWEEN ${inputDecade} AND ${inputDecade}+9
    ), input_movies_by_decade AS (
        SELECT DISTINCT mstr.release_year, mstr.movie_id, mstr.title, mstr.rating
        FROM master_table mstr
    ), relevant_movies AS(
        SELECT mstr.release_year, mstr.movie_id, mstr.title, mstr.rating
        FROM master_table mstr
        WHERE mstr.genre_name = '${inputGenre}'
    ), relevant_genres AS(
        SELECT DISTINCT mg.genre_name
        FROM relevant_movies rm
        JOIN movie_genre mg ON rm.movie_id = mg.movie_id
    ), genre_decade_averages AS(
        SELECT mg.genre_name, AVG(imbd.rating) AS avg_rating
        FROM movie_genre mg
        JOIN input_movies_by_decade imbd ON imbd.movie_id = mg.movie_id
        WHERE mg.genre_name IN (SELECT * FROM relevant_genres rg)
        GROUP BY mg.genre_name
    )
    SELECT DISTINCT rm.movie_id, rm.title, rm.rating
    FROM relevant_movies rm
    JOIN movie_genre mg ON rm.movie_id = mg.movie_id
    WHERE rm.rating > ALL (SELECT gda.avg_rating
                          FROM genre_decade_averages gda
                          JOIN master_table mstr ON mstr.genre_name = gda.genre_name
                          WHERE rm.movie_id = mstr.movie_id)
    ORDER BY rm.title ASC
    LIMIT 100;
  `;
    connection.query(query, function (err, rows, fields) {
        if (err) console.log(err);
        else {
            console.log(rows);
            res.json(rows);
        }
    });
};



// Keep this
module.exports = {
    getAllPlayers: getAllPlayers,
    getPlayerName: getPlayerName,
    getTop20Keywords: getTop20Keywords,
    getTopMoviesWithKeyword: getTopMoviesWithKeyword,
    getRecs: getRecs,
    getDecades: getDecades,
    getGenres: getGenres,
    bestMoviesPerDecadeGenre: bestMoviesPerDecadeGenre
};
