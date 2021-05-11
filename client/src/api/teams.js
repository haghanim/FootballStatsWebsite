/**
 * API page that hadles GET requests to the backend. We call these functions from components
 * for team specific requests.
 */

import { fetchWithErrors } from './';


/**
 * Gets all of the teams in the database. This functions makes a get request to the backend
 * and returns a json with a list of the teams.
 * Return: list of teams
 */
export function getAllTeams() {
    return fetchWithErrors(
        'http://localhost:8081/teams',
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },

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

/**
 * Gets the profile of a team. The profile consists of basic info, in addition to complex queries
 * providing more detailed info on the team.
 * This functions makes a get call to the backend and returns an object that
 * contains all the info of a team.
 * Return: Object with team info
 */
export function getTeamProfile(teamId, season) {
    return fetchWithErrors(
        `http://localhost:8081/teams/profile/`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                teamId,
                season,
            })
        }
    )
        .then((res) => {
            return res;
        })
        .catch((err) => {
            alert(err);
        })
}