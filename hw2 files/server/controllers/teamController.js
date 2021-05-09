const config = require('../db-config');
const mysql = require('mysql');
config.connectionLimit = 10;
const connection = mysql.createPool(config);

async function getAllteams() {
    var query = `
    SELECT *
    FROM team;`;
    return new Promise((resolve, reject) => {
        connection.query(query, function (err, rows, fields) {
            if (err) {
                reject(new Error(err));
            }
            else {
                resolve(rows);
            }
        });
    })
}

module.exports = {getAllteams};