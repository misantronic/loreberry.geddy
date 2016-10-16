const Promise = require('promise');
const redis = require('./../redis');

module.exports = function (token) {
    return new Promise(function (resolve) {
        redis.del('token.' + token);

        resolve(true);
    });
};