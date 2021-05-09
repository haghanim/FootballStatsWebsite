const config = require('../db-config');
const mysql = require('mysql');
config.connectionLimit = 10;
const connection = mysql.createPool(config);

async function getAllteams() {
    var query = `
    SELECT *
    FROM team;`;
    connection.query(query, function (err, rows, fields) {
        if (err) {
            throw new Error(err)
        }
        else {
            return rows;
        }
    });
}