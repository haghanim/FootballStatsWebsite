import * as players from './players';
import * as teams from './teams';
import * as leagues from './leagues'


const api = {
    players,
    teams,
    leagues,
}

export function fetchWithErrors(...args) {
    return fetch(...args).then((res) => {
        if (!res.ok) {

            return res.json().then(({ errMsg }) => {
                ////console.log.log(errMsg)
                throw new Error(errMsg);
            });
        }
        return res.json();
    });
}

export default api;