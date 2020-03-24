var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    insecureAuth : true,
    user: 'root',
    password: 'root',
    database: 'tweets',
    charset: 'utf8mb4'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

module.exports = connection;