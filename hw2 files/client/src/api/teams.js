import { fetchWithErrors } from './';

export function getAllTeams() {
    return fetchWithErrors(
        'http:localhost:8081/teams',
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

export function getTeamProfile(teamId) {
    return fetchWithErrors(
        `http:localhost:8081/team/getprofile/${teamIdId}`,
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }
    )
        .then((res) => {
            return res;
        })
        .catch((err) => {
            alert(err);
        })
}