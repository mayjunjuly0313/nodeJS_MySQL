var mysql = require('mysql');

var db = mysql.createConnection({
  host: '',
  user: '',
  password: '',
  database: '',
});
ß;
db.connect();

module.exports = db;
