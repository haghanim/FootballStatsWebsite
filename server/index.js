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

/* ---- (Player Page) ---- */
app.get('/players', playerRoutes.getAllPlayers);

app.get('/players/profile/:playerId', playerRoutes.getPlayerProfile);

/* ---- (Team Page) ---- */
app.get('/teams', teamRoutes.getAllTeams);

app.post('/teams/profile/', teamRoutes.getTeamProfile);

/* ---- (League Page) ---- */
app.get('/leagues/profile/:leagueName', leagueRoutes.getLeagueProfile);

app.listen(8081, () => {
    console.log(`Server listening on PORT 8081`);
});
