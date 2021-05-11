/**
 * API page that hadles GET requests to the backend. We call these functions from components
 * for league specific requests.
 */

import { fetchWithErrors } from './';

/**
 * Gets all of the leagues in the database. This functions makes a get call to the backend
 * and returns a json with a list of the leagues.
 * Return: list of leagues
 */

export function getAllLeagues() {
    return fetchWithErrors(
        'http://localhost:8081/leagues/',
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
 * Gets the profile of a league. The profile consists of basic info, in addition to complex queries
 * providing more detailed info on the league.
 * This functions makes a get call to the backend and returns an object that
 * contains all the info of a league.
 * Return: Object with league info
 */

export function getLeagueProfile(leagueName) {
    return fetchWithErrors(
        `http://localhost:8081/leagues/profile/${leagueName}`,
        {
            method: "GET",
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