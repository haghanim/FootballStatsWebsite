import { fetchWithErrors } from './';

export function getAllPlayers() {
    return fetchWithErrors(
        'http:localhost:8081/players',
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

export function getPlayerProfile(playerId) {
    return fetchWithErrors(
        `http:localhost:8081/players/getprofile/${playerId}`,
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