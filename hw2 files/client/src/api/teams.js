import { fetchWithErrors } from './';

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