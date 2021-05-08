import React, { useEffect, useState } from 'react';
import api from '../api';
import PageNavbar from './PageNavbar';

function League() {
  const [leagueList, setLeagueList] = useState([]);

  useEffect(() => {
    api.leagues.getAllLeagues()
      .then((apiLeagueList) => {
        setLeagueList(apiLeagueList)
      });
  }, [])

  return (
    <div className="Dashboard">

      <PageNavbar active="dashboard" />
      <div style={{ width: "80%", alignContent: "center" }}>
        {leagueList.map((league) => {
          return (
            <nav class="navbar navbar-light bg-light">
              <div class="container-fluid">
                <a class="navbar-brand" href="#">{league.league}</a>
              </div>
            </nav>)
        })}
      </div>
    </div>


  )
}

export default League;