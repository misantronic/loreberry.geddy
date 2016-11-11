const _ = require('underscore');
const mysql = require('mysql');

module.exports = function (postId) {
    return new Promise(function (resolve/*, reject*/) {
        var connection = mysql.createConnection({
            host: process.env.MYSQL_SERVER,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PW,
            database: process.env.MYSQL_DB
        });

        connection.connect();
        connection.query('SELECT * from ge_postmeta WHERE post_id = '+ postId, function (err, rows, fields) {
            if (err) throw new Error(err);

            // filter translations
            rows = _.filter(rows, row => row.meta_key.indexOf('embed.') === 0);

            // filter fields
            rows = _.map(rows, row => ({ key: row.meta_key, value: row.meta_value }));

            // map as object
            rows = _.reduce(rows, function (memo, row) {
                memo[row.key] = row.value;

                return memo;
            }, {});

            resolve(rows, fields);
        });
        connection.end();
    });
};