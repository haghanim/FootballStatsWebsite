import { fetchWithErrors } from './';

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