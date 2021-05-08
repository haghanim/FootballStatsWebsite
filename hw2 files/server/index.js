const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');

// delete later

// Divide routes
var playerRoutes = require("./routes/player.js");
var teamRoutes = require("./routes/team.js");
var leagueRoutes = require("./routes/league");

const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */

/* ---- (Dashboard) ---- */
// The route localhost:8081/keywords is registered to the function
// routes.getTop20Keywords, specified in routes.js.
// app.get('/keywords', routes.getTop20Keywords);


// /* ---- Q1b (Dashboard) ---- */
// app.get('/keywords/:keyword', routes.getTopMoviesWithKeyword);


// /* ---- Q2 (Recommendations) ---- */
// app.get('/recs/:movieName', routes.getRecs);

// /* ---- (Best Movies) ---- */
// app.get('/decades', routes.getDecades);
// app.get('/genres', routes.getGenres);


// /* ---- Q3b (Best Movies) ---- */
// app.get('/best-movies/:selectedDecade/:selectedGenre', routes.bestMoviesPerDecadeGenre);

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */

/* ---- (Player Page) ---- */
app.get('/players', playerRoutes.getAllPlayers);

app.get('/players/:player_id', playerRoutes.getPlayerProfile);

/* ---- (Team Page) ---- */
// app.get('/teams/:team_name', teamRoutes.getTeamLeague);

app.get('/teams', teamRoutes.getAllTeams);

app.get('/leagues', leagueRoutes.getAllLeagues)


app.listen(8081, () => {
    console.log(`Server listening on PORT 8081`);
});
