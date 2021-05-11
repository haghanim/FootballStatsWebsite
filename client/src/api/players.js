/**
 * API page that hadles GET requests to the backend. We call these functions from components
 * for player specific requests.
 */

import { fetchWithErrors } from './';

/**
 * Gets all of the players in the database. This functions makes a get request to the backend
 * and returns a json with a list of the players.
 * Return: list of players
 */

export function getAllPlayers() {
    return fetchWithErrors(
        'http://localhost:8081/players/',
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },

        }
    )
        .then((res) => {
            return res;
        })
        .catch((err) => {
            alert(err);
        })
}

/**
 * Gets the profile of a player. The profile consists of basic info, in addition to complex queries
 * providing more detailed info on the player.
 * This functions makes a get call to the backend and returns an object that
 * contains all the info of a player.
 * Return: Object with player info
 */

export function getPlayerProfile(playerId) {
    console.log(playerId);
    return fetchWithErrors(
        `http://localhost:8081/players/profile/${playerId.playerId}`,
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }
    )
        .then((res) => {
            console.log(res);
            return res;
        })
        .catch((err) => {
            alert(err);
        })
}